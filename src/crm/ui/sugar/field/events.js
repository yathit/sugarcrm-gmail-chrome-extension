/**
 * @fileoverview SugarCrm module field.
 */


goog.provide('ydn.crm.ui.sugar.field.ChangedEvent');
goog.provide('ydn.crm.ui.sugar.field.EventType');
goog.provide('ydn.crm.ui.sugar.field.MenuActionEvent');


/**
 * @enum {string}
 */
ydn.crm.ui.sugar.field.EventType = {
  CHANGE: 'field-change',
  ACTION: 'action'
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
ydn.crm.ui.sugar.field.ChangedEvent = function(patches, opt_event_target) {
  goog.base(this, ydn.crm.ui.sugar.field.EventType.CHANGE, opt_event_target);
  /**
   * @final
   * @type {Object}
   */
  this.patches = patches;
};
goog.inherits(ydn.crm.ui.sugar.field.ChangedEvent, goog.events.Event);



/**
 * Input field value changed event.
 * @param {ydn.crm.sugar.model.Field.Command} command action command
 * @param {Object=} opt_event_target target.
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.field.MenuActionEvent = function(command, opt_event_target) {
  goog.base(this, ydn.crm.ui.sugar.field.EventType.ACTION, opt_event_target);
  /**
   * @final
   * @type {ydn.crm.sugar.model.Field.Command}
   */
  this.command = command;
};
goog.inherits(ydn.crm.ui.sugar.field.MenuActionEvent, goog.events.Event);







