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
 * @fileoverview Record module panel renderer.
 *
 */


goog.provide('ydn.crm.inj.sugar.module.RecordRenderer');
goog.require('goog.ui.ControlRenderer');
goog.require('ydn.crm.inj.sugar.module.Group');
goog.require('ydn.crm.inj.sugar.module.group.Address');
goog.require('ydn.crm.inj.sugar.module.group.Email');
goog.require('ydn.crm.inj.sugar.module.group.List');
goog.require('ydn.crm.inj.sugar.module.group.Name');
goog.require('ydn.crm.sugar.model.GDataSugar');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.RecordRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.RecordRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.module.RecordRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.RecordRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS = 'record-body';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_HEADER = 'record-body-header';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_CONTENT = 'record-body-content';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_NAME_VIEW = 'view';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_NAME_DETAIL = 'detail';


/**
 * @const
 * @type {string} class name for body content when viewing.
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_DETAIL = 'detail';


/** @return {string} */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var body = /** @type {ydn.crm.inj.sugar.module.Record} */ (x);
  var dom = body.getDomHelper();

  var header = dom.createDom('div', ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_HEADER);
  var content = dom.createDom('div', ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_CONTENT);
  root.appendChild(header);
  root.appendChild(content);
  body.setElementInternal(root);

  // create ui elements
  var a_view = dom.createDom('a', {
    'name': ydn.crm.inj.sugar.module.RecordRenderer.CSS_NAME_VIEW
  }, 'view');
  a_view.href = '#';
  var a_detail = dom.createDom('a', {
    'name': ydn.crm.inj.sugar.module.RecordRenderer.CSS_NAME_DETAIL
  }, 'detail');
  a_detail.href = '#';
  if (body.isShowSummary()) {
    goog.style.setElementShown(a_view, false);
  } else {
    goog.style.setElementShown(a_detail, false);
  }
  header.appendChild(a_view);
  header.appendChild(a_detail);

  var model = body.getModel();
  var groups = model.listGroups();
  var group_renderer = ydn.crm.inj.sugar.module.GroupRenderer.getInstance();
  for (var i = 0; i < groups.length; i++) {
    var name = groups[i];
    var field;
    var field_model = model.getGroupModel(name);
    if (/address/i.test(name)) {
      field = new ydn.crm.inj.sugar.module.group.Address(field_model, dom);
    } else if (name == 'email') {
      field = new ydn.crm.inj.sugar.module.group.Email(field_model, dom);
    } else if (name == 'phone') {
      field = new ydn.crm.inj.sugar.module.group.List(field_model, dom);
    } else if (name == 'name') {
      field = new ydn.crm.inj.sugar.module.group.Name(field_model, dom);
    } else {
      field = new ydn.crm.inj.sugar.module.Group(field_model, group_renderer, dom);
    }
    body.addChild(field, true);
  }

  return root;
};


/**
 * Get View click control
 * @param {Element} ele ancentor
 * @return {Element}
 */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.getViewButton = function(ele) {
  return ele.querySelector('a[name=' +
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_NAME_VIEW + ']');
};


/**
 * Get View click control
 * @param {Element} ele ancentor
 * @return {Element}
 */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.getDetailButton = function(ele) {
  return ele.querySelector('a[name=' +
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_NAME_DETAIL + ']');
};


/**
 * Reset control UI to initial state.
 * @param {ydn.crm.inj.sugar.module.Record} ctrl
 */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.reset = function(ctrl) {
  var ele = ctrl.getElement();
  var header_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_HEADER, ele);
  var content_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_CONTENT, ele);
  var a_view = this.getViewButton(header_ele);
  var a_detail = this.getDetailButton(header_ele);
  if (!ctrl.isShowSummary()) {
    a_view.textContent = 'view';
    goog.style.setElementShown(content_ele, false);
    goog.style.setElementShown(a_view, true);
    goog.style.setElementShown(a_detail, false);
  } else {
    a_detail.textContent = 'detail';
    goog.style.setElementShown(a_view, false);
    goog.style.setElementShown(a_detail, true);
  }
};


/**
 * Toggle view.
 * @param {Element} ele
 */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.toggleView = function(ele) {
  var header_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_HEADER, ele);
  var content_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_CONTENT, ele);
  var a_view = this.getViewButton(header_ele);
  var a_detail = this.getDetailButton(header_ele);
  if (a_view.textContent == 'hide') {
    a_view.textContent = 'view';
    goog.style.setElementShown(content_ele, false);
    goog.style.setElementShown(a_detail, false);
  } else {
    a_view.textContent = 'hide';
    goog.style.setElementShown(content_ele, true);
    goog.style.setElementShown(a_detail, true);
  }
};


/**
 * Toggle view.
 * @param {Element} ele
 */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.toggleDetail = function(ele) {
  var header_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_HEADER, ele);
  var content_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_CONTENT, ele);
  var a_view = this.getDetailButton(header_ele);
  if (content_ele.classList.contains(ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_DETAIL)) {
    a_view.textContent = 'detail';
    content_ele.classList.remove(ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_DETAIL);
  } else {
    a_view.textContent = 'less';
    content_ele.classList.add(ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_DETAIL);
  }
};




