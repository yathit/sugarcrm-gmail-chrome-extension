// Copyright 2014 YDN Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview SugarCRM service model.
 *                                                 `
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.sugar.model.Sugar');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.sugar.model.Module');
goog.require('ydn.crm.sugar.model.events');
goog.require('ydn.debug.error.ConstraintError');



/**
 * SugarCRM server info
 * @param {SugarCrm.About} about setup for particular domain.
 * @param {Object.<SugarCrm.ModuleInfo>} modules_info
 * @constructor
 * @extends {goog.events.EventTarget}
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugar.model.Sugar = function(about, modules_info) {
  goog.base(this);
  /**
   * @protected
   * @type {SugarCrm.About}
   */
  this.about = about;
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
  this.info = /** @type {SugarCrm.ServerInfo} */ ({});
  /**
   * @type {goog.async.Deferred}
   * @private
   */
  this.ready_df_ = null;

  /**
   * User setting.
   * @type {Object}
   */
  this.user_setting = null;
  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);
};
goog.inherits(ydn.crm.sugar.model.Sugar, goog.events.EventTarget);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.Sugar.DEBUG = false;


/**
 * @return {boolean}
 */
ydn.crm.sugar.model.Sugar.prototype.isLogin = function() {
  return !!this.about.isLogin;
};


/**
 * @return {ydn.msg.Channel}
 */
ydn.crm.sugar.model.Sugar.prototype.getChannel = function() {
  return ydn.msg.getChannel(ydn.msg.Group.SUGAR, this.getDomain());
};


/**
 * Set user setting.
 * @param {Object} setting
 */
ydn.crm.sugar.model.Sugar.prototype.setUserSetting = function(setting) {
  this.user_setting = setting;
};


/**
 * Get user setting.
 * @return {Object}
 */
ydn.crm.sugar.model.Sugar.prototype.getUserSetting = function() {
  return this.user_setting || null;
};


/**
 * @param {ydn.crm.sugar.ModuleName} name
 * @return {SugarCrm.ModuleInfo}
 */
ydn.crm.sugar.model.Sugar.prototype.getModuleInfo = function(name) {
  return this.module_info[name];
};


/**
 * @return {boolean}
 */
ydn.crm.sugar.model.Sugar.prototype.hasHostPermission = function() {
  return !!this.about.hostPermission;
};


/**
 * Set host permission.
 * @param {boolean} grant
 */
ydn.crm.sugar.model.Sugar.prototype.setHostPermission = function(grant) {
  this.about.hostPermission = grant;
};


/**
 * @return {string?}
 */
ydn.crm.sugar.model.Sugar.prototype.getUserName = function() {
  return this.about.userName || null;
};


/**
 * @return {string}
 */
ydn.crm.sugar.model.Sugar.prototype.getDomain = function() {
  return this.about.domain;
};


/**
 * @return {string?}
 */
ydn.crm.sugar.model.Sugar.prototype.getBaseUrl = function() {
  return this.about.baseUrl || null;
};


/**
 * Get sugar crm instance url.
 * @return {string}
 */
ydn.crm.sugar.model.Sugar.prototype.getHomeUrl = function() {
  return this.about.baseUrl ? this.about.baseUrl : 'https://' + this.about.domain;
};


/**
 * @param {SugarCrm.About} about
 */
ydn.crm.sugar.model.Sugar.prototype.setAbout = function(about) {
  if (!about) {
    return;
  }
  goog.asserts.assert((about.domain == this.getDomain()),
      'domain must not change from ' + this.getDomain() + ' to ' + about.domain);

  this.about = about;
};


/**
 * @param {SugarCrm.ServerInfo} info
 */
ydn.crm.sugar.model.Sugar.prototype.setInfo = function(info) {
  if (!info) {
    return;
  }
  this.info = info;
};


/**
 * @return {!SugarCrm.ServerInfo}
 */
ydn.crm.sugar.model.Sugar.prototype.getInfo = function() {
  return /** @type {!SugarCrm.ServerInfo} */ (goog.object.clone(this.info));
};


/**
 * Set url.
 * @param {string} url
 */
ydn.crm.sugar.model.Sugar.prototype.setUrl = function(url) {
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
ydn.crm.sugar.model.Sugar.prototype.doLogin = function(username, password) {
  var info = {};
  info.domain = this.getDomain();
  info.baseUrl = this.getBaseUrl();
  info.username = username;
  info.password = password;
  return this.send(ydn.crm.Ch.SReq.LOGIN, info)
      .addCallback(function(data) {
        this.about = data;
      }, this);
};


/**
 * Do login.
 * @param {string} url
 * @param {string} username
 * @param {string} password
 * @return {goog.async.Deferred}
 */
ydn.crm.sugar.model.Sugar.prototype.createNew = function(url, username, password) {
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
        this.about = data;
      }, this);
};


/**
 * @param {string} req
 * @param {*=} opt_data
 * @return {!ydn.async.Deferred}
 */
ydn.crm.sugar.model.Sugar.prototype.send = function(req, opt_data) {
  return ydn.msg.getChannel(ydn.msg.Group.SUGAR, this.getDomain()).send(req, opt_data);
};


/**
 * Sniff server info.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.Sugar.prototype.onReady = function() {
  if (!this.ready_df_) {
    this.ready_df_ = this.send('server-info');
    this.ready_df_.addCallback(function(x) {
      if (x) {
        this.setInfo(x['info']);
        this.setAbout(x['about']);
      } else {
        this.ready_df_ = null;
      }
    }, this);
  }

  return this.ready_df_;
};


/**
 * Query list of records.
 * @param {string} module
 * @param {string=} opt_order
 * @param {(ydn.db.KeyRange|string)=} opt_range key or key range.
 * @param {boolean=} opt_prefix prefix search.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.Sugar.prototype.listRecords = function(module, opt_order, opt_range, opt_prefix) {
  goog.asserts.assert(ydn.crm.sugar.Modules.indexOf(module) >= 0, module);
  var query = {
    'store': module
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
  return this.getChannel().send(ydn.crm.Ch.SReq.LIST, [query]);
};


/**
 * Full text search query.
 * @param {string} module_name filter by module
 * @param {string} q query term.
 * @param {boolean=} opt_fetch_full fetch full record
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.Sugar.prototype.searchRecords = function(module_name, q, opt_fetch_full) {
  var query = {
    'store': module_name,
    'index': 'name',
    'q': q,
    'fetchFull': !!opt_fetch_full
  };
  if (module_name == ydn.crm.sugar.ModuleName.NOTES) {
    query['index'] = 'content';
  }
  return this.getChannel().send(ydn.crm.Ch.SReq.SEARCH, [query]);
};


/**
 * Thoroughly find records using prefix list and full text serach.
 * @param {string} q query term.
 * @param {string} module_name filter by module
 * @return {!ydn.async.Deferred}
 */
ydn.crm.sugar.model.Sugar.prototype.findRecords = function(q, module_name) {
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
 * @param {ydn.crm.sugar.Record} record
 * @return {!ydn.async.Deferred}
 */
ydn.crm.sugar.model.Sugar.prototype.saveRecord = function(record) {
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
ydn.crm.sugar.model.Sugar.list = function() {
  var user = ydn.crm.inj.UserSetting.getInstance();
  return ydn.msg.getChannel().send('list-sugarcrm').addCallback(function(abouts) {
    var models = [];
    var dfs = [];
    for (var i = 0; i < abouts.length; i++) {
      var about = /** @type {SugarCrm.About} */ (abouts[i]);
      if (about.isLogin) {
        dfs.push(user.getModuleInfo(about.domain).addCallback(function(info) {
          return new ydn.crm.sugar.model.Sugar(this, info);
        }, about));
      }
    }
    return goog.async.DeferredList.gatherResults(dfs);
  });
};


/**
 * @override
 * @protected
 */
ydn.crm.sugar.model.Sugar.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.info = null;
  this.user_setting = null;
  this.handler.dispose();
  this.handler = null;
};



if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugar.model.Sugar.prototype.toString = function() {
    return 'ydn.crm.sugar.model.Sugar:' + this.getDomain();
  };
}



