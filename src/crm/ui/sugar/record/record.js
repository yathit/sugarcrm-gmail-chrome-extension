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
 * A specific renderer is selected depending on module type.
 * This is container for group panel and has some controls to viewing and editing.
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.record.Record');
goog.require('goog.ui.Component');
goog.require('ydn.crm.inj.sugar.module.Field');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Sugar');
goog.require('ydn.crm.ui');
goog.require('ydn.crm.ui.StatusBar');
goog.require('ydn.crm.ui.sugar.record.Body');
goog.require('ydn.crm.ui.sugar.record.Default');
goog.require('ydn.crm.ui.sugar.record.FooterRenderer');
goog.require('ydn.crm.ui.sugar.record.HeadRenderer');
goog.require('ydn.crm.ui.sugar.record.Note');
goog.require('ydn.crm.ui.sugar.record.Secondary');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Record} model
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.ui.sugar.record.Record=} opt_parent parent panel for for child record panel.
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.record.Record = function(model, dom, opt_parent) {
  goog.base(this, dom);
  goog.asserts.assert(model);
  this.setModel(model);
  /**
   * @final
   * @protected
   * @type {ydn.crm.ui.sugar.record.Record}
   */
  this.parent_panel = opt_parent || null;
  /**
   * @final
   * @protected
   * @type {ydn.crm.ui.sugar.record.HeadRenderer}
   */
  this.head_panel = ydn.crm.ui.sugar.record.HeadRenderer.getInstance();
  /**
   * @protected
   * @type {ydn.crm.ui.sugar.record.Body}
   */
  this.body_panel = this.getBodyPanel();
  /**
   * @final
   * @protected
   * @type {ydn.crm.ui.sugar.record.Secondary}
   */
  this.secondary_panel = new ydn.crm.ui.sugar.record.Secondary(model, dom);
  /**
   * @final
   * @protected
   * @type {ydn.crm.ui.sugar.record.FooterRenderer}
   */
  this.footer_panel = ydn.crm.ui.sugar.record.FooterRenderer.getInstance();
};
goog.inherits(ydn.crm.ui.sugar.record.Record, goog.ui.Component);


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Record.NEW_RECORD_EVENT = 'new-record';


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.sugar.record.Record.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.sugar.record.Record');


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.record.Record.DEBUG = false;


/**
 * @return {ydn.crm.sugar.model.Record}
 * @override
 */
ydn.crm.ui.sugar.record.Record.prototype.getModel;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Record.CSS_CLASS = 'record-panel';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Record.CSS_CLASS_CONTENT = 'content';


/** @return {string} */
ydn.crm.ui.sugar.record.Record.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.record.Record.CSS_CLASS;
};


/**
 * @return {ydn.crm.ui.sugar.record.Record?}
 */
ydn.crm.ui.sugar.record.Record.prototype.getParentPanel = function() {
  return this.parent_panel;
};


/**
 * @return {ydn.crm.ui.sugar.record.Body}
 */
ydn.crm.ui.sugar.record.Record.prototype.getBodyPanel = function() {
  var model = this.getModel();
  var dom = this.getDomHelper();
  var mn = model.getModuleName();
  if (mn == ydn.crm.sugar.ModuleName.NOTES) {
    return new ydn.crm.ui.sugar.record.Note(model, dom);
  } else {
    return new ydn.crm.ui.sugar.record.Default(model, dom);
  }
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Record.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.sugar.record.Record.CSS_CLASS_CONTENT);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Record.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  // root.classList.add(this.getCssClass());
  root.className = this.getCssClass() + ' ' + this.getModel().getModuleName();
  var header = dom.createDom('div', ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS);
  var content = dom.createDom('div', ydn.crm.ui.sugar.record.Record.CSS_CLASS_CONTENT);
  root.appendChild(header);
  root.appendChild(content);

  this.head_panel.createDom(this);
  this.addChild(this.body_panel, true);
  this.addChild(this.secondary_panel, true);

  var footer = dom.createDom('div', ydn.crm.ui.sugar.record.FooterRenderer.CSS_CLASS);
  root.appendChild(footer);
  this.footer_panel.createDom(this);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Record.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var model = this.getModel();
  // Note: we do not listen events on element of children of these component.
  hd.listen(model, 'click', this.handleModuleChanged, false);

  hd.listen(this.footer_panel.getSaveButton(this.getElement()),
      'click', this.handleSave, true);
  hd.listen(model, ydn.crm.sugar.model.events.Type.MODULE_CHANGE, this.handleModuleChanged);
  hd.listen(model, ydn.crm.sugar.model.events.Type.GDATA_CHANGE, this.handleRecordChanged);
  hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, this.handleRecordChanged);
  hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_UPDATE, this.handleRecordUpdated);
  var header_ele = this.getElement().querySelector('.' + ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS);
  hd.listen(header_ele, goog.events.EventType.CLICK, this.handleClick, false);
  hd.listen(this.getElement(), goog.events.EventType.DBLCLICK, this.handleDbClick, false);
  this.reset();
};


/**
 * @protected
 * @param e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleClick = function(e) {
  this.getElement().classList.add(ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_ACTIVATED);
  var name = e.target.getAttribute('name');
  if (e.target.classList.contains(ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_NEW_ITEM)) {
    e.preventDefault();
    var module_name = ydn.crm.sugar.toModuleName(name);
    this.addNewItem(module_name);
  } else if (e.target.classList.contains(ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_LINK)) {
    e.preventDefault();
    // link click, it could be one of 'link', 'export', 'synced' state.
    var a_link = e.target;
    if (a_link.classList.contains(ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_SYNCED)) {
      // sync
      this.logger.finer('record in sync');
    } else {
      /**
       * @type {ydn.crm.sugar.model.Record}
       */
      var record = this.getModel();
      if (record instanceof ydn.crm.sugar.model.GDataRecord) {
        // this is always true, because link element is shown only for GDataRecord
        var g_record = /** @type {ydn.crm.sugar.model.GDataRecord} */ (record);
        if (g_record.canSync()) {
          a_link.textContent = '...';
          g_record.link().addCallbacks(function(x) {
            a_link.textContent = '';
          }, function(e) {
            a_link.textContent = 'error';
            throw e;
          }, this);
        } else {
          a_link.textContent = '...';
          g_record.export2GData().addCallbacks(function(x) {
            a_link.textContent = '';
          }, function(e) {
            a_link.textContent = 'error';
            throw e;
          }, this);
        }
      }
    }
  } else if (name == ydn.crm.ui.sugar.record.HeadRenderer.NAME_DETAIL) {
    this.handleDetailClick(e);
  } else if (name == ydn.crm.ui.sugar.record.HeadRenderer.NAME_EDIT) {
    e.preventDefault();
    var mode = this.body_panel.getEditMode();
    this.setEditMode(!mode);
  }
};


/**
 * @protected
 * @param e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleDbClick = function(e) {
  // this.setEditMode(true);
};


/**
 * Change edit mode.
 * @param {boolean} val
 */
ydn.crm.ui.sugar.record.Record.prototype.setEditMode = function(val) {
  this.body_panel.setEditMode(val);
  this.footer_panel.setEditMode(this, val);
  if (val) {
    this.getElement().classList.remove(ydn.crm.ui.CSS_CLASS_EMPTY);
  } else {
    if (this.getModel().hasRecord()) {
      this.getElement().classList.add(ydn.crm.ui.CSS_CLASS_EMPTY);
    }
  }
};


/**
 * Set a message.
 * @param {string} s
 * @param {boolean=} opt_is_error
 * @return {number}
 */
ydn.crm.ui.sugar.record.Record.prototype.setMessage = function(s, opt_is_error) {
  return ydn.crm.ui.StatusBar.instance.setMessage(s, opt_is_error);
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleSave = function(e) {
  var btn = e.target;
  var data = this.body_panel.collectData(this);
  if (!data) {
    return;
  }
  btn.textContent = 'saving...';
  btn.setAttribute('disabled', '1');
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var model = this.getModel();
  /**
   * @type {ydn.crm.sugar.Record}
   */
  var r = model.getRecord();
  r.updateData(data);
  model.save().addCallbacks(function(x) {
    this.setMessage('saved');
    this.setEditMode(false);
    btn.textContent = 'Save';
    btn.removeAttribute('disabled');
  }, function(e) {
    btn.textContent = 'Save';
    this.setMessage('error saving ' + e.message, true);
  }, this);
};


/**
 * Toggle view.
 * @param {Event} e
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.handleDetailClick = function(e) {
  e.preventDefault();
  var root = this.getElement();
  var body_ele = this.body_panel.getElement();
  var a_view = this.head_panel.getDetailButton(root);
  if (a_view.textContent != 'detail') {
    a_view.textContent = 'detail';
    body_ele.classList.remove(ydn.crm.ui.sugar.record.Body.CSS_CLASS_DETAIL);
  } else {
    a_view.textContent = 'less';
    body_ele.classList.add(ydn.crm.ui.sugar.record.Body.CSS_CLASS_DETAIL);
  }
};


/**
 * @param {ydn.crm.sugar.ModuleName} module_name
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.addNewItem = function(module_name) {

  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var this_record = this.getModel();
  var sugar = this_record.getSugar();
  var r = new ydn.crm.sugar.Record(sugar.getDomain(), module_name);
  var model = new ydn.crm.sugar.model.Record(sugar, r);
  var new_panel = new ydn.crm.ui.sugar.record.Record(model, this.getDomHelper(), this);
  this.secondary_panel.addChild(new_panel, true);
  new_panel.setEditMode(true);
};


/**
 * @protected
 * @param {*} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleModuleChanged = function(e) {
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log(e.type, e);
  }
  this.reset();
  this.removeChild(this.body_panel, true);
  this.body_panel.dispose();
  this.body_panel = this.getBodyPanel();
  this.addChildAt(this.body_panel, 0, true);
};


/**
 * @protected
 * @param {*} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleRecordChanged = function(e) {
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log(e.type, e);
  }
  this.reset();
};


/**
 * @protected
 * @param {*} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleRecordUpdated = function(e) {
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log(e.type, e);
  }
  this.refresh();
};


/**
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.reset = function() {
  var model = this.getModel();
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log('reset ' + model);
  }
  var root = this.getElement();
  this.head_panel.reset(this);
  this.footer_panel.reset(this);
  if (model.hasRecord()) {
    root.className = this.getCssClass() + ' ' + model.getModuleName();
  } else {
    root.className = this.getCssClass() + ' ' + model.getModuleName() + ' ' + ydn.crm.ui.CSS_CLASS_EMPTY;
  }

};


/**
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.refresh = function() {
  if (this.getModel().hasRecord()) {
    this.getElement().classList.remove(ydn.crm.ui.CSS_CLASS_EMPTY);
  } else {
    this.getElement().classList.add(ydn.crm.ui.CSS_CLASS_EMPTY);
  }
  this.head_panel.refresh(this);
  this.footer_panel.reset(this);
};


if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.ui.sugar.record.Record.prototype.toString = function() {
    return 'ydn.crm.ui.sugar.record.Record:' + this.getModel();
  };
}
