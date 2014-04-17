// Copyright 2014 YDN Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview SugarCRM module group model.
 *
 * Encapsulate module info (or meta data) and its transient record entry data.
 * Record entry data can change during life time of the model dispatching
 * change (goog.events.EventType.CHANGE) event.
 *
 */


goog.provide('ydn.crm.sugar.model.Group');
goog.require('ydn.crm.sugar.gdata');
goog.require('ydn.crm.sugar.model.Field');



/**
 * SugarCRM module model.
 * @param {ydn.crm.sugar.model.Record} parent
 * @param {string} group_name
 * @constructor
 * @struct
 */
ydn.crm.sugar.model.Group = function(parent, group_name) {
  /**
   * @final
   * @type {ydn.crm.sugar.model.Record}
   */
  this.module = parent;
  /**
   * @final
   * @protected
   * @type {string}
   */
  this.group_name = group_name || '';
  /**
   * @type {Array.<!ydn.crm.sugar.model.Field>}
   * @private
   */
  this.fields_ = [];
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.Group.DEBUG = false;


/**
 * @return {string}
 */
ydn.crm.sugar.model.Group.prototype.getDomain = function() {
  return this.module.getDomain();
};


/**
 * @return {SugarCrm.ModuleInfo}
 */
ydn.crm.sugar.model.Group.prototype.getModuleInfo = function() {
  return this.module.getModuleInfo();
};


/**
 * @param {string} name field name.
 * @return {SugarCrm.ModuleField}
 */
ydn.crm.sugar.model.Group.prototype.getFieldInfo = function(name) {
  return this.module.getFieldInfo(name);
};


/**
 * Return default setting.
 * @param {string} name group name.
 * @return {boolean}
 */
ydn.crm.sugar.model.Group.isNormallyHide = function(name) {
  if (/address/i.test(name)) {
    return false;
  } else if (['email', 'name', 'phone'].indexOf(name) >= 0) {
    return false;
  } else {
    return true;
  }
};


/**
 * @return {boolean}
 */
ydn.crm.sugar.model.Group.prototype.isNormallyHide = function() {
  var setting = this.getUserSetting();
  return setting ? !!setting['normallyHide'] : ydn.crm.sugar.model.Group.isNormallyHide(this.group_name);
};


/**
 * Get user setting.
 * @return {*}
 */
ydn.crm.sugar.model.Group.prototype.getUserSetting = function() {
  var setting = this.module.getUserSetting();
  return goog.isObject(setting) ? goog.object.getValueByKeys(setting, ['groups', this.group_name]) : null;
};


/**
 * Get list of field name in this group.
 * @return {Array.<string>}
 */
ydn.crm.sugar.model.Group.prototype.listFields = function() {
  var module_info = this.module.getModuleInfo();
  var fields = [];
  for (var name in module_info.module_fields) {
    var field = module_info.module_fields[name];
    if (this.group_name && field.group == this.group_name) {
      fields.push(name);
    } else if (!this.group_name && !field.group) {
      fields.push(name);
    }
  }
  return fields;
};


/**
 * Check existant of a field name.
 * @param {string} name
 * @return {boolean}
 */
ydn.crm.sugar.model.Group.prototype.hasField = function(name) {
  var module_info = this.module.getModuleInfo();
  for (var x in module_info.module_fields) {
    if (x == name) {
      return true;
    }
  }
  return false;
};


/**
 * Create a new field model if the field present in the record.
 * @param {string} name
 * @return {!ydn.crm.sugar.model.Field}
 */
ydn.crm.sugar.model.Group.prototype.createOrGetFieldModel = function(name) {
  var index = this.fields_.indexOf(name);
  if (index >= 0) {
    return this.fields_[index];
  }
  var field_info = this.module.getFieldInfo(name);
  if (this.group_name) {
    goog.asserts.assert(this.group_name == field_info.group,
        name + ' not in group ' + this.group_name);
  } else {
    goog.asserts.assert(!field_info.group,
        name + ' not in group ' + this.group_name);
  }
  var f = new ydn.crm.sugar.model.Field(this, name);
  this.fields_.push(f);
  return f;
};


/**
 * Get number of field models.
 * @return {number}
 */
ydn.crm.sugar.model.Group.prototype.countFieldModel = function() {
  return this.fields_.length;
};


/**
 * Get field model at given index.
 * @param {number} idx
 * @return {ydn.crm.sugar.model.Field}
 */
ydn.crm.sugar.model.Group.prototype.getFieldModelAt = function(idx) {
  return this.fields_[idx];
};


/**
 * Get field model at given index.
 * @param {string} name
 * @return {ydn.crm.sugar.model.Field}
 */
ydn.crm.sugar.model.Group.prototype.getFieldModelByName = function(name) {
  for (var i = 0; i < this.fields_.length; i++) {
    if (this.fields_[i].getFieldName() == name) {
      return this.fields_[i];
    }
  }
  return null;
};


/**
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.sugar.model.Group.prototype.getModuleName = function() {
  return this.module.getModuleName();
};


/**
 * @return {string}
 */
ydn.crm.sugar.model.Group.prototype.getGroupName = function() {
  return this.group_name;
};


/**
 * @return {string}
 */
ydn.crm.sugar.model.Group.prototype.getGroupLabel = function() {
  var label = this.group_name.replace('_', ' ');
  label = label.charAt(0).toUpperCase() + label.substr(1);
  return label;
};

