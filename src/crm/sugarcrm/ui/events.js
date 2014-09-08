/**
 * @fileoverview About this file
 */


goog.provide('ydn.crm.sugarcrm.ui.events.ChangedEvent');
goog.provide('ydn.crm.sugarcrm.ui.events.FieldMenuActionEvent');
goog.provide('ydn.crm.sugarcrm.ui.events.NewRecordEvent');


/**
 * @enum {string}
 */
ydn.crm.sugarcrm.ui.events.Type = {
  NEW_RECORD: 'nr',
  CHANGE: 'field-change',
  ACTION: 'action',
  SETTING_CHANGE: 'setting-change',
  EDIT: 'edit',
  SAVE: 'save',
  NEW: 'new'
};



/**
 * Input field value changed event.
 * @param {Object} patches
 * @param {Object=} opt_event_target target.
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugarcrm.ui.events.ChangedEvent = function(patches, opt_event_target) {
  goog.base(this, ydn.crm.sugarcrm.ui.events.Type.CHANGE, opt_event_target);
  /**
   * @final
   * @type {Object}
   */
  this.patches = patches;
};
goog.inherits(ydn.crm.sugarcrm.ui.events.ChangedEvent, goog.events.Event);



/**
 * Input field value changed event.
 * @param {ydn.crm.sugarcrm.model.Field.Command} command action command
 * @param {Object=} opt_event_target target.
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugarcrm.ui.events.FieldMenuActionEvent = function(command, opt_event_target) {
  goog.base(this, ydn.crm.sugarcrm.ui.events.Type.ACTION, opt_event_target);
  /**
   * @final
   * @type {ydn.crm.sugarcrm.model.Field.Command}
   */
  this.command = command;
};
goog.inherits(ydn.crm.sugarcrm.ui.events.FieldMenuActionEvent, goog.events.Event);



/**
 * Event for sugar models.
 * @param {ydn.crm.sugarcrm.ModuleName} name
 * @param {Object=} opt_event_target target.
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugarcrm.ui.events.NewRecord = function(name, opt_event_target) {
  goog.base(this, ydn.crm.sugarcrm.ui.events.Type.NEW, opt_event_target);
  /**
   * @final
   * @type {ydn.crm.sugarcrm.ModuleName}
   */
  this.module_name = name;
};
goog.inherits(ydn.crm.sugarcrm.ui.events.NewRecord, goog.events.Event);




