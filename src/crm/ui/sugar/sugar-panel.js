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
goog.require('goog.debug.Logger');
goog.require('goog.ui.Component');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.ui.GmailCmdInjector');
goog.require('ydn.crm.inj.sugar.Body');
goog.require('ydn.crm.ui.sugar.FeedBody');
goog.require('ydn.crm.ui.sugar.Header');
goog.require('ydn.gdata.m8.ContactEntry');
goog.require('ydn.json');



/**
 * Contact sidebar panel.
 * @param {string} gdata_account Google account id, i.e., email address
 * @param {ydn.crm.sugar.model.Sugar} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.SugarPanel = function(gdata_account, model, dom) {
  goog.base(this, dom);
  this.setModel(model);
  /**
   * @final
   * @protected
   * @type {string}
   */
  this.gdata_account = gdata_account;

  /**
   * @type {ydn.crm.ui.GmailCmdInjector}
   * @private
   */
  this.gmail_cmd_inj_ = new ydn.crm.ui.GmailCmdInjector(model);
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
ydn.crm.ui.sugar.SugarPanel.CSS_CLASS = 'sugar-panel';


/** @return {string} */
ydn.crm.ui.sugar.SugarPanel.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.SugarPanel.CSS_CLASS;
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

  var header_panel = new ydn.crm.ui.sugar.Header(dom, this.getModel());
  this.addChild(header_panel, true);

  // var body_panel = new ydn.crm.inj.sugar.Body(dom, this.getModel());
  var body_panel = new ydn.crm.ui.sugar.FeedBody(this.gdata_account, this.getModel(), dom);
  this.addChild(body_panel, true);
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
};


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.sugar.SugarPanel.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.ui.sugar.SugarPanel');


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


/**
 * Change contact model when inbox changes.
 * @param {string?} email
 * @param {string?} name
 * @param {string?} phone
 */
ydn.crm.ui.sugar.SugarPanel.prototype.update = function(email, name, phone) {
  this.logger.finer('update for ' + email);
  var body_panel = /** @type {ydn.crm.ui.sugar.FeedBody} */ (this.getChildAt(1));
  body_panel.update(email, name, phone);
};


