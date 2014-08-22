/**
 * @fileoverview Provide user setting.
 */


goog.provide('ydn.crm.ui.UserSetting');
goog.require('goog.asserts');
goog.require('goog.async.DeferredList');
goog.require('goog.log');
goog.require('templ.ydn.crm.app');
goog.require('ydn.crm.Ch');
goog.require('ydn.object');
goog.require('ydn.ui.MessageBox');



/**
 * User setting.
 * @constructor
 */
ydn.crm.ui.UserSetting = function() {
  /**
   * @type {?YdnApiUser}
   */
  this.login_info = null;
  this.user_setting = null;

  /**
   * User setting for sugarcrm.
   * @type {?CrmApp.SugarCrmSetting}
   * @private
   */
  this.sugar_settings_ = null;

  /**
   * @type {goog.async.Deferred}
   * @private
   */
  this.df_ = null;

  ydn.crm.shared.init(); // make sure initialized.
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.UserSetting.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.UserSetting.prototype.logger = goog.log.getLogger('ydn.crm.ui.UserSetting');


/**
 * True if login to YDN server.
 * @return {boolean}
 */
ydn.crm.ui.UserSetting.prototype.isLogin = function() {
  return !!this.login_info && this.login_info.is_login;
};


/**
 * @return {?YdnApiUser}
 */
ydn.crm.ui.UserSetting.prototype.getUserInfo = function() {
  return this.login_info; // should return cloned object.
};


/**
 * @return {ydn.crm.ui.UserSetting}
 */
ydn.crm.ui.UserSetting.getInstance = function() {
  if (!ydn.crm.ui.UserSetting.instance_) {
    ydn.crm.ui.UserSetting.instance_ = new ydn.crm.ui.UserSetting();
  }
  return ydn.crm.ui.UserSetting.instance_;
};


/**
 * Return user set value or default. UI component need this to be readable
 * synchronously.
 * @return {ydn.crm.ui.ContextPanelPosition}
 */
ydn.crm.ui.UserSetting.prototype.getContextPanelPosition = function() {

  var val = ydn.crm.shared.getValueBySyncKey(ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION) ||
      ydn.crm.ui.ContextPanelPosition.INLINE;
  return /** @type {ydn.crm.ui.ContextPanelPosition} */ (val);
};


/**
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.onReady = function() {
  if (!this.df_) {
    // init data.
    var me = this;
    var req1 = new goog.async.Deferred();
    chrome.storage.sync.get(ydn.crm.base.SyncKey.USER_SETTING, function(val) {
      var x = val[ydn.crm.base.SyncKey.USER_SETTING];
      me.user_setting = x || ydn.crm.ui.UserSetting.USER_SETTING_DEFAULT;
      req1.callback(me.user_setting);
    });

    var req2 = ydn.msg.getChannel().send(ydn.crm.Ch.Req.LOGIN_INFO).addCallbacks(function(x) {
      if (!x) {
        this.logger.warning('login fail');
      }
      this.login_info = x;
    }, function(e) {
      this.login_info = null;
      this.logger.warning('login fail');
    }, this);

    this.df_ = goog.async.DeferredList.gatherResults([req1, req2]);
  }
  return this.df_;
};


/**
 * Get login email address to Yathit server. Call this method only after login.
 * @return {string} gdata_account Google account id, i.e., email address. If call
 * before ready cause assertion error.
 */
ydn.crm.ui.UserSetting.prototype.getGmail = function() {
  goog.asserts.assert(this.login_info, 'UserSetting not ready');
  return this.login_info.email;
};


/**
 * Initialize.
 * @param {string} name domain name.
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.getModuleInfo = function(name) {
  var channel = ydn.msg.getChannel(ydn.msg.Group.SUGAR, name);
  return this.onReady().branch().addCallback(function() {
    return channel.send(ydn.crm.Ch.SReq.INFO_MODULE).addCallback(function(x) {
      if (goog.isArray(x)) {
        for (var i = 0; i < x.length; i++) {
          this.fixSugarCrmModuleMeta(x[i]);
        }
      } else {
        this.fixSugarCrmModuleMeta(x);
      }
      return x;
    }, this);
  }, this);

};


/**
 * SugarCRM module has nasty habit of not declearing group name if previous
 * field name is similar to previous field name.
 * Also name, first_name, and last_name, full_name are not into name group.
 * email, email1, email2, etc are gorup into email.
 * @param {SugarCrm.ModuleInfo} info
 */
ydn.crm.ui.UserSetting.prototype.fixSugarCrmModuleMeta = function(info) {
  var last_field_name = '';
  var last_group = '';
  for (var name in info.module_fields) {
    /**
     * @type {SugarCrm.ModuleField}
     */
    var mf = info.module_fields[name];

    if (['created_by', 'created_by_name', 'date_entered', 'date_modified', 'deleted',
      'modified_user_id', 'modified_by_name',
      'id'].indexOf(name) >= 0) {
      mf.calculated = true;
    }

    if (['salutation', 'name', 'last_name', 'first_name', 'full_name'].indexOf(name) >= 0) {
      mf.group = 'name';
    } else if (/^email\d?$/.test(name)) {
      mf.group = 'email';
    } else if (/^phone?/.test(name)) {
      mf.group = 'phone';
    } else if (!mf.group && goog.string.startsWith(name, last_field_name)) {
      mf.group = last_group;
      continue;
    }
    last_field_name = name;
    last_group = mf.group;

  }
  // fix link field that does not have module name
  for (var name in info.link_fields) {
    /**
     * @type {SugarCrm.LinkField}
     */
    var lf = info.link_fields[name];
    if (name == 'contact' && !lf.module) {
      lf.module = 'Contacts';
    }
  }
  // console.log(info);
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.UserSetting.KEY_USER_SETTING = 'sugar-setting';


/**
 * Keys.
 * @enum {string}
 */
ydn.crm.ui.UserSetting.Key = {
  SUGAR: 'sugar'
};


/**
 * @const
 * @type {!Object}
 */
ydn.crm.ui.UserSetting.USER_SETTING_DEFAULT = {};


/**
 * @param {!Array.<string|ydn.crm.ui.UserSetting.Key>} key_path
 * @return {*}
 */
ydn.crm.ui.UserSetting.prototype.getSetting = function(key_path) {
  var obj = this.user_setting || ydn.crm.ui.UserSetting.USER_SETTING_DEFAULT;
  return goog.object.getValueByKeys(obj, key_path);
};


/**
 * @type {!CrmApp.SugarCrmSetting}
 * @private
 */
ydn.crm.ui.UserSetting.DEFAULT_SUGAR_SETTING_ = /** @type {!CrmApp.SugarCrmSetting} */ (
    {'Group': {}, 'Field': {}});


/**
 * Get SugarCrm setting.
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.loadSugarCrmSetting = function() {
  // keep setting in memory so that, setting is shared among sugarcrm instance.
  if (!this.sugar_settings_) {
    var me = this;
    var df = new goog.async.Deferred();
    var key = ydn.crm.base.SyncKey.SUGAR_SETTING;
    chrome.storage.sync.get(key, function(val) {
      me.sugar_settings_ = val[key] || ydn.crm.ui.UserSetting.DEFAULT_SUGAR_SETTING_;
      df.callback(me.sugar_settings_);
    });
    return df;
  } else {
    return goog.async.Deferred.succeed(this.sugar_settings_);
  }
};


/**
 * Persist sugarcrm setting.
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.saveSugarCrmSetting = function() {
  var key = ydn.crm.base.SyncKey.SUGAR_SETTING;
  var obj = {};
  obj[key] = this.sugar_settings_;
  var df = new goog.async.Deferred();
  chrome.storage.sync.set(obj, function() {
    df.callback(obj);
  });
  return df;
};


/**
 * Key of CrmApp.SugarCrmSettingUnit
 * @enum {string}
 */
ydn.crm.ui.UserSetting.SugarCrmSettingUnitKey = {
  NORMALLY_HIDE: 'normallyHide'
};


/**
 * @return {!CrmApp.SugarCrmSetting}
 */
ydn.crm.ui.UserSetting.prototype.getSugarCrmSetting = function() {
  if (!this.sugar_settings_) {
    this.loadSugarCrmSetting();
  }
  return this.sugar_settings_ || ydn.object.clone(ydn.crm.ui.UserSetting.DEFAULT_SUGAR_SETTING_);
};



/**
 * Show a setting dialog box.
 * @param {goog.async.Deferred} df
 * @constructor
 * @extends {goog.ui.Dialog}
 * @protected
 */
ydn.crm.ui.UserSetting.Dialog = function(df) {
  goog.base(this);
  this.df_ = df;
  var title = 'Yathit CRM Setting';
  this.setButtonSet(goog.ui.Dialog.ButtonSet.createOkCancel());
  this.setTitle(title);
  this.setEscapeToCancel(true);
  this.setHasTitleCloseButton(false);
  this.setModal(true);
  this.setDisposeOnHide(true);

  var content = this.getContentElement();
  content.classList.add('ydn-crm');
  goog.soy.renderElement(content, templ.ydn.crm.app.setting);

  var hd = this.getHandler();
  hd.listen(this, goog.ui.Dialog.EventType.SELECT, this.handleSelect);
  hd.listen(this, goog.ui.Dialog.EventType.SELECT, this.handleCancel);
};
goog.inherits(ydn.crm.ui.UserSetting.Dialog, goog.ui.Dialog);


/**
 * Get basic form element
 * @return {HTMLFormElement}
 */
ydn.crm.ui.UserSetting.Dialog.prototype.getBasicSettingFrom = function() {
  var form = this.getContentElement().querySelector('form.basic-setting');
  return /** @type {HTMLFormElement} */ (form);
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.ui.UserSetting.Dialog.prototype.handleSelect = function(e) {
  if (this.df_) {
    var form = this.getBasicSettingFrom();
    var setting = {};
    setting[ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION] =
        goog.dom.forms.getValueByName(form, 'context-panel-position');
    setting[ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE] =
        !!goog.dom.forms.getValueByName(form, 'log-on-console');
    this.df_.callback(setting);
    this.df_ = null;
  }
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.ui.UserSetting.Dialog.prototype.handleCancel = function(e) {
  if (this.df_) {
    this.df_.callback(null);
    this.df_ = null;
  }
};


/**
 * Show a setting dialog box.
 * @return {!goog.async.Deferred.<boolean>} return true if setting has changed.
 */
ydn.crm.ui.UserSetting.prototype.show = function() {
  var title = 'Yathit CRM Setting';
  if (!this.isLogin()) {
    return ydn.ui.MessageBox.show(title, 'User setting cannot change because ' +
        'you are not login Yathit server.');
  }
  var df = new goog.async.Deferred();
  var dialog = new ydn.crm.ui.UserSetting.Dialog(df);
  var old_setting;
  var keys = [ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE,
    ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION];
  chrome.storage.sync.get(keys, (function(setting) {
    old_setting = setting;
    var form = dialog.getBasicSettingFrom();
    var input_con = form.querySelector('input[name=log-on-console]');
    goog.dom.forms.setValue(input_con,
        !!setting[ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE]);
    var positions = form.querySelectorAll('input[name=context-panel-position]');
    var pos = this.getContextPanelPosition();
    for (var i = 0; i < positions.length; i++) {
      if (pos == positions[i].value) {
        positions[i].setAttribute('checked', '1');
        break;
      }
    }
    dialog.setVisible(true);
  }).bind(this));
  return df.addCallback(function(new_setting) {
    if (!new_setting) {
      return;
    }
    var obj = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (new_setting[key] != old_setting[key]) {
        obj[key] = new_setting[key];
      }
    }

    var has_changed = Object.keys(obj).length > 0;
    if (has_changed) {
      chrome.storage.sync.set(obj);
    }
    if (ydn.crm.ui.UserSetting.DEBUG) {
      window.console.log(old_setting, new_setting, has_changed);
    }
    return has_changed;
  });
};


