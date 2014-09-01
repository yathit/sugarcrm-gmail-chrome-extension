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
goog.require('ydn.crm.sugar.model.BaseGroup');
goog.require('ydn.crm.sugar.model.EmailField');
goog.require('ydn.crm.sugar.model.Field');



/**
 * SugarCRM module model.
 * @param {ydn.crm.sugar.model.Record} parent
 * @param {string} group_name
 * @constructor
 * @extends {ydn.crm.sugar.model.BaseGroup}
 * @struct
 */
ydn.crm.sugar.model.Group = function(parent, group_name) {
  goog.base(this, parent, group_name);
  /**
   * @type {Array.<!ydn.crm.sugar.model.Field>}
   * @protected
   */
  this.fields = [];
};
goog.inherits(ydn.crm.sugar.model.Group, ydn.crm.sugar.model.BaseGroup);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.Group.DEBUG = false;


/**
 * Create a new field model if the field present in the record.
 * @param {string} name
 * @return {!ydn.crm.sugar.model.Field}
 */
ydn.crm.sugar.model.Group.prototype.createOrGetFieldModel = function(name) {
  var f = this.getFieldModelByName(name);
  if (f) {
    return f;
  }
  var field_info = this.module.getFieldInfo(name);
  if (this.group_name) {
    goog.asserts.assert(this.group_name == field_info.group,
        name + ' not in group ' + this.group_name);
  } else {
    goog.asserts.assert(!field_info.group,
        name + ' not in group ' + this.group_name);
  }
  f = new ydn.crm.sugar.model.Field(this, name);
  this.fields.push(f);
  return f;
};


/**
 * Get number of field models.
 * @return {number}
 */
ydn.crm.sugar.model.Group.prototype.countFieldModel = function() {
  return this.fields.length;
};


/**
 * Get field model at given index.
 * @param {number} idx
 * @return {ydn.crm.sugar.model.Field}
 */
ydn.crm.sugar.model.Group.prototype.getFieldModelAt = function(idx) {
  return this.fields[idx];
};


/**
 * Get field model at given index.
 * @param {string} name
 * @return {ydn.crm.sugar.model.Field}
 */
ydn.crm.sugar.model.Group.prototype.getFieldModelByName = function(name) {
  for (var i = 0; i < this.fields.length; i++) {
    if (this.fields[i].getFieldName() == name) {
      return this.fields[i];
    }
  }
  return null;
};


