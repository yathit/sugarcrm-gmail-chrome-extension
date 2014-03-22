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
