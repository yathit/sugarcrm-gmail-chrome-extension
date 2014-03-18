/**
 * @fileoverview SugarCRM module model.
 *
 * Encapsulate module info (or meta data) and its transient record entry data.
 * Record entry data can change during life time of the model dispatching
 * change (goog.events.EventType.CHANGE) event.
 */


goog.provide('ydn.crm.sugar.model.Record');
goog.require('ydn.crm.sugar.Record');
goog.require('ydn.crm.sugar.model.Group');
goog.require('ydn.msg');



/**
 * SugarCRM module model.
 * @param {ydn.crm.sugar.model.Sugar} parent
 * @param {!ydn.crm.sugar.Record} r
 * @constructor
 * @extends {goog.events.EventTarget}
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugar.model.Record = function(parent, r) {
  goog.base(this);
  /**
   * @final
   * @type {ydn.crm.sugar.model.Sugar}
   */
  this.parent = parent;

  /**
   * @type {ydn.crm.sugar.Record}
   * @protected
   */
  this.record = r;
  /**
   * @type {Object.<!ydn.crm.sugar.model.Group>}
   * @private
   */
  this.groups_ = {};
};
goog.inherits(ydn.crm.sugar.model.Record, goog.events.EventTarget);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.Record.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.sugar.model.Record.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.sugar.model.Record');


/**
 * @return {string}
 */
ydn.crm.sugar.model.Record.prototype.getDomain = function() {
  return this.parent.getDomain();
};


/**
 * Get user setting.
 * @return {*}
 */
ydn.crm.sugar.model.Record.prototype.getUserSetting = function() {
  var setting = this.parent.getUserSetting();
  return goog.isObject(setting) ? goog.object.getValueByKeys(setting, ['modules', this.getModuleName()]) : null;
};


/**
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.sugar.model.Record.prototype.getModuleName = function() {
  return this.record.getModule();
};


/**
 * @return {SugarCrm.ModuleInfo}
 */
ydn.crm.sugar.model.Record.prototype.getModuleInfo = function() {
  return this.parent.getModuleInfo(this.getModuleName());
};


/**
 * @param {string} name field name.
 * @return {SugarCrm.ModuleField}
 */
ydn.crm.sugar.model.Record.prototype.getFieldInfo = function(name) {
  var info = this.getModuleInfo();
  return info.module_fields[name];
};


/**
 * @return {ydn.msg.Channel}
 */
ydn.crm.sugar.model.Record.prototype.getChannel = function() {
  return this.parent.getChannel();
};


/**
 * @override
 * @protected
 */
ydn.crm.sugar.model.Record.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.groups_ = null;
};


/**
 * @return {ydn.crm.sugar.Record} return sugarcrm record entry.
 */
ydn.crm.sugar.model.Record.prototype.getRecord = function() {
  return this.record;
};


/**
 * @return {SugarCrm.Record?}
 */
ydn.crm.sugar.model.Record.prototype.getRecordValue = function() {
  return this.record ? this.record.getData() : null;
};


/**
 * Set sugarcrm record. This will dispatch ModuleRecordChangeEvent.
 * @param {ydn.crm.sugar.Record} record sugarcrm record entry.
 */
ydn.crm.sugar.model.Record.prototype.setRecord = function(record) {
  var r = record ? record.hasRecord() ? record : null : null;
  if ((r || this.record) && r !== this.record) {
    this.record = r;
    var name = this.record ? this.record.getModule() : null;
    this.dispatchEvent(new ydn.crm.sugar.model.events.ModuleRecordChangeEvent(
        name, this.record, this));
  }
};


/**
 * @return {boolean}
 */
ydn.crm.sugar.model.Record.prototype.hasRecord = function() {
  return this.record ? this.record.hasRecord() : false;
};


/**
 * Get list of group name in this module.
 * @return {Array.<string>}
 */
ydn.crm.sugar.model.Record.prototype.listGroups = function() {
  var groups = [];
  var module_info = this.getModuleInfo();
  for (var name in module_info.module_fields) {
    var field = module_info.module_fields[name];
    var group = field.group;
    if (groups.indexOf(group) == -1) {
      groups.push(group);
    }
  }
  return groups;
};


/**
 * Create a new field model if the field present in the record.
 * @param {string} name
 * @return {!ydn.crm.sugar.model.Group}
 */
ydn.crm.sugar.model.Record.prototype.getGroupModel = function(name) {
  if (!this.groups_[name]) {
    this.groups_[name] = new ydn.crm.sugar.model.Group(this, name);
  }
  return this.groups_[name];
};



if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugar.model.Record.prototype.toString = function() {
    return 'ydn.crm.sugar.model.Record:' + this.record;
  };
}
