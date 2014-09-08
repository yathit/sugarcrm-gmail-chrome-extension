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


goog.provide('ydn.crm.sugarcrm.ui.record.Record');
goog.require('goog.ui.Component');
goog.require('ydn.app.msg.Manager');
goog.require('ydn.crm.sugarcrm');
goog.require('ydn.crm.sugarcrm.model.Sugar');
goog.require('ydn.crm.sugarcrm.ui.events');
goog.require('ydn.crm.sugarcrm.ui.field.Field');
goog.require('ydn.crm.sugarcrm.ui.record.Body');
goog.require('ydn.crm.sugarcrm.ui.record.Default');
goog.require('ydn.crm.sugarcrm.ui.record.FooterRenderer');
goog.require('ydn.crm.sugarcrm.ui.record.HeaderRenderer');
goog.require('ydn.crm.sugarcrm.ui.record.Secondary');
goog.require('ydn.crm.ui');
goog.require('ydn.crm.ui.StatusBar');
goog.require('ydn.ui.FlyoutMenu');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugarcrm.model.Record} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @param {ydn.crm.sugarcrm.ui.record.Record=} opt_parent parent panel for for child record panel.
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugarcrm.ui.record.Record = function(model, opt_dom, opt_parent) {
  goog.base(this, opt_dom);
  goog.asserts.assert(model);
  this.setModel(model);

  /**
   * @final
   * @protected
   * @type {ydn.crm.sugarcrm.ui.record.Record}
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
   * @type {ydn.crm.sugarcrm.ui.record.Body}
   */
  this.body_panel = this.createBodyPanel();
  /**
   * @final
   * @protected
   * @type {ydn.crm.sugarcrm.ui.record.Secondary}
   */
  this.secondary_panel = new ydn.crm.sugarcrm.ui.record.Secondary(model, opt_dom);
  /**
   * @final
   * @protected
   * @type {ydn.crm.sugarcrm.ui.record.FooterRenderer}
   */
  this.footer_panel = ydn.crm.sugarcrm.ui.record.FooterRenderer.getInstance();

};
goog.inherits(ydn.crm.sugarcrm.ui.record.Record, goog.ui.Component);


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.logger =
    goog.log.getLogger('ydn.crm.sugarcrm.ui.record.Record');


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugarcrm.ui.record.Record.DEBUG = false;


/**
 * @return {ydn.crm.sugarcrm.model.Record}
 * @override
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getModel;


/**
 * @const
 * @type {string}
 */
ydn.crm.sugarcrm.ui.record.Record.CSS_CLASS = 'record-panel';


/**
 * @const
 * @type {string} class name for body content when viewing.
 */
ydn.crm.sugarcrm.ui.record.Record.CSS_CLASS_DETAIL = 'detail';


/**
 * @return {string}
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getCssClass = function() {
  return ydn.crm.sugarcrm.ui.record.Record.CSS_CLASS;
};


/**
 * @return {?ydn.crm.sugarcrm.ui.record.Record}
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getParentPanel = function() {
  return this.parent_panel;
};


/**
 * @return {ydn.crm.sugarcrm.ui.record.Body}
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.createBodyPanel = function() {
  var model = this.getModel();
  var dom = this.getDomHelper();
  var mn = model.getModuleName();
  return new ydn.crm.sugarcrm.ui.record.Default(model, dom);
};


/**
 * @inheritDoc
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_CONTENT);
};


/**
 * @return {Element}
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getHeaderElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_HEAD);
};


/**
 * @inheritDoc
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  // root.classList.add(this.getCssClass());
  root.className = this.getCssClass() + ' ' + this.getModel().getModuleName();
  var ele_header = dom.createDom('div', ydn.crm.ui.CSS_CLASS_HEAD);
  var content = dom.createDom('div', ydn.crm.ui.CSS_CLASS_CONTENT);
  root.appendChild(ele_header);
  root.appendChild(content);

  ele_header.classList.add(ydn.crm.sugarcrm.ui.record.HeaderRenderer.CSS_CLASS);
  ele_header.classList.add(ydn.crm.ui.CSS_CLASS_FLEX_BAR);

  var title = dom.createDom('a', {
    'class': ydn.crm.sugarcrm.ui.record.HeaderRenderer.CSS_CLASS_TITLE + ' center',
    'title': 'Open in SugarCRM'
  });

  var record_type_badge = dom.createDom('span',
      ydn.crm.sugarcrm.ui.record.HeaderRenderer.CSS_CLASS_ICON);
  var save_btn = dom.createDom('span', 'svg-button ' + ydn.crm.ui.CSS_CLASS_OK_BUTTON,
      ydn.crm.ui.createSvgIcon('check-circle'));
  save_btn.setAttribute('title', 'Save');

  ele_header.appendChild(record_type_badge);
  ele_header.appendChild(title);
  ele_header.appendChild(save_btn);
  this.head_menu.render(ele_header);

  this.addChild(this.body_panel, true);
  this.addChild(this.secondary_panel, true);

  var footer = dom.createDom('div', ydn.crm.sugarcrm.ui.record.FooterRenderer.CSS_CLASS);
  root.appendChild(footer);
  this.footer_panel.createDom(this);
};


/**
 * @inheritDoc
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  /**
   * @type {ydn.crm.sugarcrm.model.Record}
   */
  var model = this.getModel();

  // Note: we do not listen events on element of children of these component.
  hd.listen(model, 'click', this.handleModuleChanged, false);
  var footer_ele = this.getElement().querySelector('.' + ydn.crm.sugarcrm.ui.record.FooterRenderer.CSS_CLASS);
  var menu_ele = this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_HEAD +
      ' .' + ydn.ui.FlyoutMenu.CSS_CLASS);
  hd.listen(model, ydn.crm.sugarcrm.model.events.Type.MODULE_CHANGE, this.handleModuleChanged);
  hd.listen(model, ydn.crm.sugarcrm.model.events.Type.RECORD_CHANGE, this.handleRecordChanged);
  hd.listen(model, ydn.crm.sugarcrm.model.events.Type.RECORD_UPDATE, this.handleRecordUpdated);
  hd.listen(this.getContentElement(), goog.events.EventType.CLICK, this.handleContentClick, false);
  hd.listen(this, [ydn.crm.sugarcrm.ui.events.Type.CHANGE], this.handleInputChanged);
  hd.listen(menu_ele, 'click', this.handleHeaderMenuClick);

  var ok_btn = this.getHeaderElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_OK_BUTTON);
  hd.listen(ok_btn, 'click', this.onSaveClick);

  this.reset();
};


/**
 * @protected
 * @param {goog.events.BrowserEvent} e
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.handleHeaderMenuClick = function(e) {
  var cmd = this.head_menu.handleClick(e);
  var dp_ = ydn.crm.sugarcrm.ui.record.Record.MenuName.DUPLICATE + '-';
  if (cmd == 'edit') {
    this.setEditMode(!this.getEditMode());
  } else if (cmd == ydn.crm.sugarcrm.ui.record.Record.MenuName.FIELDS_OPTION) {
    this.showFieldDisplayDialog();
  } else if (cmd == ydn.crm.sugarcrm.ui.record.Record.MenuName.DETAILS) {
    this.showDetailDialog();
  } else if (!!cmd && goog.string.startsWith(cmd, 'new-')) {
    var m_name = /** @type {ydn.crm.sugarcrm.ModuleName} */ (cmd.substr('new-'.length));
    this.newRecord(m_name, false);
  } else if (!!cmd && goog.string.startsWith(cmd, dp_)) {
    var m_name = /** @type {ydn.crm.sugarcrm.ModuleName} */ (cmd.substr(dp_.length));
    this.newRecord(m_name, true);
  }
};


/**
 * @protected
 * @param {goog.events.BrowserEvent} e
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.onSaveClick = function(e) {
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
ydn.crm.sugarcrm.ui.record.Record.prototype.showFieldDisplayDialog = function() {
  var dialog = this.getFieldDisplayDialog_();
  var content = dialog.querySelector('.content');
  var m_name = content.getAttribute('name');
  if (!m_name) {
    // first time use, attach listeners
    var close_btn = dialog.querySelector('button.apply');
    var cancel_btn = dialog.querySelector('button.cancel');
    close_btn.onclick = function() {
      dialog.close('apply');
    };
    cancel_btn.onclick = function() {
      dialog.close('cancel');
    };
    dialog.onclose = this.onFieldDisplayDialogClose_.bind(this);
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
          setting = new ydn.crm.sugarcrm.ui.setting.Group(group);
        } else {
          continue;
        }
      } else {
        field_body.appendChild(tr);
        setting = new ydn.crm.sugarcrm.ui.setting.Field(field);
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
ydn.crm.sugarcrm.ui.record.Record.prototype.getFieldDisplayDialog_ = function() {
  var dialog = document.querySelector('#field-display-dialog') || ydn.crm.ui.getTemplateElement('field-display-dialog');
  return /** @type {HTMLDialogElement} */ (dialog);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.onFieldDisplayDialogClose_ = function(e) {
  var dialog = /** @type {HTMLDialogElement} */ (e.target);
  if (dialog.returnValue == 'apply') {
    var group_body = dialog.querySelector('.group-body');
    var group_display_setting = this.collectDisplaySetting_(group_body);
    this.setFieldDisplaySetting(true, group_display_setting);
    var field_body = dialog.querySelector('.field-body');
    var field_display_setting = this.collectDisplaySetting_(field_body);
    this.setFieldDisplaySetting(false, field_display_setting);

    var is_edit = this.getEditMode();
    this.body_panel.reset();
    this.body_panel.refresh();
    if (is_edit) {
      this.body_panel.setEditMode(true);
    }
  }
};


/**
 * Collect normally hide display setting from DOM.
 * @param {Element} tbody
 * @return {Object.<boolean>}
 * @private
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.collectDisplaySetting_ = function(tbody) {
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
ydn.crm.sugarcrm.ui.record.Record.prototype.setFieldDisplaySetting = function(is_group, settings) {
  var record = this.getModel();
  var module_info = record.getModuleInfo();
  var us = ydn.crm.ui.UserSetting.getInstance();

  for (var name in settings) {
    var field = module_info.module_fields[name];
    var setting;
    if (is_group) {
      setting = new ydn.crm.sugarcrm.ui.setting.Group(name);
    } else {
      setting = new ydn.crm.sugarcrm.ui.setting.Field(field);
    }
    setting.setNormallyHide(settings[name]);
  }
};


/**
 * Show record detail dialog to see the fields.
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.showDetailDialog = function() {
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
 * @param {ydn.crm.sugarcrm.ui.events.ChangedEvent} e
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.handleInputChanged = function(e) {
  if (this.getEditMode()) {
    // patch is not applied, but marked as modal data is dirty.
    // event dispatcher may need to store the patches.
    // @see ydn.crm.sugarcrm.ui.group.Address#doEditorApplyDefault
    this.setDirty(true);
  } else {
    // patch is applied, so default is prevented.
    e.preventDefault();
    this.patch(e.patches);
  }
};


/**
 * Set record is dirty.
 * @param {boolean} val
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.setDirty = function(val) {
  var btn = this.getHeaderElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_OK_BUTTON);
  goog.style.setElementShown(btn, !!val);
};


/**
 * Get record is dirty.
 * @return {boolean} dirty state.
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getDirty = function() {
  var btn = this.getHeaderElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_OK_BUTTON);
  return goog.style.isElementShown(btn);
};


/**
 * Patch record and update to server.
 * @param {Object} patches Field name-value pairs to patch the record data.
 * @return {!goog.async.Deferred.<SugarCrm.Record>} Resolved with record object
 * as return from the server.
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.patch = function(patches) {
  /**
   * @type {ydn.crm.sugarcrm.model.Record}
   */
  var model = this.getModel();
  return model.patch(patches);
};


/**
 * Return data from UI values. Return null, if invalid data present.
 * @return {?SugarCrm.Record} null if data is not valid.
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.collectData = function() {
  return this.body_panel.collectData();
};


/**
 * @protected
 * @param {ydn.crm.sugarcrm.ui.events.SettingChangeEvent} e
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.handleSettingChange = function(e) {
  this.body_panel.handleSettingChange(e);
};


/**
 * Change edit mode status.
 * @param {boolean} val <code>true</code> to edit mode, <code>false</code> to view mode.
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.setEditMode = function(val) {
  var root = this.getElement();
  if (val) {
    root.classList.add(ydn.crm.sugarcrm.ui.record.Body.CSS_CLASS_EDIT);
  } else {
    root.classList.remove(ydn.crm.sugarcrm.ui.record.Body.CSS_CLASS_EDIT);
  }

  this.body_panel.setEditMode(val);
};


/**
 * @return {boolean}
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getEditMode = function() {
  return this.getElement().classList.contains(ydn.crm.sugarcrm.ui.record.Body.CSS_CLASS_EDIT);
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.handleContentClick = function(e) {
  if (e.target.classList.contains(ydn.crm.sugarcrm.ui.field.FieldRenderer.CSS_CLASS_VALUE)) {
    var group = this.body_panel.getGroupByFieldValueElement(/** @type {Element} */ (e.target));

  }
};


/**
 * Set a message.
 * @param {string} s
 * @param {boolean=} opt_is_error
 * @return {number}
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.setMessage = function(s, opt_is_error) {
  var type = opt_is_error ? ydn.app.msg.MessageType.ERROR : ydn.app.msg.MessageType.NORMAL;
  return ydn.app.msg.Manager.addStatus(s, '', type);
};


/**
 * Get user updated record value, if edited.
 * @return {?SugarCrm.Record} null if record value is not updated.
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getUpdatedValue = function() {

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
 * @param {ydn.crm.sugarcrm.ModuleName} module_name
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.addNewItem = function(module_name) {

  /**
   * @type {ydn.crm.sugarcrm.model.Record}
   */
  var this_record = this.getModel();
  var sugar = this_record.getSugar();
  var r = new ydn.crm.sugarcrm.Record(sugar.getDomain(), module_name);
  var model = new ydn.crm.sugarcrm.model.Record(sugar, r);
  var new_panel = new ydn.crm.sugarcrm.ui.record.Record(model, this.getDomHelper(), this);
  this.secondary_panel.addChild(new_panel, true);
};


/**
 * @protected
 * @param {*} e
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.handleModuleChanged = function(e) {
  if (ydn.crm.sugarcrm.ui.record.Record.DEBUG) {
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
ydn.crm.sugarcrm.ui.record.Record.prototype.handleRecordChanged = function(e) {
  if (ydn.crm.sugarcrm.ui.record.Record.DEBUG) {
    window.console.log('Record:handleRecordChanged:');
  }
  this.reset();
};


/**
 * @protected
 * @param {*} e
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.handleRecordUpdated = function(e) {
  if (ydn.crm.sugarcrm.ui.record.Record.DEBUG) {
    window.console.log(e.type, e);
  }
  this.refresh();
};


/**
 * Reset UI when record ID or user setting changed.
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.reset = function() {
  var model = this.getModel();
  if (ydn.crm.sugarcrm.ui.record.Record.DEBUG) {
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
ydn.crm.sugarcrm.ui.record.Record.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
};


/**
 * Refresh UI when record is updated.
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.refresh = function() {
  var model = this.getModel();
  if (ydn.crm.sugarcrm.ui.record.Record.DEBUG) {
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
ydn.crm.sugarcrm.ui.record.Record.prototype.simulateEdit = function(user_patch,
    opt_dispatch_event) {
  if (!user_patch) {
    return;
  }
  this.body_panel.simulateEdit(user_patch);
  if (opt_dispatch_event) {
    var patch = this.collectData();
    var ev = new ydn.crm.sugarcrm.ui.events.ChangedEvent(patch, this);
    this.dispatchEvent(ev);
  }
};


if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugarcrm.ui.record.Record.prototype.toString = function() {
    return 'ydn.crm.sugarcrm.ui.record.Record:' + this.getModel();
  };
}


/**
 * Render new record creation UI for given module.
 * @param {ydn.crm.sugarcrm.ModuleName} m_name
 * @param {boolean=} opt_duplicate duplicate existing record data.
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.newRecord = function(m_name, opt_duplicate) {
  if (ydn.crm.sugarcrm.ui.record.Record.DEBUG) {
    window.console.log('new record prepare for ' + m_name);
  }

  var model = this.getModel();
  var patches = null;
  if (opt_duplicate) {
    patches = model.cloneData();
    delete patches.id;
    delete patches._module;
    delete patches.date_entered;
    delete patches.date_modified;
  }
  var r = new ydn.crm.sugarcrm.Record(model.getDomain(), m_name);
  // var r = new ydn.crm.sugarcrm.Record(sugar.getDomain(), m_name, patches);
  // NOTE: we don't modify model for UI edit, but simulate user edit bellow.
  model.setRecord(r);
  if (patches) {
    this.simulateEdit(patches);
  }

  this.setEditMode(true);
};


/**
 * @param {ydn.crm.sugarcrm.ui.events.NewRecord} e
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.onNewRecord = function(e) {
  this.newRecord(e.module_name);
};


/**
 * @enum {string}
 */
ydn.crm.sugarcrm.ui.record.Record.MenuName = {
  DUPLICATE: 'duplicate',
  NEW: 'new',
  UNSYNC: 'unsync',
  DETAILS: 'record-detail',
  FIELDS_OPTION: 'field-option'
};


/**
 * @return {boolean}
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getRecordEditable = function() {
  return true;
};


/**
 * @return {Array.<ydn.crm.sugarcrm.ModuleName>}
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getNewModuleList = function() {
  return [];
};


/**
 * @return {Array.<ydn.crm.sugarcrm.ModuleName>}
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getDuplicateModuleList = function() {
  return [];
};


/**
 * @return {Array.<?ydn.ui.FlyoutMenu.ItemOption>}
 * @protected
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.getMenuItems = function() {
  var record = this.getModel();
  var m_name = record.getModuleName();
  var items = [];
  if (this.getRecordEditable()) {
    items.push({
      name: 'edit',
      label: 'Edit'
    }, null);
  }
  var new_list = this.getNewModuleList();
  if (new_list.length > 0) {
    var new_items = [];
    for (var i = 0; i < new_list.length; i++) {
      new_items[i] = {
        name: ydn.crm.sugarcrm.ui.record.Record.MenuName.NEW + '-' + new_list[i],
        label: new_list[i]
      };
    }
    items.push({
      name: ydn.crm.sugarcrm.ui.record.Record.MenuName.NEW,
      label: 'New',
      children: new_items
    });
  }
  var dup_list = this.getDuplicateModuleList();
  if (dup_list.length > 0) {
    var dup_items = [];
    for (var i = 0; i < dup_list.length; i++) {
      dup_items[i] = {
        name: ydn.crm.sugarcrm.ui.record.Record.MenuName.DUPLICATE + '-' + dup_list[i],
        label: dup_list[i]
      };
    }
    items.push({
      name: ydn.crm.sugarcrm.ui.record.Record.MenuName.DUPLICATE,
      label: 'Duplicate to',
      children: dup_items
    });
  }
  if (new_list.length > 0 || dup_list.length > 0) {
    items.push(null);
  }

  items.push({
    name: ydn.crm.sugarcrm.ui.record.Record.MenuName.DETAILS,
    label: 'View details ...'
  }, {
    name: ydn.crm.sugarcrm.ui.record.Record.MenuName.FIELDS_OPTION,
    label: 'Fields ...'
  });

  // how to add sync and export to menu here?

  return items;
};


/**
 * Remove sync link from Gmail contact.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.removeSync = function() {
  var sugar = this.getModel();
  if (sugar instanceof ydn.crm.sugarcrm.model.GDataSugar) {
    var gdata = sugar.getGData();
    if (!gdata) {
      return goog.async.Deferred.fail('No Gmail contact exist to remove the link.');
    }

    var gid = gdata.getSingleId();
    var mid = ydn.app.msg.Manager.addStatus('Removing link from Gmail contact ' +
        gid);
    return sugar.unlinkGDataToRecord().addCallbacks(function() {
      ydn.app.msg.Manager.setStatus(mid, 'Removed link from ' + gid);
    }, function(e) {
      window.console.error(e.stack || e);
      ydn.app.msg.Manager.setStatus(mid, 'Removing link failed ' + (e.message || '.'),
          ydn.app.msg.MessageType.ERROR);
    });
  } else {
    var msg = '';
    if (goog.DEBUG) {
      msg = 'Sync service not available in this model.';
    }
    throw new Error(msg);
  }
};


/**
 * Reset header.
 * Record type, record id may change.
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.resetHeader = function() {
  var ele_header = this.getHeaderElement();
  var record = this.getModel();
  var dom = this.getDomHelper();
  var m_name = record.getModuleName();
  if (ydn.crm.sugarcrm.ui.record.Record.DEBUG) {
    window.console.log('resetHeader' + m_name + ':' + record);
  }
  var badge = ele_header.querySelector('span.' +
          ydn.crm.sugarcrm.ui.record.HeaderRenderer.CSS_CLASS_ICON);
  badge.textContent = ydn.crm.sugarcrm.toModuleSymbol(m_name);

  this.head_menu.setItems(this.getMenuItems());

  var ok = ele_header.querySelector('.' + ydn.crm.ui.CSS_CLASS_OK_BUTTON);
  goog.style.setElementShown(ok, false);
};


/**
 * Refresh header.
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.refreshHeader = function() {

  var ele_header = this.getHeaderElement();
  var record = this.getModel();
  var m_name = record.getModuleName();
  if (ydn.crm.sugarcrm.ui.record.Record.DEBUG) {
    window.console.log('refreshHeader:' + m_name + ':' + record);
  }
  var ele_title = ele_header.querySelector('a.' + ydn.crm.sugarcrm.ui.record.HeaderRenderer.CSS_CLASS_TITLE);
  if (record.hasRecord()) {
    ele_title.textContent = record.getLabel();
    ele_title.href = record.getViewLink();
    ele_title.target = record.getDomain();
    this.head_menu.setEnableMenuItem('duplicate', false);
  } else {
    ele_title.innerHTML = '';
    ele_title.href = '';
    this.head_menu.setEnableMenuItem('duplicate', false);
    this.head_menu.setEnableMenuItem('duplicate', false);
  }
};


/**
 * Fill up by meta contact data.
 * @param {ydn.social.MetaContact} meta
 * @return {boolean}
 */
ydn.crm.sugarcrm.ui.record.Record.prototype.fillByMetaContact = function(meta) {
  var val = this.body_panel.fillByMetaContact(meta);
  if (val) {
    this.setDirty(true);
  }
  return val;
};


