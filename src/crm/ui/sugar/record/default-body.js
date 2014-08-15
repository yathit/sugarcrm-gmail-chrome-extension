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
 * @fileoverview Default body implement creating Group components.
 *                                                 `
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.record.Default');
goog.require('ydn.crm.ui.sugar.group.Address');
goog.require('ydn.crm.ui.sugar.group.Email');
goog.require('ydn.crm.ui.sugar.group.Group');
goog.require('ydn.crm.ui.sugar.group.List');
goog.require('ydn.crm.ui.sugar.group.Name');
goog.require('ydn.crm.ui.sugar.group.Phone');
goog.require('ydn.crm.ui.sugar.record.Body');



/**
 * Create SugarCRM Notes Record panel.
 * @param {ydn.crm.sugar.model.Record} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @extends {ydn.crm.ui.sugar.record.Body}
 */
ydn.crm.ui.sugar.record.Default = function(model, dom) {
  goog.base(this, model, dom);
};
goog.inherits(ydn.crm.ui.sugar.record.Default, ydn.crm.ui.sugar.record.Body);


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Default.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var model = this.getModel();
  var groups = model.listGroups();
  var group_renderer = ydn.crm.ui.sugar.group.GroupRenderer.getInstance();
  for (var i = 0; i < groups.length; i++) {
    var name = groups[i];
    var field;
    var field_model = model.getGroupModel(name);
    if (field_model instanceof ydn.crm.sugar.model.EmailGroup) {
      var email = /** @type {ydn.crm.sugar.model.EmailGroup} */ (field_model);
      field = new ydn.crm.ui.sugar.group.Email(email, dom);
    } else if (field_model instanceof ydn.crm.sugar.model.AddressGroup) {
      var address = /** @type {ydn.crm.sugar.model.AddressGroup} */ (field_model);
      field = new ydn.crm.ui.sugar.group.Address(address, dom);
    } else if (field_model instanceof ydn.crm.sugar.model.PhoneGroup) {
      var phone = /** @type {ydn.crm.sugar.model.PhoneGroup} */ (field_model);
      field = new ydn.crm.ui.sugar.group.Phone(phone, dom);
    } else if (field_model instanceof ydn.crm.sugar.model.NameGroup) {
      var name_group = /** @type {ydn.crm.sugar.model.NameGroup} */ (field_model);
      field = new ydn.crm.ui.sugar.group.Name(name_group, dom);
    } else if (field_model instanceof ydn.crm.sugar.model.Group) {
      var group_model = /** @type {ydn.crm.sugar.model.Group} */ (field_model);
      field = new ydn.crm.ui.sugar.group.Group(group_model, group_renderer, dom);
    } else {
      throw new Error('Invalid group: ' + name);
    }
    this.addChild(field, true);
  }
};
