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
 * @fileoverview SugarCRM Notes Record panel.
 *                                                 `
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.record.Note');
goog.require('ydn.crm.ui.sugar.record.Body');



/**
 * Create SugarCRM Notes Record panel.
 * @param {ydn.crm.sugar.model.Record} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @extends {ydn.crm.ui.sugar.record.Body}
 */
ydn.crm.ui.sugar.record.Note = function(model, dom) {
  goog.base(this, model, dom);
};
goog.inherits(ydn.crm.ui.sugar.record.Note, ydn.crm.ui.sugar.record.Body);


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Note.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.getDomHelper();
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var model = this.getModel();
  // get default group that comprise `name` and `description` fields.
  var name_group = model.getGroupModel('name');
  var group = model.getGroupModel('');
  var input_field = name_group.createOrGetFieldModel('name');
  var description_field = group.createOrGetFieldModel('description');
  goog.asserts.assert(input_field, 'name field missing in ' + group);
  goog.asserts.assert(description_field, 'description field missing in ' + group);
  this.addChild(new ydn.crm.ui.sugar.field.Field(input_field, null, dom), true);
  this.addChild(new ydn.crm.ui.sugar.field.Field(description_field, null, dom), true);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Note.prototype.collectData = function(record_panel, dirty_fields) {
  var model = this.getModel();
  var obj = model.getRecordValue() || /** @type {SugarCrm.Record} */ (/** @type {Object} */ ({}));

  var title = (/** @type {ydn.crm.ui.sugar.field.Input} */ (this.getChildAt(0))).collectData();
  var text = (/** @type {ydn.crm.ui.sugar.field.TextArea} */ (this.getChildAt(1))).collectData();
  if (!title) {
    ydn.crm.ui.StatusBar.instance.setMessage('Note title required.', true);
    return null;
  }
  var has_changed = (obj['name'] != title) || (obj['description'] != text);
  obj['name'] = title;
  obj['description'] = text;

  var parent = record_panel.getParentPanel();
  if (parent) {
    /**
     * @type {ydn.crm.sugar.model.Record}
     */
    var parent_model = parent.getModel();
    obj['parent_type'] = parent_model.getModuleName();
    obj['parent_id'] = parent_model.getId();
    obj['parent_name'] = parent_model.value('name');
  }
  if (ydn.crm.ui.sugar.record.Body.DEBUG) {
    window.console.log(obj);
  }
  return obj;
};

