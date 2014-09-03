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


goog.provide('ydn.crm.sugar.model.BaseGroup');
goog.require('ydn.crm.sugar.gdata');
goog.require('ydn.crm.sugar.model.EmailField');
goog.require('ydn.crm.sugar.model.Field');
goog.require('ydn.ui.FlyoutMenu');



/**
 * SugarCRM module group model.
 * @param {ydn.crm.sugar.model.Record} parent
 * @param {string} group_name
 * @constructor
 * @struct
 */
ydn.crm.sugar.model.BaseGroup = function(parent, group_name) {
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
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.BaseGroup.DEBUG = false;


/**
 * @return {string}
 */
ydn.crm.sugar.model.BaseGroup.prototype.getDomain = function() {
  return this.module.getDomain();
};


/**
 * @return {SugarCrm.ModuleInfo}
 */
ydn.crm.sugar.model.BaseGroup.prototype.getModuleInfo = function() {
  return this.module.getModuleInfo();
};


/**
 * @param {string} name field name.
 * @return {SugarCrm.ModuleField}
 */
ydn.crm.sugar.model.BaseGroup.prototype.getFieldInfo = function(name) {
  return this.module.getFieldInfo(name);
};


/**
 * Return default setting.
 * @param {string} name group name.
 * @return {boolean}
 */
ydn.crm.sugar.model.BaseGroup.getNormallyHideDefaultSetting = function(name) {
  if (/address/i.test(name)) {
    return false;
  } else if (['email', 'name', 'phone', ''].indexOf(name) >= 0) {
    return false;
  } else {
    return true;
  }
};


/**
 * Check existence of a field name.
 * @param {string} name
 * @return {boolean}
 */
ydn.crm.sugar.model.BaseGroup.prototype.hasField = function(name) {
  var module_info = this.module.getModuleInfo();
  for (var x in module_info.module_fields) {
    if (x == name) {
      return true;
    }
  }
  return false;
};


/**
 * Get list of field name in this group.
 * @return {Array.<string>}
 */
ydn.crm.sugar.model.BaseGroup.prototype.listFields = function() {
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
 * Get record field value.
 * @param {string} name
 * @return {?string}
 */
ydn.crm.sugar.model.BaseGroup.prototype.getFieldValue = function(name) {
  return this.module.value(name);
};


/**
 * Get record field value as string.
 * @param {string} name
 * @return {string}
 */
ydn.crm.sugar.model.BaseGroup.prototype.getFieldAsValue = function(name) {
  var s = this.module.value(name);
  return goog.isString(s) ? s : '';
};


/**
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.sugar.model.BaseGroup.prototype.getModuleName = function() {
  return this.module.getModuleName();
};


/**
 * @return {string}
 */
ydn.crm.sugar.model.BaseGroup.prototype.getGroupName = function() {
  return this.group_name;
};


/**
 * @return {string}
 */
ydn.crm.sugar.model.BaseGroup.prototype.getGroupLabel = function() {
  var label = this.group_name.replace('_', ' ');
  label = label.charAt(0).toUpperCase() + label.substr(1);
  return label;
};


/**
 * @return {boolean} true if field has value set.
 */
ydn.crm.sugar.model.BaseGroup.prototype.hasGroupValue = function() {
  return false;
};


/**
 * Get field value.
 * @return {?string}
 */
ydn.crm.sugar.model.BaseGroup.prototype.getGroupValue = function() {
  return null;
};


/**
 * Option menu items.
 * @return {?Array|ydn.ui.FlyoutMenu.ItemOption} menu items. If string return, a horizontal dot will
 * show and action is immediately invoked, if Array is return, a vertical dot
 * will show and a menu will show.
 */
ydn.crm.sugar.model.BaseGroup.prototype.getAdditionalOptions = function() {
  return null;
};


/**
 * Get the patch object for given user input field value.
 * @param {*} value input value.
 * @return {?Object} patch object. `null` if patch is not necessary.
 */
ydn.crm.sugar.model.BaseGroup.prototype.patch = function(value) {
  if (!goog.isObject(value)) {
    return null;
  }
  var has_changed = false;
  var obj = {};
  for (var name in value) {
    if (this.hasField(name)) {
      var field_value = this.module.value(name);
      if (value[name] !== field_value) {
        has_changed = true;
        obj[name] = value[name];
      }
    } else {
      has_changed = true;
      obj[name] = value[name];
      if (ydn.crm.sugar.model.BaseGroup.DEBUG) {
        window.console.warn('New field: ' + name + ' was introduced to ' + this);
      }
    }
  }
  return has_changed ? obj : null;
};
