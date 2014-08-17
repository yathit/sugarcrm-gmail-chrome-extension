/**
 * @fileoverview Status bar for Yathit CRM content script app.
 *
 */


goog.provide('ydn.crm.ui.AppStatusBar');
goog.require('ydn.crm.ui.SimpleStatusBar');
goog.require('ydn.crm.ui.UserSetting');



/**
 * Status bar for CRM app.
 * @constructor
 * @extends {ydn.crm.ui.SimpleStatusBar}
 * @struct
 */
ydn.crm.ui.AppStatusBar = function() {
  goog.base(this);
  var root = this.getElement();
  var setting = document.createElement('div');
  setting.className = 'setting right';
  setting.setAttribute('title', 'Setting...');
  goog.events.listen(setting, 'click', this.handleSettingClick, false, this);
  root.appendChild(setting);
};
goog.inherits(ydn.crm.ui.AppStatusBar, ydn.crm.ui.SimpleStatusBar);


/**
 * @inheritDoc
 */
ydn.crm.ui.AppStatusBar.prototype.render = function(ele) {
  var setting = this.getElement().querySelector('.setting');
  if (setting) {
    setting.onclick = null;
  }
  goog.base(this, 'render', ele);
};


/**
 * @param {Event} e
 * @protected
 */
ydn.crm.ui.AppStatusBar.prototype.handleSettingClick = function(e) {
  e.preventDefault();
  ydn.crm.ui.UserSetting.getInstance().show();
};
