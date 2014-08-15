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
 * @fileoverview The heading of a record panel.
 *
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.record.FooterRenderer');



/**
 * Heading panel
 * @constructor
 * @struct
 */
ydn.crm.ui.sugar.record.FooterRenderer = function() {
};
goog.addSingletonGetter(ydn.crm.ui.sugar.record.FooterRenderer);


/**
 * @const
 * @type {string} CSS class name for secondary records panel.
 */
ydn.crm.ui.sugar.record.FooterRenderer.CSS_CLASS = 'record-footer';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.record.FooterRenderer.CSS_CLASS_MESSAGE = 'message';


/**
 * @param {ydn.crm.ui.sugar.record.Record} ctrl
 */
ydn.crm.ui.sugar.record.FooterRenderer.prototype.createDom = function(ctrl) {
  var dom = ctrl.getDomHelper();
  var ele = this.getFooterElement(ctrl.getElement());

  var msg = dom.createDom('div', ydn.crm.ui.sugar.record.FooterRenderer.CSS_CLASS_MESSAGE);

  ele.appendChild(msg);
};


/**
 * @param {Element} ele
 * @return {Element}
 */
ydn.crm.ui.sugar.record.FooterRenderer.prototype.getFooterElement = function(ele) {
  return ele.querySelector('.' + ydn.crm.ui.sugar.record.FooterRenderer.CSS_CLASS);
};


/**
 * Get View click control
 * @param {Element} ele
 * @return {Element}
 */
ydn.crm.ui.sugar.record.FooterRenderer.prototype.getMsgElement = function(ele) {
  return ele.querySelector(
      '.' + ydn.crm.ui.sugar.record.FooterRenderer.CSS_CLASS + ' div.' +
          ydn.crm.ui.sugar.record.FooterRenderer.CSS_CLASS_MESSAGE + '');
};


/**
 * Reset UI for new model.
 * @param {ydn.crm.ui.sugar.record.Record} ctrl
 */
ydn.crm.ui.sugar.record.FooterRenderer.prototype.reset = function(ctrl) {
  var msg = this.getMsgElement(ctrl.getElement());
  msg.textContent = '';
  msg.classList.remove(ydn.crm.ui.CSS_CLASS_ERROR);
};

