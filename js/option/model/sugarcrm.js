/**
 * @fileoverview SugarCRM model.
 *
 * User: kyawtun
 * Date: 2/3/14
 */



/**
 * Create a SugarCRM model.
 * @param {SugarCrm.About} data
 * @constructor
 */
var SugarCrmModel = function(data) {
  /**
   * @type {SugarCrm.About}
   */
  this.data = data;
  /**
   * @type {SugarCrm.ServerInfo}
   */
  this.info = null;
};


/**
 * Return detail.
 * @return {SugarCrm.About}
 */
SugarCrmModel.prototype.getDetails = function() {
  return this.data;
};


/**
 * Get domain name of the instance.
 * @return {string?}
 */
SugarCrmModel.prototype.getDomain = function() {
  return this.data ? this.data.domain : null;
};


/**
 * Check login status.
 * @return {boolean}
 */
SugarCrmModel.prototype.isLogin = function() {
  return this.data ? !!this.data.isLogin : false;
};


/**
 * Query host permission.
 * @param {function(this: T, boolean)} cb
 * @param {T} scope
 * @template T
 */
SugarCrmModel.prototype.hasHostPermission = function(cb, scope) {
  var permissions = {
    origins: ['http://' + this.data.domain + '/*', 'https://' + this.data.domain + '/*']
  };
  chrome.permissions.contains(permissions, function(grant) {
    // console.log(scope, grant);
    cb.call(scope, grant);
  });
};


/**
 * Request host permission.
 * @param {function(this: T, boolean)} cb
 * @param {T} scope
 * @template T
 */
SugarCrmModel.prototype.requestHostPermission = function(cb, scope) {
  var domain = this.getDomain();
  console.assert(!!domain);
  var permissions = {
    origins: ['http://' + domain + '/*', 'https://' + domain + '/*']
  };
  chrome.permissions.request(permissions, function(grant) {
    // console.log(permission, grant);
    cb.call(scope, grant);
  });
};


/**
 * Set domain.
 * @param {string} url sugarcrm instance url
 * @param {function(this: T, (Error|SugarCrm.ServerInfo))=} cb callback.
 * @param {T=} scope
 * @template T
 */
SugarCrmModel.prototype.setInstanceUrl = function(url, cb, scope) {
  var url = url.trim().toLocaleLowerCase();
  var domain = url.replace(/^https?:\/\//, '');
  domain = domain.replace(/\/.*/, ''); // remove after /
  if (url.length < 3 || !/\./.test(url)) {
    cb.call(scope, new Error('Invalid instance ' + url));
    return;
  }
  if (this.data && this.data.domain == domain) {
    if (cb) {
      cb.call(scope, this.info);
    }
    return;
  }
  ydn.msg.getChannel().send('sugar-server-info', url).addCallbacks(function(info) {
    this.data = {
      baseUrl: /^http/.test(url) ? url : null,
      domain: domain,
      isLogin: false
    };
    this.info = info;
    if (cb) {
      cb.call(scope, info);
    }
  }, function(e) {
    if (cb) {
      cb.call(scope, e);
    }
  }, this);
};


/**
 * Get Sugarcrm basic info.
 * @param {function(this: T, (Error|SugarCrm.About))} cb
 * @param {T} scope
 * @template T
 */
SugarCrmModel.prototype.getInfo = function(cb, scope) {
  if (!this.about || !this.about.domain) {
    cb.call(scope, null);
    return;
  }
  if (this.info) {
    cb.call(scope, this.info);
    return;
  }
  ydn.msg.getChannel().send('sugar-server-info', domain).addCallbacks(function(info) {
    this.info = info;
    cb.call(scope, info);
  }, function(e) {
    cb.call(scope, e);
  }, this);
};


/**
 * Login to sugarcrm.
 * @param {string} url
 * @param {string} username
 * @param {string} password
 * @param {function(this: T, (Error|SugarCrm.About))} cb
 * @param {T} scope
 * @template T
 */
SugarCrmModel.prototype.login = function(url, username, password, cb, scope) {
  this.setInstanceUrl(url);
  if (username) {
    this.data.userName = username;
  }
  if (password) {
    // keep hashed password only.
    this.data.password = CryptoJS.MD5(password).toString();
    this.data.hashed = true;
  }
  var permission = {'origins': ['http://' + this.data.domain + '/*',
    'https://' + this.data.domain + '/*']};
  var me = this;
  chrome.permissions.request(permission, function(grant) {
    // whether user give permission or not, we still continue login.
    // console.log(permission, me.data);
    ydn.msg.getChannel().send('new-sugarcrm', me.data).addCallbacks(function(info) {
      console.log(info);
      me.data = info;
      cb.call(scope, info);
    }, function(e) {
      cb.call(scope, e);
    }, me);
  });
};


/**
 * List SugarCrm available.
 * @param {function(this: T, Array.<SugarCrmModel>)} cb
 * @param {T} scope
 * @template T
 */
SugarCrmModel.list = function(cb, scope) {
  ydn.msg.getChannel().send('list-sugarcrm').addCallback(function(abouts) {
    var models = [];
    for (var i = 0; i < abouts.length; i++) {
      var about = /** @type {SugarCrm.About} */ (abouts[i]);
      models[i] = new SugarCrmModel(about);
    }
    cb.call(scope, models);
  });
};


