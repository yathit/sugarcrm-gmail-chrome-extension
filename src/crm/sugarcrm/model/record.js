// Copyright 2014 YDN Authors. All Rights Reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


/**
 * @fileoverview SugarCRM module model.
 *
 * Encapsulate module info (or meta data) and its transient record entry data.
 * Record entry data can change during life time of the model dispatching
 * change (goog.events.EventType.CHANGE) event.
 */


goog.provide('ydn.crm.sugarcrm.model.Record');
goog.require('ydn.crm.sugarcrm.Record');
goog.require('ydn.crm.sugarcrm.model.AddressGroup');
goog.require('ydn.crm.sugarcrm.model.EmailGroup');
goog.require('ydn.crm.sugarcrm.model.Group');
goog.require('ydn.crm.sugarcrm.model.NameGroup');
goog.require('ydn.crm.sugarcrm.model.PhoneGroup');
goog.require('ydn.msg');



/**
 * SugarCRM module model.
 * @param {ydn.crm.sugarcrm.model.Sugar} parent
 * @param {!ydn.crm.sugarcrm.Record} r
 * @constructor
 * @extends {goog.events.EventTarget}
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugarcrm.model.Record = function(parent, r) {
  goog.base(this);
  /**
   * @final
   * @type {ydn.crm.sugarcrm.model.Sugar}
   */
  this.parent = parent;
  /**
   * @type {!ydn.crm.sugarcrm.Record}
   * @protected
   */
  this.record = r;
  /**
   * @type {Object.<!ydn.crm.sugarcrm.model.BaseGroup>}
   * @private
   */
  this.groups_ = {};

  if (ydn.crm.sugarcrm.model.Record.DEBUG) {
    this.randomId_ = Math.random();
  }
};
goog.inherits(ydn.crm.sugarcrm.model.Record, goog.events.EventTarget);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugarcrm.model.Record.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.sugarcrm.model.Record.prototype.logger =
    goog.log.getLogger('ydn.crm.sugarcrm.model.Record');


/**
 * @return {string}
 */
ydn.crm.sugarcrm.model.Record.prototype.getDomain = function() {
  return this.parent.getDomain();
};


/**
 * Get record Id, as generated from SugarCRM
 * @return {string}
 */
ydn.crm.sugarcrm.model.Record.prototype.getId = function() {
  return this.record.getId();
};


/**
 * Get record field value.
 * Note: Newer bean format many return as Object or array of Objects.
 * @param {string} name field name
 * @return {?string} field value.
 */
ydn.crm.sugarcrm.model.Record.prototype.value = function(name) {
  return this.record.value(name);
};


/**
 * Get record title.
 * @return {string}
 */
ydn.crm.sugarcrm.model.Record.prototype.getLabel = function() {
  return this.record.hasRecord() ? this.record.getLabel() : '';
};


/**
 * SugarCRM instance.
 * @return {ydn.crm.sugarcrm.model.Sugar}
 */
ydn.crm.sugarcrm.model.Record.prototype.getSugar = function() {
  return this.parent;
};


/**
 * @return {ydn.crm.sugarcrm.ModuleName}
 */
ydn.crm.sugarcrm.model.Record.prototype.getModuleName = function() {
  return this.record.getModule();
};


/**
 * @return {SugarCrm.ModuleInfo}
 */
ydn.crm.sugarcrm.model.Record.prototype.getModuleInfo = function() {
  return this.parent.getModuleInfo(this.getModuleName());
};


/**
 * @return {boolean} return true if the module is a primary module.
 */
ydn.crm.sugarcrm.model.Record.prototype.isPrimary = function() {
  return ydn.crm.sugarcrm.PRIMARY_MODULES.indexOf(this.getModuleName()) >= 0;
};


/**
 * @return {boolean} return true if the module represent a people.
 */
ydn.crm.sugarcrm.model.Record.prototype.isPeople = function() {
  return ydn.crm.sugarcrm.PEOPLE_MODULES.indexOf(this.getModuleName()) >= 0;
};


/**
 * @return {boolean} return true if the module represent a people.
 */
ydn.crm.sugarcrm.model.Record.prototype.isEditable = function() {
  return ydn.crm.sugarcrm.EDITABLE_MODULES.indexOf(this.getModuleName()) >= 0;
};


/**
 * @return {boolean} check simple module
 */
ydn.crm.sugarcrm.model.Record.prototype.isSimple = function() {
  return ydn.crm.sugarcrm.SIMPLE_MODULES.indexOf(this.getModuleName()) >= 0;
};


/**
 * Get SugarCRM field information.
 * @param {string} name field name.
 * @return {SugarCrm.ModuleField}
 */
ydn.crm.sugarcrm.model.Record.prototype.getFieldInfo = function(name) {
  var info = this.getModuleInfo();
  return info.module_fields[name];
};


/**
 * @return {ydn.msg.Channel}
 */
ydn.crm.sugarcrm.model.Record.prototype.getChannel = function() {
  return this.parent.getChannel();
};


/**
 * Send update or create request to SugarCRM server and update.
 * @param {SugarCrm.Record} obj Record value to be sent.
 * @return {!goog.async.Deferred} Resolved with record object as return from the server.
 */
ydn.crm.sugarcrm.model.Record.prototype.save = function(obj) {
  var record = new ydn.crm.sugarcrm.Record(this.getDomain(), this.getModuleName(), obj);

  return this.parent.saveRecord(record).addCallback(function(x) {
    var v = /** @type {SugarCrm.Record} */ (x);
    this.updateRecord_(v);
  }, this);

};


/**
 * Update record data.
 * @param {SugarCrm.Record} patch
 * @private
 */
ydn.crm.sugarcrm.model.Record.prototype.updateRecord_ = function(patch) {
  var old_id = this.record.hasRecord() ? this.record.getId() : null;
  this.record.updateData(patch);
  if (this.record.hasRecord()) {
    if (goog.isDefAndNotNull(patch.id)) {
      goog.asserts.assert(patch.id == this.getId(), 'updating record must ' +
          'not change id, from ' + this.getId() + ' to ' + patch.id);
    }
    this.dispatchEvent(new ydn.crm.sugarcrm.model.events.RecordUpdatedEvent());
  } else {
    goog.asserts.assertString(patch.id, 'Id require for updating null record');
    this.dispatchEvent(new ydn.crm.sugarcrm.model.events.RecordChangeEvent(null));
  }
};


/**
 * Patch record and update to server.
 * @param {Object} patches field name-value pair as Object.
 * @return {!goog.async.Deferred.<SugarCrm.Record>} Resolved with record object
 * as return from the server.
 */
ydn.crm.sugarcrm.model.Record.prototype.patch = function(patches) {
  if (!patches || Object.keys(patches) == 0) {
    return goog.async.Deferred.succeed(false);
  }
  var obj = ydn.object.clone(this.record.getData());
  for (var key in patches) {
    obj[key] = patches[key];
  }
  var record = new ydn.crm.sugarcrm.Record(this.getDomain(), this.getModuleName(), obj);

  return this.parent.saveRecord(record).addCallback(function(x) {
    var me = this;
    var v = /** @type {SugarCrm.Record} */ (x);
    this.updateRecord_(v);
  }, this);
};


/**
 * @override
 * @protected
 */
ydn.crm.sugarcrm.model.Record.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.groups_ = null;
};


/**
 * Get sugar crm view link.
 * @return {?string} null if record is not set.
 */
ydn.crm.sugarcrm.model.Record.prototype.getViewLink = function() {
  if (this.record.hasRecord()) {
    return this.parent.getRecordViewLink(this.getModuleName(), this.getId());
  } else {
    return null;
  }
};


/**
 * @return {?SugarCrm.Record} get clone data.
 */
ydn.crm.sugarcrm.model.Record.prototype.getRecordValue = function() {
  return this.record ? /** @type {SugarCrm.Record} */ (/** @type {Object} */ (
      ydn.object.clone(this.record.getData()))) : null;
};


/**
 * Set sugarcrm record. This will dispatch ModuleRecordChangeEvent or
 * ModuleRecordUpdatedEvent.
 * @param {ydn.crm.sugarcrm.Record} record sugarcrm record entry.
 */
ydn.crm.sugarcrm.model.Record.prototype.setRecord = function(record) {

  if (ydn.crm.sugarcrm.model.Record.DEBUG) {
    window.console.log('setRecord ' + this.record + ' to ' + record);
  }
  if (record == this.record) {
    // what if underlying data are different.
    return;
  } else if (!record) {
    if (this.record.hasRecord()) {
      this.record.setData(null);
      this.dispatchEvent(new ydn.crm.sugarcrm.model.events.RecordChangeEvent(null, this));
    }
  } else if (record.getModule() != this.record.getModule()) {
    var old_module = this.record.getModule();
    this.record = record;
    this.dispatchEvent(new ydn.crm.sugarcrm.model.events.ModuleChangeEvent(old_module,
        this));
  } else if (!record.hasRecord()) {
    if (this.record.hasRecord()) {
      var old_id = this.record.getId();
      this.record = record;
      this.dispatchEvent(new ydn.crm.sugarcrm.model.events.RecordChangeEvent(old_id, this));
    }
  } else if (!this.record.hasRecord()) {
    if (record.hasRecord()) {
      this.record = record;
      this.dispatchEvent(new ydn.crm.sugarcrm.model.events.RecordChangeEvent(null, this));
    }
  } else if (record.getId() != this.record.getId()) {
    var old_id = this.record.getId();
    this.record = record;
    this.dispatchEvent(new ydn.crm.sugarcrm.model.events.RecordChangeEvent(old_id, this));
  } else {
    this.record = record;
    this.dispatchEvent(new ydn.crm.sugarcrm.model.events.RecordUpdatedEvent(this));
  }
};


/**
 * @return {boolean}
 */
ydn.crm.sugarcrm.model.Record.prototype.hasRecord = function() {
  return this.record.hasRecord();
};


/**
 * Get list of group name in this module.
 * @return {Array.<string>}
 */
ydn.crm.sugarcrm.model.Record.prototype.listGroups = function() {
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
 * Retrieve or create a new field model if the field present in the record.
 * @param {string} name
 * @return {!ydn.crm.sugarcrm.model.BaseGroup}
 */
ydn.crm.sugarcrm.model.Record.prototype.getGroupModel = function(name) {
  if (!this.groups_[name]) {
    if (name == 'name') {
      this.groups_[name] = new ydn.crm.sugarcrm.model.NameGroup(this);
    } else if (['address', 'alt_address', 'primary_address'].indexOf(name) >= 0) {
      this.groups_[name] = new ydn.crm.sugarcrm.model.AddressGroup(this, name);
    } else if (name == 'email') {
      this.groups_[name] = new ydn.crm.sugarcrm.model.EmailGroup(this);
    } else if (name == 'phone') {
      this.groups_[name] = new ydn.crm.sugarcrm.model.PhoneGroup(this);
    } else {
      this.groups_[name] = new ydn.crm.sugarcrm.model.Group(this, name);
    }
  }
  return this.groups_[name];
};


/**
 * @return {?SugarCrm.Record} get clone of underlying data.
 */
ydn.crm.sugarcrm.model.Record.prototype.cloneData = function() {
  return ydn.object.clone(this.record.getData());
};



if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugarcrm.model.Record.prototype.toString = function() {
    var s = 'ydn.crm.sugarcrm.model.Record:' + this.record;
    if (ydn.crm.sugarcrm.model.Record.DEBUG) {
      s += String(this.randomId_);
    }
    return s;
  };
}
