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
 * @fileoverview The heading of a record panel. User input in this component
 * are handle by record instead.
 *
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.record.HeadRenderer');



/**
 * Heading panel
 * @constructor
 * @struct
 */
ydn.crm.ui.sugar.record.HeadRenderer = function() {
};
goog.addSingletonGetter(ydn.crm.ui.sugar.record.HeadRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.record.HeadRenderer.DEBUG = false;


/**
 * @const
 * @type {string} CSS class name for secondary records panel.
 */
ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS = 'record-header';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_TITLE = 'title';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_ICON = 'icon';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_SYNCED = 'synced';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_LINK = 'link';


/**
 * @const
 * @type {string} CSS class name for viewing record.
 */
ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_NEW_ITEM = 'new-item';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_ACTIVATED = 'activated';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.HeadRenderer.NAME_DETAIL = 'detail';


/**
 * @param {ydn.crm.ui.sugar.record.Record} ctrl
 */
ydn.crm.ui.sugar.record.HeadRenderer.prototype.createDom = function(ctrl) {

  var head = this.getHeadElement(ctrl.getElement());
  var dom = ctrl.getDomHelper();
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var model = ctrl.getModel();

  var m_name = model.getModuleName();
  var ele_header = dom.createDom('div');
  head.appendChild(ele_header);
  var title = dom.createDom('a', ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_TITLE);
  var icon = dom.createDom('span', ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_ICON,
      m_name.substr(0, 2));
  // This link is responsbile to show 'link', 'export' or 'sync'
  var sync = dom.createDom('a', {
    'href': '#link',
    'class': ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_LINK
  });
  ele_header.appendChild(icon);
  ele_header.appendChild(title);
  ele_header.appendChild(sync);

  // create toolbar
  var toolbar = dom.createDom('div', ydn.crm.ui.CSS_CLASS_TOOLBAR);
  toolbar.appendChild(dom.createDom('a', {
    'name': ydn.crm.sugar.ModuleName.NOTES,
    'class': ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_NEW_ITEM,
    'href': '#new-' + ydn.crm.sugar.ModuleName.NOTES
  }, 'Add Note'));
  toolbar.appendChild(dom.createDom('a', {
    'name': ydn.crm.ui.sugar.record.HeadRenderer.NAME_DETAIL,
    'href': '#detail'
  }, 'Detail'));
  // goog.style.setElementShown(ele_header, false);
  head.appendChild(ele_header);
  head.appendChild(toolbar);
};


/**
 * Reset UI for new model.
 * @param {ydn.crm.ui.sugar.record.Record} ctrl
 */
ydn.crm.ui.sugar.record.HeadRenderer.prototype.reset = function(ctrl) {
  var root = ctrl.getElement();
  var a_detail = this.getDetailButton(root);
  a_detail.textContent = 'Detail';
  goog.style.setElementShown(a_detail, true);
  var show_annotate_ui = ctrl.getModel().isPeople();
  var new_btns = ctrl.getElement().querySelectorAll('.' +
      ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_NEW_ITEM);
  for (var i = new_btns.length - 1; i >= 0; i--) {
    goog.style.setElementShown(new_btns[i], show_annotate_ui);
  }
  var record = ctrl.getModel();
  var m_name = record.getModuleName();
  if (ydn.crm.ui.sugar.record.HeadRenderer.DEBUG) {
    window.console.log('HeadRenderer:reset:' + + m_name + ':' + record);
  }
  var header = this.getHeadElement(ctrl.getElement());
  var icon = goog.dom.getElementByClass(ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_ICON,
      header);
  icon.textContent = m_name.substring(0, 2);

  // goog.style.setElementShown(this.getToolbarElement(root), !record.isSimple());
  this.refresh(ctrl);
};


/**
 * @param {ydn.crm.ui.sugar.record.Record} ctrl
 */
ydn.crm.ui.sugar.record.HeadRenderer.prototype.refresh = function(ctrl) {
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var record = ctrl.getModel();
  var m_name = record.getModuleName();
  var ele_title = this.getTitleElement(ctrl.getElement());
  var ele_link = this.getLinkElement(ctrl.getElement());
  if (ydn.crm.ui.sugar.record.HeadRenderer.DEBUG) {
    window.console.log('HeadRenderer:refresh:' + + m_name + ':' + record);
  }
  if (record.hasRecord()) {
    ele_title.textContent = record.getTitle();
    ele_title.href = record.getViewLink();
    ele_title.target = record.getDomain();
    if (record instanceof ydn.crm.sugar.model.GDataRecord) {
      var g_record = /** @type {ydn.crm.sugar.model.GDataRecord} */ (record);
      ele_link.textContent = '';
      if (g_record.isSynced()) {
        ele_link.classList.add(ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_SYNCED);
        ele_link.setAttribute('title', 'Gmail contact ' + g_record.getSyncedGData().getSingleId() +
            ' is synced with SugarCRM ' + m_name + ' ' + g_record.getId());
      } else {
        ele_link.classList.remove(ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_SYNCED);
        if (g_record.canSync()) {
          ele_link.textContent = 'link';
          ele_link.setAttribute('title', 'Link Gmail contact ' + g_record.getGData().getSingleId() +
              ' with SugarCRM ' + m_name + ' ' + g_record.getId());
        } else {
          ele_link.textContent = 'export';
          ele_link.setAttribute('title', 'Export SugarCRM ' + m_name + ' ' + g_record.getId() +
              ' to Gmail My Contact');
        }
      }
      goog.style.setElementShown(ele_link, true);
    } else {
      goog.style.setElementShown(ele_link, false);
    }
  } else {
    ele_title.textContent = '';
    ele_title.href = '';
  }
};


/**
 * @param {Element} ele ancentor
 * @return {Element}
 */
ydn.crm.ui.sugar.record.HeadRenderer.prototype.getTitleElement = function(ele) {
  return ele.querySelector('.' + ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS +
      ' .' + ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_TITLE);
};


/**
 * @param {Element} ele ancentor
 * @return {Element}
 */
ydn.crm.ui.sugar.record.HeadRenderer.prototype.getLinkElement = function(ele) {
  return ele.querySelector('.' + ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS +
      ' .' + ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_LINK);
};


/**
 * @param {Element} ele ancentor
 * @return {Element}
 */
ydn.crm.ui.sugar.record.HeadRenderer.prototype.getToolbarElement = function(ele) {
  return ele.querySelector('.' + ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS +
      ' .' + ydn.crm.ui.CSS_CLASS_TOOLBAR);
};


/**
 * Get View click control
 * @param {Element} ele ancentor
 * @return {Element}
 */
ydn.crm.ui.sugar.record.HeadRenderer.prototype.getDetailButton = function(ele) {
  return ele.querySelector('a[name=' +
      ydn.crm.ui.sugar.record.HeadRenderer.NAME_DETAIL + ']');
};


/**
 * Get list of new item elements.
 * @param {Element} ele ancentor
 * @return {NodeList}
 */
ydn.crm.ui.sugar.record.HeadRenderer.prototype.getNewButtons = function(ele) {
  return ele.querySelectorAll('a.' + ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS_NEW_ITEM);
};


/**
 * @param {Element} ele
 * @return {Element}
 */
ydn.crm.ui.sugar.record.HeadRenderer.prototype.getHeadElement = function(ele) {
  return ele.querySelector('.' + ydn.crm.ui.sugar.record.HeadRenderer.CSS_CLASS);
};



