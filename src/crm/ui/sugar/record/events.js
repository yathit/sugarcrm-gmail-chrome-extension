/**
 * @fileoverview Model change event.
 */

goog.provide('ydn.crm.ui.sugar.events');
goog.require('ydn.crm.ui.sugar.setting.Field');



/**
 * Event for sugar models.
 * @param {!ydn.crm.ui.sugar.setting.Setting} setting field key path.
 * @param {ydn.crm.ui.UserSetting.SugarCrmSettingUnitKey} key target setting name, eg. `normallyHide`.
 * @param {*} value new value.
 * @param {Object=} opt_event_target target.
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.events.SettingChangeEvent = function(setting, key, value, opt_event_target) {
  goog.base(this, ydn.crm.ui.sugar.events.Type.SETTING_CHANGE, opt_event_target);

  /**
   * @final
   * @type {!ydn.crm.ui.sugar.setting.Setting}
   */
  this.setting = setting;
  /**
   * @final
   * @type {ydn.crm.ui.UserSetting.SugarCrmSettingUnitKey}
   */
  this.key = key;
  /**
   * @final
   * @type {*}
   */
  this.value = value;
};
goog.inherits(ydn.crm.ui.sugar.events.SettingChangeEvent, goog.events.Event);



/**
 * Edit click event.
 * @param {boolean} value new value.
 * @param {Object=} opt_event_target target.
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.events.EditEvent = function(value, opt_event_target) {
  goog.base(this, ydn.crm.ui.sugar.events.Type.EDIT, opt_event_target);

  /**
   * @final
   * @type {boolean}
   */
  this.value = value;
};
goog.inherits(ydn.crm.ui.sugar.events.EditEvent, goog.events.Event);



