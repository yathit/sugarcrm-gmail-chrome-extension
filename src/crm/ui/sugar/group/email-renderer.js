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
 * @fileoverview Panel renderer for listed items.
 *
 * This module provide adding, linking and syncing.
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.group.EmailRenderer');
goog.require('goog.ui.ControlRenderer');



/**
 * Panel renderer for listed items.
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.GroupRenderer}
 */
ydn.crm.ui.sugar.group.EmailRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.ui.sugar.group.EmailRenderer, ydn.crm.ui.sugar.group.GroupRenderer);
goog.addSingletonGetter(ydn.crm.ui.sugar.group.EmailRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.group.EmailRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.EmailRenderer.CSS_CLASS = 'email';


/** @return {string} */
ydn.crm.ui.sugar.group.EmailRenderer.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.group.EmailRenderer.CSS_CLASS;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.EmailRenderer.CSS_CONTENT_CLASS = ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.EmailRenderer.prototype.createDom = function(x) {
  var dom = x.getDomHelper();
  var root = dom.createDom('div', this.getCssClass());
  var ctrl = /** @type {ydn.crm.ui.sugar.group.Email} */ (x);
  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = ctrl.getModel();
  root.setAttribute('name', model.getGroupName());
  root.classList.add(ydn.crm.ui.sugar.group.GroupRenderer.CSS_CLASS);
  var head = dom.createDom('div');
  head.setAttribute('title', model.getGroupLabel());
  root.appendChild(head);
  var content = dom.createDom('div', ydn.crm.ui.sugar.group.EmailRenderer.CSS_CONTENT_CLASS);
  root.appendChild(head);
  root.appendChild(content);

  ctrl.setElementInternal(root);

  return root;
};


/**
 * Render email span.
 * @param {Element} ele
 * @param {string?} email
 * @param {string=} opt_label
 * @param {boolean=} opt_is_primary
 * @param {boolean=} opt_is_opt_out
 * @param {boolean=} opt_is_deleted
 * @private
 */
ydn.crm.ui.sugar.group.EmailRenderer.prototype.render_email_ = function(ele, email, opt_label,
    opt_is_primary, opt_is_opt_out, opt_is_deleted) {
  if (!email) {
    ele.textContent = '';
    ele.className = 'empty';
    return;
  }
  if (ele.tagName == goog.dom.TagName.INPUT) {
    ele.value = opt_label || email;
  } else {
    ele.textContent = opt_label || email;
  }
  ele.setAttribute('name', email);
  ele.className = '';
  if (opt_is_primary) {
    ele.classList.add('primary');
  }
  if (opt_is_opt_out) {
    ele.classList.add('optout');
  }
  if (opt_is_deleted) {
    ele.classList('deleted');
  }
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.EmailRenderer.EMAIL_TAG = 'INPUT';


/**
 * @param {ydn.crm.ui.sugar.group.Email} ctrl
 */
ydn.crm.ui.sugar.group.EmailRenderer.prototype.refresh = function(ctrl) {
  var ele_field = ctrl.getElement();

  var model = /** @type {ydn.crm.sugar.model.Group} */ (ctrl.getModel());
  goog.style.setElementShown(ele_field, !!model);
  if (!model) {
    return;
  }
  var dom = ctrl.getDomHelper();

  if (ydn.crm.ui.sugar.group.EmailRenderer.DEBUG) {
    window.console.log(model);
  }
  var email = model.createOrGetFieldModel('email');
  var email_values = email ? email.getField() : null;
  var is_bean_email = goog.isArray(email_values);
  var body = ctrl.getContentElement();
  if (is_bean_email) {
    // all emails are in this field
    for (var i = 0; i < email_values.length; i++) {
      var email_bean = /** @type {SugarCrm.EmailField} */ (email_values[i]);
      var ele = body.children[i];
      if (!ele) {
        ele = dom.createDom(ydn.crm.ui.sugar.group.EmailRenderer.EMAIL_TAG);
        body.appendChild(ele);
      }
      if (email_bean) {
        this.render_email_(ele, email_bean.email_address, undefined,
            ydn.crm.sugar.toBoolean(email_bean.primary_address),
            ydn.crm.sugar.toBoolean(email_bean.opt_out),
            ydn.crm.sugar.toBoolean(email_bean.deleted));
      }
    }
    for (var i = body.childElementCount - 1; i >= email_values.length; i--) {
      body.removeChild(body.children[i]);
    }
  } else {
    var fields = model.listFields();
    for (var i = 0; i < fields.length; i++) {
      var name = fields[i];
      var ele = body.children[i];
      if (!ele) {
        ele = dom.createDom(ydn.crm.ui.sugar.group.EmailRenderer.EMAIL_TAG);
        body.appendChild(ele);
      }
      var field_model = model.createOrGetFieldModel(name);
      if (field_model) {
        this.render_email_(ele, field_model.getFieldValue());
      }
    }
    for (var i = body.childElementCount - 1; i >= fields.length; i--) {
      body.removeChild(body.children[i]);
    }
  }

};




