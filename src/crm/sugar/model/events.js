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
  MODULE_CHANGE: 'record-change', // change in module name
  RECORD_CHANGE: 'record-change', // change in record primary key
  RECORD_UPDATE: 'record-update', // record value changes
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
  ydn.crm.sugar.model.events.Type.MODULE_CHANGE,
  ydn.crm.sugar.model.events.Type.RECORD_CHANGE,
  ydn.crm.sugar.model.events.Type.RECORD_UPDATE
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
 * Event when sugarcrm record change in a module. The update has already being
 * applied at the time of call.
 * @param {*} delta the new value.
 * @param {Object=} opt_event_target target.
 * @extends {ydn.crm.sugar.model.events.Event}
 * @constructor
 * @struct
 */
ydn.crm.sugar.model.events.ModuleRecordChangeEvent = function(delta,
                                                              opt_event_target) {
  goog.base(this, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, opt_event_target);

  /**
   * @final
   * @type {*}
   */
  this.delta = delta;
};
goog.inherits(ydn.crm.sugar.model.events.ModuleRecordChangeEvent, ydn.crm.sugar.model.events.Event);



/**
 * Event when sugarcrm record change in a module. The update has already being
 * applied at the time of call.
 * @param {ydn.crm.sugar.ModuleName?} module
 * @param {ydn.crm.sugar.Record} update the new value.
 * @param {Object=} opt_event_target target.
 * @extends {ydn.crm.sugar.model.events.Event}
 * @constructor
 * @struct
 */
ydn.crm.sugar.model.events.ModuleChangeEvent = function(module, update,
                                                        opt_event_target) {
  goog.base(this, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, opt_event_target);
  /**
   * @final
   * @type {ydn.crm.sugar.ModuleName?} old module name.
   */
  this.module = module;
  /**
   * @final
   * @type {ydn.crm.sugar.Record}
   */
  this.update = update;
};
goog.inherits(ydn.crm.sugar.model.events.ModuleChangeEvent, ydn.crm.sugar.model.events.Event);



/**
 * Event when sugarcrm record change in a module. The update has already being
 * applied.
 * @param {*} delta
 * @param {Object=} opt_event_target target.
 * @extends {ydn.crm.sugar.model.events.Event}
 * @constructor
 * @struct
 */
ydn.crm.sugar.model.events.ModuleRecordUpdatedEvent = function(delta, opt_event_target) {
  goog.base(this, ydn.crm.sugar.model.events.Type.RECORD_UPDATE, opt_event_target);

  /**
   * @final
   * @type {*}
   */
  this.delta = delta;
};
goog.inherits(ydn.crm.sugar.model.events.ModuleRecordUpdatedEvent, ydn.crm.sugar.model.events.Event);



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
