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
 * @fileoverview The heading of a record panel. Children must implements
 * ydn.crm.ui.Refreshable.
 *
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.record.Body');



/**
 * Heading panel
 * @param {ydn.crm.sugar.model.Record} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 *  @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.record.Body = function(model, dom) {
  goog.base(this, dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.ui.sugar.record.Body, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.record.Body.DEBUG = false;


/**
 * @const
 * @type {string} class name for body content when viewing.
 */
ydn.crm.ui.sugar.record.Body.CSS_CLASS_DETAIL = 'detail';


/**
 * @return {ydn.crm.sugar.model.Record}
 * @override
 */
ydn.crm.ui.sugar.record.Body.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Body.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();
  var dom = this.getDomHelper();
  var model = this.getModel();
  var hd = this.getHandler();
  hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, this.handleChanged);
  hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_UPDATE, this.handleChanged);
  this.handleChanged(null);
};


/**
 * @protected
 * @param {*} e
 */
ydn.crm.ui.sugar.record.Body.prototype.handleChanged = function(e) {
  this.refresh();
};


/**
 * Change edit mode.
 * @param {boolean} val
 */
ydn.crm.ui.sugar.record.Body.prototype.setEditMode = function(val) {
  if (val) {
    this.getElement().classList.add(ydn.crm.ui.sugar.record.Body.CSS_CLASS_EDIT);
    this.getElement().classList.remove(ydn.crm.ui.sugar.record.Body.CSS_CLASS_VIEW);
  } else {
    this.getElement().classList.remove(ydn.crm.ui.sugar.record.Body.CSS_CLASS_EDIT);
    this.getElement().classList.add(ydn.crm.ui.sugar.record.Body.CSS_CLASS_VIEW);
  }
};


/**
 * @return {boolean} true if edit mode.
 */
ydn.crm.ui.sugar.record.Body.prototype.getEditMode = function() {
  return this.getElement().classList.contains(ydn.crm.ui.sugar.record.Body.CSS_CLASS_EDIT);
};


/**
 * Reset control UI to initial state.
 */
ydn.crm.ui.sugar.record.Body.prototype.reset = function() {
  var root = this.getElement();
  root.classList.add(ydn.crm.ui.sugar.record.Body.CSS_CLASS_VIEW);
  root.classList.remove(ydn.crm.ui.sugar.record.Body.CSS_CLASS_EDIT);
  while (this.hasChildren()) {
    var child = this.getChildAt(0);
    this.removeChild(child, true);
    child.dispose();
  }
};


/**
 * @const
 * @type {string} CSS class name for editing record.
 */
ydn.crm.ui.sugar.record.Body.CSS_CLASS_EDIT = 'edit';


/**
 * @const
 * @type {string} CSS class name for viewing record.
 */
ydn.crm.ui.sugar.record.Body.CSS_CLASS_VIEW = 'view';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Body.CSS_CLASS = 'record-body';


/** @return {string} */
ydn.crm.ui.sugar.record.Body.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.record.Body.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Body.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  root.classList.add(this.getCssClass());
  root.classList.add(ydn.crm.ui.sugar.record.Body.CSS_CLASS_VIEW);
};


/**
 * Return data from UI values. Return null, if invalid data present.
 * @param {ydn.crm.ui.sugar.record.Record} record_panel
 * @return {SugarCrm.Record?}
 */
ydn.crm.ui.sugar.record.Body.prototype.collectData = function(record_panel) {
  return null;
};


/**
 * Refresh content due to model changes. By default this will refresh all
 * children group panel.
 */
ydn.crm.ui.sugar.record.Body.prototype.refresh = function() {
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = this.getChildAt(i);
    var g = /** @type {ydn.crm.ui.Refreshable} */ (child);
    g.refresh();
  }
};




