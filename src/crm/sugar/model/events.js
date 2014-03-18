/**
 * @fileoverview Model change event.
 */

goog.provide('ydn.crm.sugar.model.events');


/**
 * Event types.
 *
 * Note: these event type string are exported.
 * @enum {string}
 */
ydn.crm.sugar.model.events.Type = {
  CONTEXT_DATA_CHANGE: 'context-data-change',
  RECORD_CHANGE: 'record-change',
  GDATA_CHANGE: 'gdata-change'
};


/**
 * List of all events dispatched by Sugar model.
 * @const
 * @type {Array.<ydn.crm.sugar.model.events.Type>}
 */
ydn.crm.sugar.model.events.TYPES_SUGAR = [
  ydn.crm.sugar.model.events.Type.CONTEXT_DATA_CHANGE,
  ydn.crm.sugar.model.events.Type.RECORD_CHANGE,
  ydn.crm.sugar.model.events.Type.GDATA_CHANGE
];


/**
 * List of all events dispatched by Module model.
 * @const
 * @type {Array.<ydn.crm.sugar.model.events.Type>}
 */
ydn.crm.sugar.model.events.TYPES_MODULE = [
  ydn.crm.sugar.model.events.Type.RECORD_CHANGE
];



/**
 * Event for sugar models.
 * @param {ydn.crm.sugar.model.events.Type} event_type event type.
 * @param {Object=} opt_event_target target.
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugar.model.events.Event = function(event_type, opt_event_target) {
  goog.base(this, event_type, opt_event_target);
};
goog.inherits(ydn.crm.sugar.model.events.Event, goog.events.Event);



/**
 * Event when inbox contact data change.
 * @param {ydn.crm.inj.ContactModel} contact new contact data.
 * @param {Object=} opt_event_target target.
 * @extends {ydn.crm.sugar.model.events.Event}
 * @constructor
 * @struct
 */
ydn.crm.sugar.model.events.ContextDataChangeEvent = function(contact, opt_event_target) {
  goog.base(this, ydn.crm.sugar.model.events.Type.CONTEXT_DATA_CHANGE, opt_event_target);
  /**
   * @final
   * @type {ydn.crm.inj.ContactModel}
   */
  this.contact = contact;
};
goog.inherits(ydn.crm.sugar.model.events.ContextDataChangeEvent, ydn.crm.sugar.model.events.Event);



/**
 * Event when sugarcrm record change in a module.
 * @param {ydn.crm.sugar.ModuleName?} module
 * @param {ydn.crm.sugar.Record} record
 * @param {Object=} opt_event_target target.
 * @extends {ydn.crm.sugar.model.events.Event}
 * @constructor
 * @struct
 */
ydn.crm.sugar.model.events.ModuleRecordChangeEvent = function(module, record, opt_event_target) {
  goog.base(this, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, opt_event_target);
  /**
   * @final
   * @type {ydn.crm.sugar.ModuleName?}
   */
  this.module = module;
  /**
   * @final
   * @type {ydn.crm.sugar.Record}
   */
  this.record = record;
};
goog.inherits(ydn.crm.sugar.model.events.ModuleRecordChangeEvent, ydn.crm.sugar.model.events.Event);



/**
 * Event when gdata contact entry link to the sugarcrm record change in a module.
 * @param {string?} module_name
 * @param {ydn.gdata.m8.ContactEntry} old_record
 * @param {ydn.gdata.m8.ContactEntry} new_record
 * @param {Object=} opt_event_target target.
 * @extends {ydn.crm.sugar.model.events.Event}
 * @constructor
 * @struct
 */
ydn.crm.sugar.model.events.GDataEvent = function(module_name, old_record, new_record, opt_event_target) {
  goog.base(this, ydn.crm.sugar.model.events.Type.GDATA_CHANGE, opt_event_target);
  /**
   * @final
   * @type {string?}
   */
  this.module_name = module_name;
  /**
   * @final
   * @type {ydn.gdata.m8.ContactEntry}
   */
  this.old_record = old_record;
  /**
   * @final
   * @type {ydn.gdata.m8.ContactEntry}
   */
  this.new_record = new_record;
};
goog.inherits(ydn.crm.sugar.model.events.GDataEvent, ydn.crm.sugar.model.events.Event);
