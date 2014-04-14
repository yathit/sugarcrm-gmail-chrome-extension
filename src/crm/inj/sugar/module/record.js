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
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This is container for group panel and has some controls to viewing and editing.
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.inj.sugar.module.Record');
goog.require('goog.ui.Component');
goog.require('ydn.crm.inj.sugar.module.Field');
goog.require('ydn.crm.inj.sugar.module.RecordCtrlRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Sugar');
goog.require('ydn.crm.ui');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Record} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @implements {ydn.crm.ui.Refreshable}
 */
ydn.crm.inj.sugar.module.Record = function(model, opt_dom) {
  goog.base(this, opt_dom);
  goog.asserts.assert(model);
  this.setModel(model);
  /**
   * Display secondary relationship.
   * @type {boolean}
   * @private
   */
  this.embed_sec_ = ydn.crm.sugar.PRIMARY_MODULES.indexOf(model.getModuleName()) >= 0;
};
goog.inherits(ydn.crm.inj.sugar.module.Record, goog.ui.Component);


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.Record.NEW_RECORD_EVENT = 'new-record';


/**
 * @const
 * @type {string} CSS class name for secondary records panel.
 */
ydn.crm.inj.sugar.module.Record.CSS_NAME_SECONDARY = 'secondary';


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.module.Record.prototype.logger =
    goog.log.getLogger('ydn.crm.inj.sugar.module.Record');


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.Record.DEBUG = false;


/**
 * @return {ydn.crm.sugar.model.Record}
 * @override
 */
ydn.crm.inj.sugar.module.Record.prototype.getModel;


/**
 * Set to handle secondary relationship panel.
 * @param {boolean} val
 */
ydn.crm.inj.sugar.module.Record.prototype.setEmbedSecondary = function(val) {
  this.embed_sec_ = val;
};


/**
 * @override
 */
ydn.crm.inj.sugar.module.Record.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_CONTENT,
      this.getElement());
};


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.Record.NAME_NEW_NOTE = 'new-note';


/**
 * Update model. Module may change.
 * @param {ydn.crm.sugar.Record} r
 */
ydn.crm.inj.sugar.module.Record.prototype.updateModel = function(r) {

};


/** @return {string} */
ydn.crm.inj.sugar.module.Record.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.Record.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  var model = this.getModel();
  root.classList.add(this.getCssClass());

  var header = dom.createDom('div', ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_HEADER);
  var content = dom.createDom('div', ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_CONTENT);
  var footer = dom.createDom('div', ydn.crm.inj.sugar.module.Record.CSS_NAME_SECONDARY);
  root.appendChild(header);
  root.appendChild(content);
  root.appendChild(footer);
  this.setElementInternal(root);

  // create ui elements

  var a_detail = dom.createDom('a', {
    'name': ydn.crm.inj.sugar.module.RecordCtrlRenderer.NAME_DETAIL,
    'href': '#detail'
  }, 'detail');
  var a_new_note = dom.createDom('a', {
    'name': ydn.crm.inj.sugar.module.Record.NAME_NEW_NOTE,
    'href': '#new-note'
  }, 'new note');

  header.classList.add(ydn.crm.ui.CSS_CLASS_TOOLBAR);
  header.appendChild(a_new_note);
  header.appendChild(a_detail);

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
    this.addChild(field, true);
  }

};


/**
 * Get View click control
 * @param {Element} ele ancentor
 * @return {Element}
 */
ydn.crm.inj.sugar.module.Record.prototype.getDetailButton = function(ele) {
  return ele.querySelector('a[name=' +
      ydn.crm.inj.sugar.module.RecordCtrlRenderer.NAME_DETAIL + ']');
};


/**
 * Get View click control
 * @protected
 * @return {Element}
 */
ydn.crm.inj.sugar.module.Record.prototype.getNewNoteElement = function() {
  return this.getElement().querySelector('a[name=' +
      ydn.crm.inj.sugar.module.Record.NAME_NEW_NOTE + ']');
};


/**
 * Reset control UI to initial state.
 */
ydn.crm.inj.sugar.module.Record.prototype.reset = function() {
  var ele = this.getElement();
  var header_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_HEADER, ele);
  var content_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_CONTENT, ele);
  var a_detail = this.getDetailButton(header_ele);
  a_detail.textContent = 'detail';
  goog.style.setElementShown(a_detail, true);
};


/**
 * Toggle view.
 * @param e
 */
ydn.crm.inj.sugar.module.Record.prototype.toggleDetail = function(e) {
  var ele = this.getElement();
  var header_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_HEADER, ele);
  var content_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_CONTENT, ele);
  var a_view = this.getDetailButton(header_ele);
  if (content_ele.classList.contains(ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_DETAIL)) {
    a_view.textContent = 'detail';
    content_ele.classList.remove(ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_DETAIL);
  } else {
    a_view.textContent = 'less';
    content_ele.classList.add(ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_DETAIL);
  }
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.Record.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  var model = this.getModel();
  if (model) {
    hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, this.refresh);
  }
  hd.listen(this.getDetailButton(this.getElement()), 'click', this.toggleDetail, false);
  hd.listen(this.getNewNoteElement(), 'click', this.handleNewNote_, true);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.inj.sugar.module.Record.prototype.handleNewNote_ = function(e) {
  e.preventDefault();
  /**
   * @type {ydn.crm.sugar.model.Sugar}
   */
  var sugar = this.getModel().getSugar();
  var r = new ydn.crm.sugar.Record(sugar.getDomain(), ydn.crm.sugar.ModuleName.NOTES);
  var note_model = new ydn.crm.sugar.model.Record(sugar, r);
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.Record.prototype.refresh = function(e) {
  var model = this.getModel();
  var root = this.getElement();
  var record = model.getRecord();
  if (ydn.crm.inj.sugar.module.Record.DEBUG) {
    window.console.log('module body ' + model.getModuleName() + ' refresh for ' + e.type, record);
  }
  if (record) {
    goog.style.setElementShown(root, true);
  } else {
    goog.style.setElementShown(root, false);
    return;
  }

  if (e && e.type == ydn.crm.sugar.model.events.Type.RECORD_CHANGE) {
    this.reset();
  }

  for (var i = 0; i < this.getChildCount(); i++) {
    var child = this.getChildAt(i);
    if (child instanceof ydn.crm.inj.sugar.module.Group) {
      var g = /** @type {ydn.crm.inj.sugar.module.Group} */ (child);
      g.refresh();
    }
  }

};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.Record,
    ydn.crm.inj.sugar.module.RecordCtrlRenderer);

