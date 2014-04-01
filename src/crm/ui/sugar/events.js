/**
 * @fileoverview About this file
 */


goog.provide('ydn.crm.ui.sugar.events.NewRecordEvent');



/**
 * Event for sugar models.
 * @param {ydn.crm.ui.sugar.events.Type} event_type event type.
 * @param {ydn.crm.sugar.ModuleName} name
 * @param {Object=} opt_event_target target.
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.events.NewRecordEvent = function(event_type, name, opt_event_target) {
  goog.base(this, event_type, opt_event_target);
  /**
   * @final
   * @type {ydn.crm.sugar.ModuleName}
   */
  this.name = name;
};
goog.inherits(ydn.crm.sugar.model.events.Event, goog.events.Event);


/**
 * @enum {string}
 */
ydn.crm.ui.sugar.events.Type = {
  NEW_RECORD: 'nr'
};


