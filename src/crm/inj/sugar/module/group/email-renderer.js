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


goog.provide('ydn.crm.inj.sugar.module.group.EmailRenderer');
goog.require('goog.ui.ControlRenderer');



/**
 * Panel renderer for listed items.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.group.EmailRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.group.EmailRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.module.group.EmailRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.group.EmailRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.group.EmailRenderer.CSS_CLASS = 'email';


/** @return {string} */
ydn.crm.inj.sugar.module.group.EmailRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.group.EmailRenderer.CSS_CLASS;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.group.EmailRenderer.CSS_CONTENT_CLASS = 'content';


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.group.EmailRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var ctrl = /** @type {ydn.crm.inj.sugar.module.Group} */ (x);
  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = ctrl.getModel();
  var dom = ctrl.getDomHelper();
  root.setAttribute('name', model.getGroupName());
  root.classList.add(ydn.crm.inj.sugar.module.GroupRenderer.CSS_CLASS);
  var head = dom.createDom('div');
  head.setAttribute('title', model.getGroupLabel());
  root.appendChild(head);
  var content = dom.createDom('div', ydn.crm.inj.sugar.module.group.EmailRenderer.CSS_CONTENT_CLASS);
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
ydn.crm.inj.sugar.module.group.EmailRenderer.prototype.render_email_ = function(ele, email, opt_label,
    opt_is_primary, opt_is_opt_out, opt_is_deleted) {
  if (!email) {
    ele.textContent = '';
    ele.className = 'empty';
    return;
  }
  ele.textContent = opt_label || email;
  ele.setAttribute('name', email);
  var cls = '';
  if (opt_is_primary) {
    cls += ' primary';
  }
  if (opt_is_opt_out) {
    cls += ' optout';
  }
  if (opt_is_deleted) {
    cls += ' deleted';
  }
  ele.className = cls;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.group.EmailRenderer.EMAIL_TAG = 'SPAN';


/**
 * @param {ydn.crm.inj.sugar.module.group.Email} ctrl
 */
ydn.crm.inj.sugar.module.group.EmailRenderer.prototype.refresh = function(ctrl) {
  var ele_field = ctrl.getElement();

  var model = /** @type {ydn.crm.sugar.model.Group} */ (ctrl.getModel());
  goog.style.setElementShown(ele_field, !!model);
  if (!model) {
    return;
  }
  var dom = ctrl.getDomHelper();

  if (ydn.crm.inj.sugar.module.group.EmailRenderer.DEBUG) {
    window.console.log(model);
  }
  var email = model.getFieldModel('email');
  var email_values = email ? email.getField() : null;
  var is_bean_email = goog.isArray(email_values);
  var body = ctrl.getContentElement();
  if (is_bean_email) {
    // all emails are in this field
    for (var i = 0; i < email_values.length; i++) {
      var email_bean = /** @type {SugarCrm.EmailField} */ (email_values[i]);
      var ele = body.children[i];
      if (!ele) {
        ele = dom.createDom(ydn.crm.inj.sugar.module.group.EmailRenderer.EMAIL_TAG);
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
        ele = dom.createDom(ydn.crm.inj.sugar.module.group.EmailRenderer.EMAIL_TAG);
        body.appendChild(ele);
      }
      var field_model = model.getFieldModel(name);
      if (field_model) {
        this.render_email_(ele, field_model.getFieldValue());
      }
    }
    for (var i = body.childElementCount - 1; i >= fields.length; i--) {
      body.removeChild(body.children[i]);
    }
  }

};




