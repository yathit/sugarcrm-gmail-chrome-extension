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
ydn.crm.ui.sugar.record.Head.CSS_CLASS_LINK = 'link';


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
  // This link is responsible to show 'link', 'export' or 'sync'
  var sync = dom.createDom('a', {
    'href': '#link',
    'class': ydn.crm.ui.sugar.record.Head.CSS_CLASS_LINK
  });
  var option_svg = ydn.crm.ui.createSvgIcon('tools');
  var option = dom.createDom('span', ydn.crm.ui.sugar.record.Head.CSS_CLASS_EDIT,
      option_svg);
  ele_header.appendChild(icon);
  ele_header.appendChild(title);
  ele_header.appendChild(dom.createDom('div', 'center'));
  ele_header.appendChild(sync);
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
  var hd = this.getHandler();
  var edit_ele = this.getElement().querySelector('.' + ydn.crm.ui.sugar.record.Head.CSS_CLASS_EDIT);
  hd.listen(edit_ele, goog.events.EventType.CLICK, this.handleEditClick, false);
};


/**
 * @protected
 * @param {goog.events.Event} e
 */
ydn.crm.ui.sugar.record.Head.prototype.handleLinkClick = function(e) {
  e.preventDefault();
  // link click, it could be one of 'link', 'export', 'synced' state.
  var a_link = e.target;
  if (a_link.classList.contains(ydn.crm.ui.sugar.record.Head.CSS_CLASS_SYNCED)) {
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
  var select = new goog.ui.MenuButton('Display', menu);
  toolbar.addChild(select, true);
  this.addChild(toolbar, true);
  this.getHandler().listen(menu, goog.ui.Component.EventType.ACTION, this.handleDisplayMenuAction);
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
  e.target.classList.toggle(ydn.crm.ui.CSS_CLASS_ACTIVE);
  var is_active = e.target.classList.contains(ydn.crm.ui.CSS_CLASS_ACTIVE);
  if (is_active) {
    this.showToolbar();
  } else {
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
    window.console.log('HeadRenderer:reset:' + + m_name + ':' + record);
  }
  var header = this.getHeadElement();
  var icon = goog.dom.getElementByClass(ydn.crm.ui.sugar.record.Head.CSS_CLASS_ICON,
      header);
  icon.textContent = m_name.substring(0, 2);

  if (this.getChildCount() > 0) {
    var toolbar = this.removeChildAt(0, true);
    toolbar.dispose();
  }

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
  var ele_link = this.getLinkElement();
  if (ydn.crm.ui.sugar.record.Head.DEBUG) {
    window.console.log('HeadRenderer:refresh:' + + m_name + ':' + record);
  }
  if (record.hasRecord()) {
    ele_title.textContent = record.getTitle();
    ele_title.href = record.getViewLink();
    ele_title.target = record.getDomain();
    if (record instanceof ydn.crm.sugar.model.GDataRecord) {
      var g_record = /** @type {ydn.crm.sugar.model.GDataRecord} */ (record);
      ele_link.innerHTML = '';
      if (g_record.isSynced()) {
        ele_link.classList.add(ydn.crm.ui.sugar.record.Head.CSS_CLASS_SYNCED);
        ele_link.appendChild(ydn.crm.ui.createSvgIcon('link-intact'));
        ele_link.setAttribute('title', 'Gmail contact ' + g_record.getSyncedGData().getSingleId() +
            ' is synced with SugarCRM ' + m_name + ' ' + g_record.getId());
      } else {
        ele_link.classList.remove(ydn.crm.ui.sugar.record.Head.CSS_CLASS_SYNCED);
        if (g_record.canSync()) {
          ele_link.appendChild(ydn.crm.ui.createSvgIcon('link-broken'));
          ele_link.setAttribute('title', 'Link Gmail contact ' + g_record.getGData().getSingleId() +
              ' with SugarCRM ' + m_name + ' ' + g_record.getId());
        } else {
          ele_link.appendChild(ydn.crm.ui.createSvgIcon('contact-add'));
          ele_link.setAttribute('title', 'Export SugarCRM ' + m_name + ' ' + g_record.getId() +
              ' to Gmail My Contact');
        }
      }
      goog.style.setElementShown(ele_link, true);
    } else {
      goog.style.setElementShown(ele_link, false);
    }
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
 * @return {Element}
 */
ydn.crm.ui.sugar.record.Head.prototype.getLinkElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.sugar.record.Head.CSS_CLASS_LINK);
};


/**
 * @return {?Element}
 */
ydn.crm.ui.sugar.record.Head.prototype.getToolbarElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_TOOLBAR);
};






