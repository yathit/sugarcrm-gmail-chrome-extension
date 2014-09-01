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
 * @fileoverview Record header render prominently at the top of record component
 * to show for quick identification, link to sugarcrm of the referring record
 * and additional editing capability not available in the record body component.
 *
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.record.Head');
goog.require('goog.ui.CheckBoxMenuItem');
goog.require('goog.ui.ColorMenuButton');
goog.require('goog.ui.Css3ButtonRenderer');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.ToggleButton');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.decorate');
goog.require('ydn.crm.ui.sugar.events');
goog.require('ydn.crm.ui.sugar.setting.Field');



/**
 * Record header renderer.
 * @param {ydn.crm.sugar.model.Record} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.record.Head = function(model, opt_dom) {
  goog.base(this, opt_dom);
  this.setModel(model);

  /**
   * @type {boolean}
   * @private
   */
  this.head_visible_ = true;
};
goog.inherits(ydn.crm.ui.sugar.record.Head, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.record.Head.DEBUG = false;


/**
 * @const
 * @type {string} CSS class name for secondary records panel.
 */
ydn.crm.ui.sugar.record.Head.CSS_CLASS = 'record-header';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Head.CSS_CLASS_TITLE = 'title';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Head.CSS_CLASS_ICON = 'icon';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Head.CSS_CLASS_SYNCED = 'synced';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Head.CSS_CLASS_EDIT = 'edit-button';


/**
 * @const
 * @type {string} CSS class name for viewing record.
 */
ydn.crm.ui.sugar.record.Head.CSS_CLASS_NEW_ITEM = 'new-item';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Head.CSS_CLASS_ACTIVATED = 'activated';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Head.NAME_DETAIL = 'detail';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.Head.CSS_CLASS_SELECT_FIELD = 'select-field';


/**
 * @return {ydn.crm.sugar.model.Record}
 * @override
 */
ydn.crm.ui.sugar.record.Head.prototype.getModel;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.sugar.record.Head.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.sugar.record.Head');


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Head.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.getDomHelper();
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var model = this.getModel();
  var m_name = model.getModuleName();
  var ele_header = dom.createDom('div', ydn.crm.ui.CSS_CLASS_HEAD);
  var ele_content = dom.createDom('div', ydn.crm.ui.CSS_CLASS_CONTENT);

  var title = dom.createDom('a', {
    'class': ydn.crm.ui.sugar.record.Head.CSS_CLASS_TITLE,
    'title': 'Open in SugarCRM'
  });

  var icon = dom.createDom('span', ydn.crm.ui.sugar.record.Head.CSS_CLASS_ICON,
      ydn.crm.sugar.toModuleSymbol(m_name));

  var option_svg = ydn.crm.ui.createSvgIcon('pencil');
  var option = dom.createDom('div', ydn.crm.ui.sugar.record.Head.CSS_CLASS_EDIT,
      option_svg);
  option.classList.add('svg-button');

  ele_header.appendChild(icon);
  ele_header.appendChild(title);
  ele_header.appendChild(dom.createDom('div', 'center'));
  ele_header.appendChild(option);

  var root = this.getElement();
  root.classList.add(ydn.crm.ui.sugar.record.Head.CSS_CLASS);
  root.appendChild(ele_header);
  root.appendChild(ele_content);

};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Head.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  goog.style.setElementShown(this.getHeadElement(), this.head_visible_);
  var hd = this.getHandler();
  var edit_ele = this.getElement().querySelector('.' + ydn.crm.ui.sugar.record.Head.CSS_CLASS_EDIT);
  hd.listen(edit_ele, goog.events.EventType.CLICK, this.handleEditClick, false);

  // toolbar handlers are listen in showToolbar method.
};


/**
 * Show toolbar, if not renderred, it will be render.
 * @protected
 */
ydn.crm.ui.sugar.record.Head.prototype.showToolbar = function() {
  var toolbar = this.getChildAt(0);
  if (toolbar) {
    goog.style.setElementShown(this.getContentElement(), true);
    return;
  }
  toolbar = new goog.ui.Toolbar(undefined, undefined, this.getDomHelper());
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var model = this.getModel();
  var m_name = model.getModuleName();

  // new record
  var new_record = new goog.ui.Select('New');
  new_record.setTooltip('Create a new record');
  for (var i = 0; i < ydn.crm.sugar.CacheModules.length; i++) {
    var name = ydn.crm.sugar.CacheModules[i];
    var item = new goog.ui.Option(name);
    new_record.addItem(item);
  }
  toolbar.addChild(new_record, true);

  // field selection
  var menu = new goog.ui.Menu();
  var module_info = model.getModuleInfo();
  var groups = [];
  var other_group = null;
  for (var name in module_info.module_fields) {
    var field = module_info.module_fields[name];
    var group = field.group;
    var setting_model = new ydn.crm.ui.sugar.setting.Field(field);
    if (group) {
      if (groups.indexOf(group) == -1) {
        groups.push(group);
        setting_model = new ydn.crm.ui.sugar.setting.Group(group);
      } else {
        continue;
      }
    }
    var field_item = new goog.ui.CheckBoxMenuItem(setting_model.getLabel(), setting_model);
    field_item.setChecked(!setting_model.getNormallyHide());
    if (group) {
      menu.addChild(field_item, true);
    } else {
      if (!other_group) {
        other_group = new goog.ui.SubMenu('Others');
      }
      other_group.addItem(field_item);
    }
  }
  if (other_group) {
    menu.addChild(new goog.ui.MenuSeparator(), true);
    menu.addChild(other_group, true);
  }
  var display = new goog.ui.MenuButton('Display', menu);
  display.setTooltip('Show or hide record field');
  toolbar.addChild(display, true);

  var save_btn = new goog.ui.CustomButton('Save',
      goog.ui.Css3ButtonRenderer.getInstance());
  save_btn.setEnabled(false);
  toolbar.addChild(save_btn, true);

  this.addChild(toolbar, true);
  this.getHandler().listen(menu, goog.ui.Component.EventType.ACTION, this.handleDisplayMenuAction);
  this.getHandler().listen(save_btn, goog.ui.Component.EventType.ACTION, this.onSave);
  this.getHandler().listen(new_record, goog.ui.Component.EventType.CHANGE, this.onNewRecordSelect);
};


/**
 * @param {goog.events.Event} e
 */
ydn.crm.ui.sugar.record.Head.prototype.onSave = function(e) {
  this.dispatchEvent(ydn.crm.ui.sugar.events.Type.SAVE);
};


/**
 * @param {goog.events.Event} e
 */
ydn.crm.ui.sugar.record.Head.prototype.handleDisplayMenuAction = function(e) {

  if (e.target instanceof goog.ui.CheckBoxMenuItem) {
    var item = /** @type {goog.ui.CheckBoxMenuItem} */ (e.target);
    var model = /** @type {!ydn.crm.ui.sugar.setting.Setting} */ (item.getModel());
    var old_val = model.getNormallyHide();
    var new_val = !old_val;
    model.setNormallyHide(new_val);
    var sce = new ydn.crm.ui.sugar.events.SettingChangeEvent(model,
        ydn.crm.ui.UserSetting.SugarCrmSettingUnitKey.NORMALLY_HIDE, new_val);
    this.dispatchEvent(sce);
    if (ydn.crm.ui.sugar.record.Head.DEBUG) {
      window.console.log('action', model, new_val);
    }
    e.preventDefault();
    e.stopPropagation();
  }
};


/**
 * Change edit mode.
 * @param {goog.events.Event} e
 */
ydn.crm.ui.sugar.record.Head.prototype.handleEditClick = function(e) {
  var btn = e.currentTarget;
  var is_active = btn.classList.contains(ydn.crm.ui.CSS_CLASS_ACTIVE);
  this.dispatchEvent(new ydn.crm.ui.sugar.events.EditEvent(!is_active));
};


/**
 * Change edit mode.
 * @param {boolean} val
 */
ydn.crm.ui.sugar.record.Head.prototype.setEditMode = function(val) {
  var btn = this.getElement().querySelector('.' + ydn.crm.ui.sugar.record.Head.CSS_CLASS_EDIT);
  if (val) {
    btn.classList.add(ydn.crm.ui.CSS_CLASS_ACTIVE);
    this.showToolbar();
  } else {
    btn.classList.remove(ydn.crm.ui.CSS_CLASS_ACTIVE);
    goog.style.setElementShown(this.getContentElement(), false);
  }
};


/**
 * Reset UI for new model.
 */
ydn.crm.ui.sugar.record.Head.prototype.reset = function() {
  var root = this.getElement();
  var show_annotate_ui = this.getModel().isPeople();
  var new_btns = this.getElement().querySelectorAll('.' +
      ydn.crm.ui.sugar.record.Head.CSS_CLASS_NEW_ITEM);
  for (var i = new_btns.length - 1; i >= 0; i--) {
    goog.style.setElementShown(new_btns[i], show_annotate_ui);
  }
  var record = this.getModel();
  var m_name = record.getModuleName();
  if (ydn.crm.ui.sugar.record.Head.DEBUG) {
    window.console.log('HeadRenderer:reset:' + m_name + ':' + record);
  }
  var header = this.getHeadElement();
  var icon = goog.dom.getElementByClass(ydn.crm.ui.sugar.record.Head.CSS_CLASS_ICON,
      header);
  icon.textContent = m_name.substring(0, 2);

  var toolbar = this.getToolbar();
  if (toolbar) {
    var menu = toolbar.removeChildAt(0, true);
    var save_btn = toolbar.removeChildAt(1, true);
    this.getHandler().unlisten(menu, goog.ui.Component.EventType.ACTION, this.handleDisplayMenuAction);
    this.getHandler().unlisten(save_btn, goog.ui.Component.EventType.ACTION, this.onSave);
    menu.dispose();
    save_btn.dispose();
  }

  goog.style.setElementShown(header, this.head_visible_);

  // goog.style.setElementShown(this.getToolbarElement(root), !record.isSimple());
  this.refresh();
};


/**
 */
ydn.crm.ui.sugar.record.Head.prototype.refresh = function() {
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var record = this.getModel();
  var m_name = record.getModuleName();
  var ele_title = this.getTitleElement();
  if (ydn.crm.ui.sugar.record.Head.DEBUG) {
    window.console.log('HeadRenderer:refresh:' + m_name + ':' + record);
  }
  if (record.hasRecord()) {
    ele_title.textContent = record.getLabel();
    ele_title.href = record.getViewLink();
    ele_title.target = record.getDomain();
  } else {
    ele_title.innerHTML = '';
    ele_title.href = '';
  }
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.record.Head.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_CONTENT);
};


/**
 * @return {Element}
 */
ydn.crm.ui.sugar.record.Head.prototype.getHeadElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_HEAD);
};


/**
 * @return {Element}
 */
ydn.crm.ui.sugar.record.Head.prototype.getTitleElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.sugar.record.Head.CSS_CLASS_TITLE);
};


/**
 * @return {?goog.ui.Toolbar}
 */
ydn.crm.ui.sugar.record.Head.prototype.getToolbar = function() {
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = this.getChildAt(i);
    if (child instanceof goog.ui.Toolbar) {
      return child;
    }
  }
  return null;
};


/**
 * @return {?goog.ui.Button}
 */
ydn.crm.ui.sugar.record.Head.prototype.getSaveButton = function() {
  var toolbar = this.getToolbar();
  if (!toolbar) {
    return null;
  }
  return /** @type {goog.ui.Button} */ (toolbar.getChildAt(2));
};


/**
 * @param {boolean} val
 */
ydn.crm.ui.sugar.record.Head.prototype.setHeadVisible = function(val) {
  this.head_visible_ = !!val;
  if (this.isInDocument()) {
    goog.style.setElementShown(this.getHeadElement(), this.head_visible_);
  }
};


/**
 * Set record content dirty so that save button is enable.
 * @param {boolean} val
 */
ydn.crm.ui.sugar.record.Head.prototype.setDirty = function(val) {
  var save_btn = this.getSaveButton();
  if (save_btn) {
    save_btn.setEnabled(val);
  } else if (ydn.crm.ui.sugar.record.Head.DEBUG) {
    window.console.warn('No toolbar to set dirty');
  }
};


/**
 * @return {goog.ui.Select}
 */
ydn.crm.ui.sugar.record.Head.prototype.getNewRecord = function() {
  var toolbar = this.getToolbar();
  goog.asserts.assert(toolbar, 'Toolbar not ready');
  return /** @type {goog.ui.Select} */ (toolbar.getChildAt(0));
};


/**
 * @protected
 * @param {goog.events.Event} e
 */
ydn.crm.ui.sugar.record.Head.prototype.onNewRecordSelect = function(e) {
  var select = this.getNewRecord();
  var m_name = /** @type {ydn.crm.sugar.ModuleName} */ (select.getValue());
  this.dispatchEvent(new ydn.crm.ui.sugar.events.NewRecord(m_name));
};


