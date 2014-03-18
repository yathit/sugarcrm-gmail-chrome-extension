/**
 * @fileoverview SugarCRM module model.
 *
 * Encapsulate module info (or meta data) and its transient record entry data.
 * Record entry data can change during life time of the model dispatching
 * change (goog.events.EventType.CHANGE) event.
 */


goog.provide('ydn.crm.sugar.model.Module');
goog.require('ydn.crm.sugar.Record');
goog.require('ydn.crm.sugar.model.Record');



/**
 * SugarCRM module model.
 * @param {ydn.crm.sugar.model.Sugar} parent
 * @param {ydn.crm.sugar.ModuleName} module_name
 * @constructor
 * @extends {ydn.crm.sugar.model.Record}
 * @struct
 */
ydn.crm.sugar.model.Module = function(parent, module_name) {
  var r = new ydn.crm.sugar.Record(parent.getDomain(), module_name);
  goog.base(this, parent, r);

  /**
   * @final
   * @protected
   * @type {ydn.crm.sugar.ModuleName}
   */
  this.module_name = module_name;

};
goog.inherits(ydn.crm.sugar.model.Module, ydn.crm.sugar.model.Record);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.Module.DEBUG = false;


/**
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.sugar.model.Module.prototype.getModuleName = function() {
  return this.module_name;
};


/**
 * Set sugarcrm record. This will dispatch ModuleRecordChangeEvent.
 * @param {ydn.crm.sugar.Record} record sugarcrm record entry.
 */
ydn.crm.sugar.model.Module.prototype.setRecord = function(record) {
  // check valid record.
  if (record && record.getModule() != this.module_name) {
    throw new Error('Module name must be ' + this.module_name + ' but found ' +
        record.getModule());
  }
  goog.base(this, 'setRecord', record);
};


if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugar.model.Module.prototype.toString = function() {
    return 'ydn.crm.sugar.model.Module:' + this.module_name +
        (this.record ? ':' + this.record : '');
  };
}
