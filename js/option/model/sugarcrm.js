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
   * @private
   */
  this.about_ = data;
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
  return this.about_;
};


/**
 * Get domain name of the instance.
 * @return {string?}
 */
SugarCrmModel.prototype.getDomain = function() {
  return this.about_ ? this.about_.domain : null;
};


/**
 * Check login status.
 * @return {boolean}
 */
SugarCrmModel.prototype.isLogin = function() {
  return this.about_ ? !!this.about_.isLogin : false;
};


/**
 * @param {string} url
 * @return {*}
 */
SugarCrmModel.getPermissionObject = function(url) {
  try {
    var u = new URL(url);
    return {'origins': [u.protocol + '//' + u.hostname + '/*']};
  } catch (e) {
    return null;
  }
};


/**
 * Chrome host permission request object.
 * @return {{origins: (Array.<string>|undefined), permissions: (Array.<string>|undefined)}}
 */
SugarCrmModel.prototype.getPermissionObject = function() {

  return SugarCrmModel.getPermissionObject(this.about_.baseUrl);
};


/**
 * Query host permission.
 * @param {function(this: T, boolean)=} opt_cb
 * @param {T} scope
 * @template T
 * @return {boolean}
 */
SugarCrmModel.prototype.hasHostPermission = function(opt_cb, scope) {
  var permissions = this.getPermissionObject();
  chrome.permissions.contains(permissions, function(grant) {
    // console.log(scope, grant);
    if (opt_cb) {
      opt_cb.call(scope, grant);
    }
  });
  return !!this.about_ && !!this.about_.hostPermission;
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
  var permissions = this.getPermissionObject();
  chrome.permissions.request(permissions, function(grant) {
    // console.log(permission, grant);
    cb.call(scope, grant);
  });
};


/**
 * Set domain.
 * @param {string} url sugarcrm instance url
 */
SugarCrmModel.prototype.setInstanceUrl = function(url) {
  url = url.trim();
  var domain = url.replace(/^https?:\/\//, '');
  domain = domain.replace(/\/.*/, ''); // remove after /
  if (url.length < 3 || !/\./.test(url)) {
    return;
  }

  if (!this.about_) {
    this.about_ = {
      domain: domain,
      isLogin: false
    };
  }
  this.about_.baseUrl = url;

};


/**
 * Get Sugarcrm basic info.
 * @param {function(this: T, (Error|SugarCrm.About))} cb
 * @param {T} scope
 * @template T
 */
SugarCrmModel.prototype.getInfo = function(cb, scope) {
  if (!this.about_ || !this.about_.baseUrl) {
    cb.call(scope, null);
    return;
  }
  if (this.info) {
    cb.call(scope, this.info);
    return;
  }
  ydn.msg.getChannel().send('sugar-server-info', this.about_.baseUrl).addCallbacks(function(info) {
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
 * @param {string} provider
 * @param {function(this: T, (Error|SugarCrm.About))} cb
 * @param {T} scope
 * @template T
 */
SugarCrmModel.prototype.login = function(url, username, password, provider, cb, scope) {
  this.setInstanceUrl(url);
  window.console.assert(!!this.about_, 'Not initialized');
  if (username) {
    this.about_.userName = username;
  }
  if (password) {
    this.about_.password = password;
  }
  this.about_.provider = provider;

  var details = /** @type {SugarCrm.Details} */({
    about: this.about_,
    serverInfo: this.info,
    credential: {}
  });

  if (username) {
    details.credential.userName = username;
  }
  if (password) {
    details.credential.password = password;
  }
  details.credential.provider = provider;

  var permission = this.getPermissionObject();
  var me = this;
  chrome.permissions.request(permission, function(grant) {
    // whether user give permission or not, we still continue login.
    // console.log(permission, me.about_);
    ydn.msg.getChannel().send('new-sugarcrm', details).addCallbacks(function(info) {
      // console.log(info);
      me.about_ = info;
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

