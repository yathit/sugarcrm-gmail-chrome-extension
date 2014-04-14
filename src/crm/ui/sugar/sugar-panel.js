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
goog.require('goog.log');
goog.require('goog.ui.Component');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.sugar.model.GDataSugar');
goog.require('ydn.crm.ui.GmailCmdInjector');
goog.require('ydn.crm.ui.gmail.Template');
goog.require('ydn.crm.ui.sugar.FeedBody');
goog.require('ydn.crm.ui.sugar.Header');
goog.require('ydn.gdata.m8.ContactEntry');
goog.require('ydn.json');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.GDataSugar} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.SugarPanel = function(model, dom) {
  goog.base(this, dom);
  this.setModel(model);

  /**
   * @type {ydn.crm.ui.GmailCmdInjector}
   * @private
   */
  this.gmail_cmd_inj_ = new ydn.crm.ui.GmailCmdInjector(model);
  this.gmail_cmd_inj_.observeEmailThreadToolbar(document.body);

  /**
   * @protected
   * @type {Array.<ydn.crm.ui.GDataPanel>}
   */
  this.module_panels = ydn.crm.sugar.PANEL_MODULES.map(function(x) {
    var m = new ydn.crm.sugar.model.GDataRecord(model, x);
    return new ydn.crm.ui.GDataPanel(m, dom);
  });
};
goog.inherits(ydn.crm.ui.sugar.SugarPanel, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.SugarPanel.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.SugarPanel.CSS_CLASS_CONTENT = 'sugar-panel-content';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.SugarPanel.CSS_CLASS = 'sugar-panel';


/** @return {string} */
ydn.crm.ui.sugar.SugarPanel.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.SugarPanel.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.SugarPanel.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.sugar.SugarPanel.CSS_CLASS_CONTENT);
};


/**
 * @return {ydn.crm.sugar.model.GDataSugar}
 * @override
 */
ydn.crm.ui.sugar.SugarPanel.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.SugarPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.dom_;
  var root = this.getElement();
  goog.dom.classes.add(root, this.getCssClass());
  var head_ele = dom.createDom('div');
  var content_ele = dom.createDom('div', ydn.crm.ui.sugar.SugarPanel.CSS_CLASS_CONTENT);
  root.appendChild(head_ele);
  root.appendChild(content_ele);
  goog.style.setElementShown(content_ele, false);

  var header_panel = new ydn.crm.ui.sugar.Header(this.getModel(), dom);
  header_panel.render(head_ele);

  for (var i = 0; i < this.module_panels.length; i++) {
    this.addChild(this.module_panels[i], true);
  }

};


/**
 * Get SugarCRM record id that is related to gmail context thread.
 * @return {!Array.<{ydn.crm.sugar.ModuleName: string, id: string}>}
 */
ydn.crm.ui.sugar.SugarPanel.prototype.getContexts = function() {
  var body_panel = /** @type {ydn.crm.ui.sugar.FeedBody} */ (this.getChildAt(1));
  return body_panel.getContexts();
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.SugarPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getModel(), [ydn.crm.sugar.model.events.Type.GDATA_CHANGE],
      this.handleOnGDataChanged);
};


/**
 * @protected
 * @param {ydn.crm.sugar.model.events.GDataEvent} e
 */
ydn.crm.ui.sugar.SugarPanel.prototype.handleOnGDataChanged = function(e) {
  var sugar = this.getModel();
  if (ydn.crm.ui.sugar.SugarPanel.DEBUG) {
    window.console.log(e, sugar.getContextGmail());
  }
  var has_context = !!sugar.getContextGmail();
  goog.style.setElementShown(this.getContentElement(), has_context);
};


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.sugar.SugarPanel.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.sugar.SugarPanel');


/**
 * @return {!ydn.msg.Channel}
 */
ydn.crm.ui.sugar.SugarPanel.prototype.getChannel = function() {
  return ydn.msg.getChannel(ydn.msg.Group.SUGAR, this.getDomainName());
};


/**
 * @return {string}
 */
ydn.crm.ui.sugar.SugarPanel.prototype.getDomainName = function() {
  return this.getModel().getDomain();
};


