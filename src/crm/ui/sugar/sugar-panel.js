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
 * @fileoverview SugarCRM panel.
 *
 * A SugarCRM panel represent a fixed sugarcrm instance, with or without valid
 * login.
 *
 * The panel will probe available sugarcrm module and its fields before
 * initializing this instance. User may have preference setting.
 *
 * This panel display on right side bar of the gmail interface in email thread
 * view. SugarCrm instance related UI are on Header and email thread dependent
 * UI are in Body panels.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.SugarPanel');
goog.require('ydn.crm.sugar.model.GDataSugar');
goog.require('ydn.crm.ui.GmailCmdInjector');
goog.require('ydn.crm.ui.gmail.Template');
goog.require('ydn.crm.ui.sugar.FeedBody');
goog.require('ydn.crm.ui.sugar.Header');
goog.require('ydn.crm.ui.sugar.SimpleSugarPanel');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.GDataSugar} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.SimpleSugarPanel}
 */
ydn.crm.ui.sugar.SugarPanel = function(model, dom) {
  goog.base(this, model, dom);

  /**
   * @type {ydn.crm.ui.GmailCmdInjector}
   * @private
   */
  this.gmail_cmd_inj_ = new ydn.crm.ui.GmailCmdInjector(model);
  this.gmail_cmd_inj_.observeEmailThreadToolbar(document.body);
};
goog.inherits(ydn.crm.ui.sugar.SugarPanel, ydn.crm.ui.sugar.SimpleSugarPanel);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.SugarPanel.DEBUG = false;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.SugarPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.dom_;
  var head_ele = this.getElement().querySelector('.' +
      ydn.crm.ui.sugar.SimpleSugarPanel.CSS_CLASS_HEAD);
  var content_ele = this.getContentElement();
  goog.style.setElementShown(content_ele, false);

  var header_panel = new ydn.crm.ui.sugar.Header(this.getModel(), dom);
  header_panel.render(head_ele);
};


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.sugar.SugarPanel.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.sugar.SugarPanel');


/**
 * Get SugarCRM record id that is related to gmail context thread.
 * @return {!Array.<{ydn.crm.sugar.ModuleName: string, id: string}>}
 */
ydn.crm.ui.sugar.SugarPanel.prototype.getContexts = function() {
  throw new Error('Not implemented');
  // var body_panel = /** @type {ydn.crm.ui.sugar.FeedBody} */ (this.getChildAt(1));
  // return body_panel.getContexts();
};
