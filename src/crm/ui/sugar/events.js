/**
 * @fileoverview About this file
 */


goog.provide('ydn.crm.ui.sugar.events.ChangedEvent');
goog.provide('ydn.crm.ui.sugar.events.FieldMenuActionEvent');
goog.provide('ydn.crm.ui.sugar.events.NewRecordEvent');


/**
 * @enum {string}
 */
ydn.crm.ui.sugar.events.Type = {
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
ydn.crm.ui.sugar.events.ChangedEvent = function(patches, opt_event_target) {
  goog.base(this, ydn.crm.ui.sugar.events.Type.CHANGE, opt_event_target);
  /**
   * @final
   * @type {Object}
   */
  this.patches = patches;
};
goog.inherits(ydn.crm.ui.sugar.events.ChangedEvent, goog.events.Event);



/**
 * Input field value changed event.
 * @param {ydn.crm.sugar.model.Field.Command} command action command
 * @param {Object=} opt_event_target target.
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.events.FieldMenuActionEvent = function(command, opt_event_target) {
  goog.base(this, ydn.crm.ui.sugar.events.Type.ACTION, opt_event_target);
  /**
   * @final
   * @type {ydn.crm.sugar.model.Field.Command}
   */
  this.command = command;
};
goog.inherits(ydn.crm.ui.sugar.events.FieldMenuActionEvent, goog.events.Event);



/**
 * Event for sugar models.
 * @param {ydn.crm.sugar.ModuleName} name
 * @param {Object=} opt_event_target target.
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.events.NewRecord = function(name, opt_event_target) {
  goog.base(this, ydn.crm.ui.sugar.events.Type.NEW, opt_event_target);
  /**
   * @final
   * @type {ydn.crm.sugar.ModuleName}
   */
  this.module_name = name;
};
goog.inherits(ydn.crm.ui.sugar.events.NewRecord, goog.events.Event);




