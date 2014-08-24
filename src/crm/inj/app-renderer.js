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
 * @fileoverview Main application renderer depending on type of context panel
 * location.
 *
 * FIXME: winky implementation.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.inj.AppRenderer');
goog.require('goog.Disposable');
goog.require('ydn.crm.ui.AppStatusBar');
goog.require('ydn.crm.ui.StatusBar');



/**
 * Base main application renderer;
 * @param {Element=} opt_root_ele
 * @constructor
 * @struct
 */
ydn.crm.inj.AppRenderer = function(opt_root_ele) {
  this.ele_root = opt_root_ele || this.createDom();

  /**
   * @type {boolean}
   * @private
   */
  this.has_attached_ = false;
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.AppRenderer.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.AppRenderer.prototype.logger = goog.log.getLogger('ydn.crm.inj.AppRenderer');


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.AppRenderer.ID_ROOT_ELE = 'root-panel';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.AppRenderer.CSS_CLASS_STICKY_RIGHT = 'sticky-right';


/**
 * @const
 * @type {string} class name for this app.
 */
ydn.crm.inj.AppRenderer.CSS_CLASS = 'inj';


/**
 * @const
 * @type {string} class name for this app.
 */
ydn.crm.inj.AppRenderer.CSS_CLASS_CONTAINER = 'container';


/**
 * @return {Element}
 */
ydn.crm.inj.AppRenderer.prototype.createDom = function() {
  /**
   * Root element.
   * @type {Element}
   * @protected
   */
  var ele_root = document.createElement('div');
  ele_root.id = ydn.crm.inj.AppRenderer.ID_ROOT_ELE;
  ele_root.className = ydn.crm.inj.AppRenderer.CSS_CLASS + ' ' + ydn.crm.ui.CSS_CLASS;
  // temporarily attached to document.
  document.body.appendChild(ele_root);
  goog.style.setElementShown(ele_root, false);
  var container = document.createElement('div');
  container.className = ydn.crm.inj.AppRenderer.CSS_CLASS_CONTAINER;
  ele_root.appendChild(container);
  for (var i = 0; i < 3; i++) {
    var ele = document.createElement('div');
    container.appendChild(ele);
  }

  // header
  var header = document.createElement('div');
  var a = document.createElement('a');
  a.textContent = 'Setup';
  a.href = chrome.extension.getURL(ydn.crm.base.SETUP_PAGE);
  a.className = 'setup-link';
  header.appendChild(a);
  ele_root.firstElementChild.appendChild(header);
  goog.style.setElementShown(header, false);

  var status_bar = new ydn.crm.ui.AppStatusBar();
  ydn.crm.ui.StatusBar.instance = status_bar;
  status_bar.render(ele_root.lastElementChild);
  return ele_root;
};


/**
 * Set user info.
 * @param {ydn.crm.ui.UserSetting} user
 */
ydn.crm.inj.AppRenderer.prototype.setUserSetting = function(user) {
  var header = this.getHeaderElement();
  if (user && user.hasValidLogin()) {
    goog.style.setElementShown(header, false);
  } else {
    // show header link to login.
    goog.style.setElementShown(header, true);
  }
};


/**
 * @return {Element}
 */
ydn.crm.inj.AppRenderer.prototype.getElement = function() {
  return this.ele_root;
};


/**
 * @return {Element}
 */
ydn.crm.inj.AppRenderer.prototype.getHeaderElement = function() {
  return this.ele_root.firstElementChild.children[0];
};


/**
 * @return {Element}
 */
ydn.crm.inj.AppRenderer.prototype.getContentElement = function() {
  return this.ele_root.firstElementChild.children[1];
};


/**
 * @return {Element}
 */
ydn.crm.inj.AppRenderer.prototype.getFooterElement = function() {
  return this.ele_root.firstElementChild.children[2];
};


/**
 * Attach the root panel to relevant location.
 */
ydn.crm.inj.AppRenderer.prototype.attach = function() {
  // it is OK to call render repeatedly.
  this.has_attached_ = true;
};


/**
 * Detach.
 */
ydn.crm.inj.AppRenderer.prototype.detach = function() {
  this.has_attached_ = false;
};


/**
 * Attach to Gmail right side bar.
 * @param {HTMLTableElement} contact_table right bar table
 */
ydn.crm.inj.AppRenderer.prototype.attachToGmailRightBar = function(contact_table) {

};


/**
 * @return {boolean}
 */
ydn.crm.inj.AppRenderer.prototype.isAttached = function() {
  return this.has_attached_;
};

