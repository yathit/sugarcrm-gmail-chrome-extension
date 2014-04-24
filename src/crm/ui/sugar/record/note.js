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
  var input = ydn.crm.ui.sugar.field.InputFieldRenderer.getInstance();
  var text = ydn.crm.ui.sugar.field.TextFieldRenderer.getInstance();
  this.addChild(new ydn.crm.ui.sugar.field.Field(input_field, input, dom), true);
  this.addChild(new ydn.crm.ui.sugar.field.Field(description_field, text, dom), true);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Note.prototype.collectData = function(record_panel) {
  var model = this.getModel();
  var obj = model.getRecordValue() || /** @type {SugarCrm.Record} */ (/** @type {Object} */ ({}));

  var title_field = /** @type {ydn.crm.ui.sugar.field.Field} */ (this.getChildAt(0))
  var text_field = /** @type {ydn.crm.ui.sugar.field.Field} */ (this.getChildAt(1));
  var title = title_field.collectData();
  var text = text_field.collectData();
  if (!title && !text) {
    // no change.
    return null;
  }
  title = title || title_field.getValue();
  text = text || text_field.getValue();
  if (!title) {
    ydn.crm.ui.StatusBar.instance.setMessage('Note title required.', true);
    return null;
  }
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

