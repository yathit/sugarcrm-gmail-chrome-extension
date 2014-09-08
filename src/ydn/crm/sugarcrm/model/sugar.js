// Copyright 2014 YDN Authors. All Rights Reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


/**
 * @fileoverview SugarCRM service model.
 *
 * Dispatch 'login' event.
 *                                                 `
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.sugarcrm.model.Sugar');
goog.require('goog.events.EventHandler');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.sugarcrm.model.ImmutableRecord');
goog.require('ydn.crm.sugarcrm.model.events');
goog.require('ydn.debug.error.ConstraintError');



/**
 * SugarCRM server info
 * @param {SugarCrm.About} about setup for particular domain.
 * @param {Array.<SugarCrm.ModuleInfo>|Object.<SugarCrm.ModuleInfo>} arr
 * @param {SugarCrm.ServerInfo=} opt_info
 * @constructor
 * @extends {goog.events.EventTarget}
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugarcrm.model.Sugar = function(about, arr, opt_info) {
  goog.base(this);
  /**
   * @protected
   * @type {SugarCrm.About}
   */
  this.about = about;
  var modules_info = {};
  if (goog.isArray(arr)) {
    for (var i = 0; i < arr.length; i++) {
      modules_info[arr[i]['module_name']] = arr[i];
    }
  } else {
    modules_info = arr;
  }
  /**
   * @protected
   * @final
   * @type {Object.<SugarCrm.ModuleInfo>}
   */
  this.module_info = modules_info;

  /**
   * @protected
   * @type {SugarCrm.ServerInfo}
   */
  this.info = opt_info || /** @type {SugarCrm.ServerInfo} */ ({});

  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);
  /**
   * User record.
   * @type {!ydn.crm.sugarcrm.Record}
   * @private
   */
  this.user_ = new ydn.crm.sugarcrm.Record(this.getDomain(), ydn.crm.sugarcrm.ModuleName.USERS);
  this.initUser_();
  var pipe = ydn.msg.getMain();
  this.handler.listen(pipe, [ydn.crm.Ch.SReq.LOGIN, ydn.crm.Ch.Req.HOST_PERMISSION],
      this.handleMessage);

  if (ydn.crm.sugarcrm.model.Sugar.DEBUG) {
    this.sugar_random_id_ = Math.random();
  }

  /**
   * @type {?boolean}
   * @private
   */
  this.is_version_7_ = null;
};
goog.inherits(ydn.crm.sugarcrm.model.Sugar, goog.events.EventTarget);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugarcrm.model.Sugar.DEBUG = false;


/**
 * Events
 * @enum {string}
 */
ydn.crm.sugarcrm.model.Sugar.Event = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  HOST_ACCESS_GRANT: 'hag'
};


/**
 * Handle message from channel.
 * @param {ydn.msg.Event} e
 */
ydn.crm.sugarcrm.model.Sugar.prototype.handleMessage = function(e) {
  if (e.type == ydn.crm.Ch.SReq.LOGIN) {
    var about = /** @type {SugarCrm.About} */ (e.getData());
    if (!!about && about.domain == this.getDomain()) {
      this.setAbout(about);
    }
  } else if (e.type == ydn.crm.Ch.Req.HOST_PERMISSION && this.about) {
    var msg = e.getData();
    if (msg['grant'] && msg['grant'] == this.getDomain()) {
      this.about.hostPermission = true;
      this.dispatchEvent(new goog.events.Event(ydn.crm.sugarcrm.model.Sugar.Event.HOST_ACCESS_GRANT));
    }
  }
};


/**
 * Get version.
 * @return {string} SugarCrmVersion
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getVersion = function() {
  return this.info ? this.info.version || '' : '';
};


/**
 * Check require version.
 * <pre>
 *   sugar.hasVersion('7');
 * </pre>
 * @param {string} ver sugarcrm version, such as '7'.
 * @return {boolean} return true if sugarcrm version is higher or equal to
 * given version.
 * @private
 */
ydn.crm.sugarcrm.model.Sugar.prototype.hasVersion_ = function(ver) {
  return goog.string.compareVersions(this.getVersion(), ver) >= 0;
};


/**
 * @return {?boolean} true if SugarCrm backend has version 7.
 */
ydn.crm.sugarcrm.model.Sugar.prototype.isVersion7 = function() {
  if (!goog.isDefAndNotNull(this.is_version_7_) && this.info) {
    this.is_version_7_ = this.hasVersion_('7');
  }
  return this.is_version_7_;
};


/**
 * Set about.
 * @param {SugarCrm.About} about
 */
ydn.crm.sugarcrm.model.Sugar.prototype.setAbout = function(about) {
  if (!about) {
    return;
  }
  goog.asserts.assert((about.domain == this.getDomain()),
      'domain must not change from ' + this.getDomain() + ' to ' + about.domain);
  var was_login = this.about.isLogin;
  var is_login = !!about && about.isLogin;
  this.about = about;
  if (!was_login && is_login) {
    this.dispatchEvent(new goog.events.Event(ydn.crm.sugarcrm.model.Sugar.Event.LOGIN, this));
  } else if (was_login && !is_login) {
    this.dispatchEvent(new goog.events.Event(ydn.crm.sugarcrm.model.Sugar.Event.LOGOUT, this));
  }
};


/**
 * @return {boolean}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.isLogin = function() {
  return !!this.about.isLogin;
};


/**
 * Initialize user.
 * @private
 */
ydn.crm.sugarcrm.model.Sugar.prototype.initUser_ = function() {
  if (this.about) {
    if (this.about.userName) {
      this.send(ydn.crm.Ch.SReq.LOGIN_USER).addCallback(function(obj) {
        if (obj && obj['id']) {
          this.user_.setData(/** @type {SugarCrm.Record} */ (obj));
        }
      }, this);
    }

  }
};


/**
 * Update login status, host permission, etc.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.updateStatus = function() {
  return this.send(ydn.crm.Ch.SReq.ABOUT).addCallback(function(about) {
    this.setAbout(about);
  }, this);
};


/**
 * @return {string} sugarcrm user id. This is About.userName
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getUserName = function() {
  return this.about ? this.about.userName || '' : '';
};


/**
 * @return {?string}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getUserLabel = function() {
  return this.user_.value('name') || this.about.userName || null;
};


/**
 * Get SugarCRM entry of login user.
 * @return {!ydn.crm.sugarcrm.Record} SugarCRM User record.
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getUser = function() {
  return this.user_;
};


/**
 * Get message channel to send to background worker thread.
 * @return {ydn.msg.Channel}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getChannel = function() {
  return ydn.msg.getChannel(ydn.msg.Group.SUGAR, this.getDomain());
};


/**
 * @param {ydn.crm.sugarcrm.ModuleName} name
 * @return {SugarCrm.ModuleInfo}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getModuleInfo = function(name) {
  return this.module_info[name];
};


/**
 * @return {boolean}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.hasHostPermission = function() {
  return !!this.about.hostPermission;
};


/**
 * Set host permission.
 * @param {boolean} grant
 */
ydn.crm.sugarcrm.model.Sugar.prototype.setHostPermission = function(grant) {
  this.about.hostPermission = grant;
};


/**
 * @return {string}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getDomain = function() {
  return this.about.domain;
};


/**
 * @return {?string}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getBaseUrl = function() {
  return this.about.baseUrl || null;
};


/**
 * Get sugar crm instance url.
 * @return {string}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getHomeUrl = function() {
  return this.about.baseUrl ? this.about.baseUrl : 'https://' + this.about.domain;
};


/**
 * Get SugarCRM create new email template url.
 * @return {string}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getNewEmailTemplateUrl = function() {
  return this.getHomeUrl() +
      '/index.php?module=EmailTemplates&action=EditView&return_module=EmailTemplates&return_action=DetailView';
};


/**
 * @param {SugarCrm.ServerInfo} info
 */
ydn.crm.sugarcrm.model.Sugar.prototype.setInfo = function(info) {
  if (!info) {
    return;
  }
  this.info = info;
};


/**
 * @return {!SugarCrm.ServerInfo}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getInfo = function() {
  return /** @type {!SugarCrm.ServerInfo} */ (goog.object.clone(this.info));
};


/**
 * Get url for contact entry of given id
 * @param {string} module
 * @param {string} id
 * @return {string}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.getRecordViewLink = function(module, id) {
  if (this.isVersion7()) {
    return ydn.crm.sugarcrm.getViewLinkV7(this.getHomeUrl(), module, id);
  } else {
    return ydn.crm.sugarcrm.getViewLinkV6(this.getHomeUrl(), module, id);
  }
};


/**
 * Set url.
 * @param {string} url
 */
ydn.crm.sugarcrm.model.Sugar.prototype.setUrl = function(url) {
  url = goog.string.startsWith(url, 'http') ? url : 'https://' + url;
  var uri = new goog.Uri(url);
  if (this.getDomain() != uri.getDomain()) {
    throw new ydn.debug.error.ConstraintError('Domain name cannot be change from ' +
        this.getDomain() + ' to ' + uri.getDomain());
  }
};


/**
 * Do login.
 * @param {string} username
 * @param {string} password
 * @return {goog.async.Deferred}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.doLogin = function(username, password) {
  var info = {};
  info.domain = this.getDomain();
  info.baseUrl = this.getBaseUrl();
  info.username = username;
  info.password = password;
  return this.send(ydn.crm.Ch.SReq.LOGIN, info)
      .addCallback(function(data) {
        this.setAbout(data);
      }, this);
};


/**
 * Do login.
 * @param {string} url
 * @param {string} username
 * @param {string} password
 * @return {goog.async.Deferred}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.createNew = function(url, username, password) {
  if (!/https?:\/\//.test(url)) {
    url = 'https://' + url;
  }
  var domain = new goog.Uri(url).getDomain();
  if (domain != this.getDomain()) {
    throw new Error('domain name must not be changed from ' + this.getDomain() +
        ' to ' + domain);
  }
  var info = {};
  info.domain = domain;
  info.baseUrl = url;
  info.username = username;
  info.password = password;
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.NEW_SUGAR, info)
      .addCallback(function(data) {
        this.setAbout(data);
      }, this);
};


/**
 * @param {string} req
 * @param {*=} opt_data
 * @return {!ydn.async.Deferred}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.send = function(req, opt_data) {
  return ydn.msg.getChannel(ydn.msg.Group.SUGAR, this.getDomain()).send(req, opt_data);
};


/**
 * Query list of records.
 * @param {string} m_name
 * @param {string=} opt_order Module field name to order by.
 * @param {(ydn.db.KeyRange|string)=} opt_range key or key range.
 * @param {boolean=} opt_prefix do prefix search.
 * @param {number=} opt_limit limit
 * @param {number=} opt_offset offset
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.listRecords = function(m_name, opt_order, opt_range,
                                                           opt_prefix, opt_limit, opt_offset) {
  goog.asserts.assert(ydn.crm.sugarcrm.Modules.indexOf(m_name) >= 0, m_name);
  var query = {
    'store': m_name
  };
  if (opt_order) {
    query['index'] = opt_order;
  }
  if (opt_range) {
    if (opt_range instanceof ydn.db.KeyRange) {
      query['range'] = opt_range.toJSON();
    } else {
      query['key'] = opt_range;
    }
  }
  query['prefix'] = !!opt_prefix;
  if (opt_limit) {
    query['limit'] = opt_offset;
  }
  if (opt_offset) {
    query['offset'] = opt_offset;
  }
  return this.getChannel().send(ydn.crm.Ch.SReq.QUERY, [query]);
};


/**
 * Full text search query.
 * @param {string} module_name filter by module
 * @param {string} q query term.
 * @param {boolean=} opt_fetch_full fetch full record
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.searchRecords = function(module_name, q, opt_fetch_full) {
  var query = {
    'store': module_name,
    'index': 'name',
    'q': q,
    'fetchFull': !!opt_fetch_full
  };
  if (module_name == ydn.crm.sugarcrm.ModuleName.NOTES) {
    query['index'] = 'content';
  }
  return this.getChannel().send(ydn.crm.Ch.SReq.SEARCH, [query]);
};


/**
 * Archive an email to sugarcrm.
 * @param {ydn.crm.EmailInfo} info
 * @param {ydn.crm.sugarcrm.ModuleName=} opt_parent_module
 * @param {string=} opt_parent_id
 * @return {!ydn.async.Deferred}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.archiveEmail = function(info,
    opt_parent_module, opt_parent_id) {
  var types = ['archived', 'campaign', 'draft', 'inbound', 'out'];
  var div = document.createElement('div');
  div.innerHTML = info.html;
  // ISO: "2014-04-02T03:32:20.522Z"
  // SugarCRM: "2013-09-20 22:10:00"
  var date_str = ydn.crm.sugarcrm.utils.isValidDate(info.date_sent) ?
      ydn.crm.sugarcrm.utils.toDateString(info.date_sent) : '';
  var obj = {
    'assigned_user_id': this.getUserName(),
    'assigned_user_name': this.getUserLabel(),
    'type': 'archived',
    'date_sent': date_str,
    'description': div.textContent,
    'description_html': info.html,
    'name': info.subject,
    'from_addr': info.from_addr,
    'to_addrs': info.to_addrs,
    'parent_id': opt_parent_id || '',
    'parent_type': opt_parent_module || '',
    'mailbox_id': info.mailbox_id || '',
    'message_id': info.message_id || '',
    'status': 'read'
  };
  return this.send(ydn.crm.Ch.SReq.NEW_RECORD, {
    'module': ydn.crm.sugarcrm.ModuleName.EMAILS,
    'record': obj
  });
};


/**
 * Thoroughly find records using prefix list and full text serach.
 * @param {string} q query term.
 * @param {string} module_name filter by module
 * @return {!ydn.async.Deferred}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.findRecords = function(q, module_name) {
  var ydf = new ydn.async.Deferred();
  var results = [];
  var total = 3;
  var count = 0;
  var onSuccess = function(x) {
    count++;
    if (goog.isArray(x)) {
      ydf.notify(x);
      results = results.concat(x);
    }
    if (count == total) {
      ydf.callback(results);
    }
  };
  this.listRecords(module_name, 'ydn$emails', q, true).addBoth(onSuccess, this);
  this.listRecords(module_name, 'ydn$phones', q, true).addBoth(onSuccess, this);
  this.searchRecords(module_name, q, false).addBoth(onSuccess, this);
  return ydf;
};


/**
 * Create a new Notes record.
 * @param {ydn.crm.sugarcrm.Record} record Record to be saved.
 * @return {!ydn.async.Deferred}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.saveRecord = function(record) {
  var data = {
    'module': record.getModule(),
    'record': record.getData()
  };
  return this.send(ydn.crm.Ch.SReq.PUT_RECORD, data);
};


/**
 * Get list of sugarcrm instance, of which login.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugarcrm.model.Sugar.list = function() {
  var user = ydn.crm.ui.UserSetting.getInstance();
  return ydn.msg.getChannel().send('list-sugarcrm').addCallback(function(abouts) {
    var models = [];
    var dfs = [];
    for (var i = 0; i < abouts.length; i++) {
      var about = /** @type {SugarCrm.About} */ (abouts[i]);
      if (about.isLogin) {
        dfs.push(user.getModuleInfo(about.domain).addCallback(function(info) {
          return new ydn.crm.sugarcrm.model.Sugar(this, info);
        }, about));
      }
    }
    return goog.async.DeferredList.gatherResults(dfs);
  });
};


/**
 * @return {ydn.crm.sugarcrm.model.Sugar}
 */
ydn.crm.sugarcrm.model.Sugar.prototype.clone = function() {
  return new ydn.crm.sugarcrm.model.Sugar(this.about, this.module_info);
};


/**
 * @override
 * @protected
 */
ydn.crm.sugarcrm.model.Sugar.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.info = null;
  this.handler.dispose();
  this.handler = null;
};



if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugarcrm.model.Sugar.prototype.toString = function() {
    var s = 'ydn.crm.sugarcrm.model.Sugar:' + this.getDomain();
    if (ydn.crm.sugarcrm.model.Sugar.DEBUG) {
      s += this.sugar_random_id_;
    }
    return s;
  };
}



