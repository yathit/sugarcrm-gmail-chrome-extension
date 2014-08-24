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
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Sugar');
goog.require('ydn.crm.ui');
goog.require('ydn.crm.ui.StatusBar');
goog.require('ydn.crm.ui.sugar.events');
goog.require('ydn.crm.ui.sugar.field.Field');
goog.require('ydn.crm.ui.sugar.record.Body');
goog.require('ydn.crm.ui.sugar.record.Default');
goog.require('ydn.crm.ui.sugar.record.FooterRenderer');
goog.require('ydn.crm.ui.sugar.record.Head');
goog.require('ydn.crm.ui.sugar.record.Secondary');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Record} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @param {ydn.crm.ui.sugar.record.Record=} opt_parent parent panel for for child record panel.
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.record.Record = function(model, opt_dom, opt_parent) {
  goog.base(this, opt_dom);
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
   * @type {ydn.crm.ui.sugar.record.Head}
   */
  this.head_panel = new ydn.crm.ui.sugar.record.Head(model, opt_dom);
  /**
   * @protected
   * @type {ydn.crm.ui.sugar.record.Body}
   */
  this.body_panel = this.createBodyPanel();
  /**
   * @final
   * @protected
   * @type {ydn.crm.ui.sugar.record.Secondary}
   */
  this.secondary_panel = new ydn.crm.ui.sugar.record.Secondary(model, opt_dom);
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
 * @type {string} class name for body content when viewing.
 */
ydn.crm.ui.sugar.record.Record.CSS_CLASS_DETAIL = 'detail';


/** @return {string} */
ydn.crm.ui.sugar.record.Record.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.record.Record.CSS_CLASS;
};


/**
 * @return {?ydn.crm.ui.sugar.record.Record}
 */
ydn.crm.ui.sugar.record.Record.prototype.getParentPanel = function() {
  return this.parent_panel;
};


/**
 * @return {ydn.crm.ui.sugar.record.Body}
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.createBodyPanel = function() {
  var model = this.getModel();
  var dom = this.getDomHelper();
  var mn = model.getModuleName();
  return new ydn.crm.ui.sugar.record.Default(model, dom);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Record.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_CONTENT);
};


/**
 * @return {Element}
 */
ydn.crm.ui.sugar.record.Record.prototype.getHeaderElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_HEAD);
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
  var header = dom.createDom('div', ydn.crm.ui.CSS_CLASS_HEAD);
  var content = dom.createDom('div', ydn.crm.ui.CSS_CLASS_CONTENT);
  root.appendChild(header);
  root.appendChild(content);

  this.addChild(this.head_panel, true);
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
  var footer_ele = this.getElement().querySelector('.' + ydn.crm.ui.sugar.record.FooterRenderer.CSS_CLASS);
  hd.listen(model, ydn.crm.sugar.model.events.Type.MODULE_CHANGE, this.handleModuleChanged);
  hd.listen(model, ydn.crm.sugar.model.events.Type.GDATA_CHANGE, this.handleRecordChanged);
  hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, this.handleRecordChanged);
  hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_UPDATE, this.handleRecordUpdated);
  hd.listen(this.getContentElement(), goog.events.EventType.CLICK, this.handleContentClick, false);
  hd.listen(this, [ydn.crm.ui.sugar.field.EventType.CHANGE], this.handleInputChanged);
  hd.listen(this.head_panel, [ydn.crm.ui.sugar.events.SettingChangeEvent.TYPE],
      this.handleSettingChange);

  this.reset();
};


/**
 * @protected
 * @param {ydn.crm.ui.sugar.field.ChangedEvent} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleInputChanged = function(e) {
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var model = this.getModel();
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log(model.getRecordValue(), e);
  }
  if (e.type == ydn.crm.ui.sugar.field.EventType.CHANGE) {
    this.setMessage('saving...');
    model.patch(e.patches).addCallbacks(function(x) {
      this.setMessage('saved');
    }, function(e) {
      this.setMessage('error saving ' + e.message, true);
    }, this);
  }
};


/**
 * @protected
 * @param {ydn.crm.ui.sugar.events.SettingChangeEvent} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleSettingChange = function(e) {
  this.body_panel.handleSettingChange(e);
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleEditMode = function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.target.classList.toggle(ydn.crm.ui.CSS_CLASS_ACTIVE);
  var edit = e.target.classList.contains(ydn.crm.ui.CSS_CLASS_ACTIVE);

};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleContentClick = function(e) {
  if (e.target.classList.contains(ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE)) {
    var group = this.body_panel.getGroupByFieldValueElement(/** @type {Element} */ (e.target));

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
 * @return {?SugarCrm.Record} null if record value is not updated.
 */
ydn.crm.ui.sugar.record.Record.prototype.getUpdatedValue = function() {

  var delta = this.body_panel.collectData(this);
  if (delta) {
    var old_value = this.getModel().getRecordValue();
    if (old_value) {
      for (var name in delta) {
        old_value[name] = delta[name];
      }
      return old_value;
    } else {
      return delta;
    }
  }
  return null;
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
};


/**
 * @protected
 * @param {*} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleModuleChanged = function(e) {
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log(e.type, e);
  }
  this.removeChild(this.body_panel, true);
  this.body_panel.dispose();
  this.body_panel = this.createBodyPanel();
  this.addChildAt(this.body_panel, 1, true);
  this.reset();
};


/**
 * @protected
 * @param {*} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleRecordChanged = function(e) {
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log('Record:handleRecordChanged:' + e.type);
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
  this.head_panel.reset();
  this.footer_panel.reset(this);
  this.body_panel.reset();
  this.body_panel.refresh();
  if (model.hasRecord()) {
    root.className = this.getCssClass() + ' ' + model.getModuleName();
  } else {
    root.className = this.getCssClass() + ' ' + model.getModuleName() + ' ' +
        ydn.crm.ui.CSS_CLASS_EMPTY;
  }

};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Record.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
};


/**
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.refresh = function() {
  var model = this.getModel();
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log('Record:refresh:' + model + ' hasRecord:' + model.hasRecord());
  }
  if (model.hasRecord()) {
    this.getElement().classList.remove(ydn.crm.ui.CSS_CLASS_EMPTY);
  } else {
    this.getElement().classList.add(ydn.crm.ui.CSS_CLASS_EMPTY);
  }
  this.head_panel.refresh();
  this.footer_panel.reset(this);
  this.body_panel.refresh();
};


if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.ui.sugar.record.Record.prototype.toString = function() {
    return 'ydn.crm.ui.sugar.record.Record:' + this.getModel();
  };
}
