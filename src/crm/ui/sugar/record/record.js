// Copyright 2014 YDN Authors. All Rights Reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * A specific renderer is selected depending on module type.
 * This is container for group panel and has some controls to viewing and editing.
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.record.Record');
goog.require('goog.ui.Component');
goog.require('ydn.app.msg.Manager');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Sugar');
goog.require('ydn.crm.ui');
goog.require('ydn.crm.ui.StatusBar');
goog.require('ydn.crm.ui.sugar.events');
goog.require('ydn.crm.ui.sugar.field.Field');
goog.require('ydn.crm.ui.sugar.record.Body');
goog.require('ydn.crm.ui.sugar.record.Default');
goog.require('ydn.crm.ui.sugar.record.FooterRenderer');
goog.require('ydn.crm.ui.sugar.record.HeaderRenderer');
goog.require('ydn.crm.ui.sugar.record.Secondary');
goog.require('ydn.ui.FlyoutMenu');



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
   * @type {ydn.ui.FlyoutMenu}
   */
  this.head_menu = new ydn.ui.FlyoutMenu({
    className: 'menu'
  });
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


/**
 * @return {string}
 */
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
  var ele_header = dom.createDom('div', ydn.crm.ui.CSS_CLASS_HEAD);
  var content = dom.createDom('div', ydn.crm.ui.CSS_CLASS_CONTENT);
  root.appendChild(ele_header);
  root.appendChild(content);

  ele_header.classList.add(ydn.crm.ui.sugar.record.HeaderRenderer.CSS_CLASS);
  ele_header.classList.add(ydn.crm.ui.CSS_CLASS_FLEX_BAR);

  var title = dom.createDom('a', {
    'class': ydn.crm.ui.sugar.record.HeaderRenderer.CSS_CLASS_TITLE + ' center',
    'title': 'Open in SugarCRM'
  });

  var record_type_badge = dom.createDom('span',
      ydn.crm.ui.sugar.record.HeaderRenderer.CSS_CLASS_ICON);
  var save_btn = dom.createDom('span', 'svg-button ' + ydn.crm.ui.CSS_CLASS_OK_BUTTON,
      ydn.crm.ui.createSvgIcon('check-circle'));

  ele_header.appendChild(record_type_badge);
  ele_header.appendChild(title);
  ele_header.appendChild(save_btn);
  this.head_menu.render(ele_header);

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
  var menu_ele = this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_HEAD +
      ' .' + ydn.ui.FlyoutMenu.CSS_CLASS);
  hd.listen(model.parent, ydn.crm.sugar.model.events.Type.CONTEXT_CHANGE, this.onContextChange);
  hd.listen(model, ydn.crm.sugar.model.events.Type.MODULE_CHANGE, this.handleModuleChanged);
  hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, this.handleRecordChanged);
  hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_UPDATE, this.handleRecordUpdated);
  hd.listen(this.getContentElement(), goog.events.EventType.CLICK, this.handleContentClick, false);
  hd.listen(this, [ydn.crm.ui.sugar.events.Type.CHANGE], this.handleInputChanged);
  hd.listen(menu_ele, 'click', this.handleHeaderMenuClick);

  var ok_btn = this.getHeaderElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_OK_BUTTON);
  hd.listen(ok_btn, 'click', this.onSaveClick);

  this.reset();
};


/**
 * @protected
 * @param {goog.events.BrowserEvent} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleHeaderMenuClick = function(e) {
  var cmd = this.head_menu.handleClick(e);
  console.log(cmd);
  if (cmd == 'edit') {
    this.setEditMode(!this.getEditMode());
  } else if (cmd == 'field-option') {
    this.showFieldDisplayDialog();
  } else if (cmd == 'record-detail') {
    this.showDetailDialog();
  }
};


/**
 * @protected
 * @param {goog.events.BrowserEvent} e
 */
ydn.crm.ui.sugar.record.Record.prototype.onSaveClick = function(e) {
  var patches = this.body_panel.collectData();
  var mid = ydn.app.msg.Manager.addStatus('Saving...');
  var model = this.getModel();
  this.patch(patches).addCallbacks(function(x) {
    ydn.app.msg.Manager.setStatus(mid, model.getModuleName(), ' saved.');
    var href = /** @type {string} */ (model.getViewLink());
    ydn.app.msg.Manager.setLink(mid, href, model.getLabel(), 'View in SugarCRM');
    this.setDirty(false);
  }, function(e) {
    ydn.app.msg.Manager.updateStatus(mid, e.message, ydn.app.msg.MessageType.ERROR);
  }, this);
};


/**
 * Show record detail dialog to change default display.
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.showFieldDisplayDialog = function() {
  var dialog = this.getFieldDisplayDialog_();
  var content = dialog.querySelector('.content');
  var m_name = content.getAttribute('name');
  if (!m_name) {
    // first time use, attach listeners
    var close_btn = dialog.querySelector('button.apply');
    var cancel_btn = dialog.querySelector('button.cancel');
    close_btn.onclick = function() {
      dialog.close('close');
    };
    cancel_btn.onclick = function() {
      dialog.close('cancel');
    };
    this.getHandler().listen(dialog, 'close', this.onFieldDisplayDialogClose_);
  }
  var record = this.getModel();
  var dom = this.getDomHelper();
  var model_m_name = record.getModuleName();
  if (m_name != model_m_name) {
    content.innerHTML = '';
    content.setAttribute('name', model_m_name);
    var table = ydn.crm.ui.getTemplateElement('field-table').content;
    content.appendChild(table.cloneNode(true));
    var group_body = content.querySelector('tbody.group-body');
    var field_body = content.querySelector('tbody.field-body');
    var module_info = record.getModuleInfo();
    var groups = [];
    var other_group = null;
    var us = ydn.crm.ui.UserSetting.getInstance();
    for (var name in module_info.module_fields) {
      var field = module_info.module_fields[name];
      var group = field.group;
      var setting;
      var tr = document.createElement('tr');
      if (group) {
        if (groups.indexOf(group) == -1) {
          groups.push(group);
          group_body.appendChild(tr);
          setting = new ydn.crm.ui.sugar.setting.Group(group);
        } else {
          continue;
        }
      } else {
        field_body.appendChild(tr);
        setting = new ydn.crm.ui.sugar.setting.Field(field);
      }
      tr.setAttribute('name', setting.getName());
      var show_td = document.createElement('td');
      var name_td = document.createElement('td');
      var show_chk = document.createElement('input');
      show_td.appendChild(show_chk);
      show_chk.type = 'checkbox';
      if (!setting.getNormallyHide()) {
        show_chk.checked = true;
      }
      name_td.textContent = setting.getLabel();
      tr.appendChild(show_td);
      tr.appendChild(name_td);
    }
  }

  dialog.showModal();
};


/**
 * @return {HTMLDialogElement}
 * @private
 */
ydn.crm.ui.sugar.record.Record.prototype.getFieldDisplayDialog_ = function() {
  return /** @type {HTMLDialogElement} */ (ydn.crm.ui.getTemplateElement('field-display-dialog'));
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.sugar.record.Record.prototype.onFieldDisplayDialogClose_ = function(e) {
  if (e.type == 'close') {
    var dialog = /** @type {HTMLDialogElement} */ (e.target);
    var group_body = dialog.querySelector('.group-body');
    var group_display_setting = this.collectDisplaySetting_(group_body);
    this.setFieldDisplaySetting(true, group_display_setting);
    var field_body = dialog.querySelector('.field-body');
    var field_display_setting = this.collectDisplaySetting_(field_body);
    this.setFieldDisplaySetting(false, field_display_setting);
    this.body_panel.reset();
    this.body_panel.refresh();
  }
};


/**
 * Collect normally hide display setting from DOM.
 * @param {Element} tbody
 * @return {Object.<boolean>}
 * @private
 */
ydn.crm.ui.sugar.record.Record.prototype.collectDisplaySetting_ = function(tbody) {
  var settings = {};
  var n = tbody.childElementCount;
  for (var i = 0; i < n; i++) {
    var tr = tbody.children[i];
    var td1 = tr.children[0];
    var chk = td1.children[0];
    settings[tr.getAttribute('name')] = !chk.checked;
  }
  return settings;
};


/**
 * Set field display setting.
 * @param {boolean} is_group
 * @param {Object.<boolean>} settings
 */
ydn.crm.ui.sugar.record.Record.prototype.setFieldDisplaySetting = function(is_group, settings) {
  var record = this.getModel();
  var module_info = record.getModuleInfo();
  var us = ydn.crm.ui.UserSetting.getInstance();

  for (var name in settings) {
    var field = module_info.module_fields[name];
    var setting;
    if (is_group) {
      setting = new ydn.crm.ui.sugar.setting.Group(name);
    } else {
      setting = new ydn.crm.ui.sugar.setting.Field(field);
    }
    setting.setNormallyHide(settings[name]);
  }
};


/**
 * Show record detail dialog to see the fields.
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.showDetailDialog = function() {
  var record = this.getModel();
  var data = record.cloneData();
  var dialog = /** @type {HTMLDialogElement} */ (ydn.crm.ui.getTemplateElement('record-detail-dialog'));
  var cancel_btn = dialog.querySelector('button.ok');
  cancel_btn.onclick = function() {
    dialog.close('close');
  };
  var content = dialog.querySelector('.content');
  content.innerHTML = '';
  var pre = document.createElement('pre');
  if (data) {
    for (var name in data) {
      if (goog.string.startsWith(name, 'ydn$')) {
        delete data[name];
      }
    }
    pre.textContent = JSON.stringify(data, null, 2);
  }
  content.appendChild(pre);
  dialog.showModal();
};


/**
 * @protected
 * @param {ydn.crm.ui.sugar.events.ChangedEvent} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleInputChanged = function(e) {
  if (this.getEditMode()) {
    this.setDirty(true);
  } else {
    this.patch(e.patches);
  }
};


/**
 * Set record is dirty.
 * @param {boolean} val
 */
ydn.crm.ui.sugar.record.Record.prototype.setDirty = function(val) {
  var btn = this.getHeaderElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_OK_BUTTON);
  goog.style.setElementShown(btn, !!val);
};


/**
 * Get record is dirty.
 * @return {boolean} dirty state.
 */
ydn.crm.ui.sugar.record.Record.prototype.getDirty = function() {
  var btn = this.getHeaderElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_OK_BUTTON);
  return goog.style.isElementShown(btn);
};


/**
 * Save patch record to server.
 * @param {Object} patches
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.sugar.record.Record.prototype.patch = function(patches) {
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var model = this.getModel();
  return model.patch(patches);
};


/**
 * Return data from UI values. Return null, if invalid data present.
 * @return {?SugarCrm.Record} null if data is not valid.
 */
ydn.crm.ui.sugar.record.Record.prototype.collectData = function() {
  return this.body_panel.collectData();
};


/**
 * @protected
 * @param {ydn.crm.ui.sugar.events.SettingChangeEvent} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleSettingChange = function(e) {
  this.body_panel.handleSettingChange(e);
};


/**
 * Change edit mode.
 * @param {boolean} val
 */
ydn.crm.ui.sugar.record.Record.prototype.setEditMode = function(val) {
  var root = this.getElement();
  if (val) {
    root.classList.add(ydn.crm.ui.sugar.record.Body.CSS_CLASS_EDIT);
  } else {
    root.classList.remove(ydn.crm.ui.sugar.record.Body.CSS_CLASS_EDIT);
  }

  this.body_panel.setEditMode(val);
};


/**
 * @return {boolean}
 */
ydn.crm.ui.sugar.record.Record.prototype.getEditMode = function() {
  return this.getElement().classList.contains(ydn.crm.ui.sugar.record.Body.CSS_CLASS_EDIT);
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
  var type = opt_is_error ? ydn.app.msg.MessageType.ERROR : ydn.app.msg.MessageType.NORMAL;
  return ydn.app.msg.Manager.addStatus(s, '', type);
};


/**
 * @return {?SugarCrm.Record} null if record value is not updated.
 */
ydn.crm.ui.sugar.record.Record.prototype.getUpdatedValue = function() {

  var delta = this.body_panel.collectData();
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
 * @param {ydn.crm.sugar.model.events.ContextChangeEvent} e
 */
ydn.crm.ui.sugar.record.Record.prototype.onContextChange = function(e) {
  var model = this.getModel();
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log('onContextChange: ' + e.record);
  }
  if (e.record) {
    model.setRecord(e.record);
  } else if (!e.record) {
    var record = new ydn.crm.sugar.Record(model.getDomain(), model.getModuleName());
    model.setRecord(record);
  }
};


/**
 * @protected
 * @param {*} e
 */
ydn.crm.ui.sugar.record.Record.prototype.handleModuleChanged = function(e) {
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log('handleModuleChanged');
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
    window.console.log('Record:handleRecordChanged:');
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
 * Reset UI when record ID or user setting changed.
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.reset = function() {
  var model = this.getModel();
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log('reset ' + model);
  }
  var root = this.getElement();
  this.resetHeader();
  this.refreshHeader();
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
 * Refresh UI when record is updated.
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
  this.refreshHeader();
  this.footer_panel.reset(this);
  this.body_panel.refresh();
};


/**
 * Simulate user edit.
 * @param {Object} user_patch patch object of field name and its value, of user edited.
 * @param {boolean=} opt_dispatch_event dispatch change event.
 */
ydn.crm.ui.sugar.record.Record.prototype.simulateEdit = function(user_patch, opt_dispatch_event) {
  if (!user_patch) {
    return;
  }
  this.body_panel.simulateEdit(user_patch);
  if (opt_dispatch_event) {
    var patch = this.collectData();
    var ev = new ydn.crm.ui.sugar.events.ChangedEvent(patch, this);
    this.dispatchEvent(ev);
  }
};


if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.ui.sugar.record.Record.prototype.toString = function() {
    return 'ydn.crm.ui.sugar.record.Record:' + this.getModel();
  };
}


/**
 * Render new record creation UI for given module.
 * @param {ydn.crm.sugar.ModuleName} m_name
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.newRecord = function(m_name) {
  if (ydn.crm.ui.sugar.record.Record.DEBUG) {
    window.console.log('new record prepare for ' + m_name);
  }

  var model = this.getModel();
  var patches = model.cloneData();
  delete patches.id;
  delete patches._module;
  delete patches.date_entered;
  delete patches.date_modified;
  var r = new ydn.crm.sugar.Record(model.getDomain(), m_name);
  // var r = new ydn.crm.sugar.Record(sugar.getDomain(), m_name, patches);
  // NOTE: we don't modify model for UI edit, but simulate user edit bellow.
  model.setRecord(r);
  if (patches) {
    this.simulateEdit(patches);
    // this.head_panel.setDirty(this, true);
  }

  this.setEditMode(true);
};


/**
 * @param {ydn.crm.ui.sugar.events.NewRecord} e
 */
ydn.crm.ui.sugar.record.Record.prototype.onNewRecord = function(e) {
  this.newRecord(e.module_name);
};


/**
 * @const
 * @type {Array.<?ydn.ui.FlyoutMenu.ItemOption>}
 */
ydn.crm.ui.sugar.record.Record.BASE_MENU_ITEMS = [
  {
    name: 'edit',
    label: 'Edit'
  }, null, {
    name: 'new',
    label: 'New',
    children: [{
      name: 'new-Contacts',
      label: 'Contacts'
    }, {
      name: 'new-Leads',
      label: 'Leads'
    }, {
      name: 'new-Accounts',
      label: 'Accounts'
    }]
  }, {
    name: 'duplicate',
    label: 'Duplicate to',
    children: [{
      name: 'duplicate-Contacts',
      label: 'Contacts'
    }, {
      name: 'duplicate-Leads',
      label: 'Leads'
    }, {
      name: 'duplicate-Accounts',
      label: 'Accounts'
    }]
  }, null, {
    name: 'record-detail',
    label: 'View details ...'
  }, {
    name: 'field-option',
    label: 'Fields ...'
  }
];


/**
 * @return {Array.<?ydn.ui.FlyoutMenu.ItemOption>}
 * @protected
 */
ydn.crm.ui.sugar.record.Record.prototype.getMenuItems = function() {
  var record = this.getModel();
  var m_name = record.getModuleName();
  var items = ydn.object.clone(ydn.crm.ui.sugar.record.Record.BASE_MENU_ITEMS);
  if (ydn.crm.sugar.PEOPLE_MODULES.indexOf(m_name) == -1) {
    items[2].disabled = true;
  }
  return items;
};


/**
 * Reset header.
 * Record type, record id may change.
 */
ydn.crm.ui.sugar.record.Record.prototype.resetHeader = function() {
  var ele_header = this.getHeaderElement();
  var record = this.getModel();
  var dom = this.getDomHelper();
  var m_name = record.getModuleName();
  if (ydn.crm.ui.sugar.record.HeaderRenderer.DEBUG) {
    window.console.log('HeadRenderer:reset:' + m_name + ':' + record);
  }
  var badge = ele_header.querySelector('span.' +
          ydn.crm.ui.sugar.record.HeaderRenderer.CSS_CLASS_ICON);
  badge.textContent = ydn.crm.sugar.toModuleSymbol(m_name);

  this.head_menu.setItems(this.getMenuItems());

  var ok = ele_header.querySelector('.' + ydn.crm.ui.CSS_CLASS_OK_BUTTON);
  goog.style.setElementShown(ok, false);
};


/**
 * Refresh header.
 */
ydn.crm.ui.sugar.record.Record.prototype.refreshHeader = function() {

  var ele_header = this.getHeaderElement();
  var record = this.getModel();
  var m_name = record.getModuleName();
  if (ydn.crm.ui.sugar.record.HeaderRenderer.DEBUG) {
    window.console.log('HeadRenderer:refresh:' + m_name + ':' + record);
  }
  var ele_title = ele_header.querySelector('a.' + ydn.crm.ui.sugar.record.HeaderRenderer.CSS_CLASS_TITLE);
  if (record.hasRecord()) {
    ele_title.textContent = record.getLabel();
    ele_title.href = record.getViewLink();
    ele_title.target = record.getDomain();
  } else {
    ele_title.innerHTML = '';
    ele_title.href = '';
  }
};
