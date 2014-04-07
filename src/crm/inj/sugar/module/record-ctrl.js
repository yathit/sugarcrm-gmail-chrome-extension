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
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This is container for group panel and has some controls to viewing and editing.
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.inj.sugar.module.RecordCtrl');
goog.require('goog.ui.Control');
goog.require('ydn.crm.inj.sugar.module.Field');
goog.require('ydn.crm.inj.sugar.module.RecordCtrlRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Sugar');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Record} model
 * @param {goog.ui.ControlRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Control}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @implements {ydn.crm.ui.Refreshable}
 */
ydn.crm.inj.sugar.module.RecordCtrl = function(model, opt_renderer, opt_dom) {
  var renderer = opt_renderer || ydn.crm.inj.sugar.module.RecordCtrlRenderer.getInstance(); // needed?
  goog.base(this, null, renderer, opt_dom);
  this.setHandleMouseEvents(false);
  this.setAllowTextSelection(true);
  this.setAutoStates(goog.ui.Component.State.ALL, false);
  goog.asserts.assert(model);
  this.setModel(model);
};
goog.inherits(ydn.crm.inj.sugar.module.RecordCtrl, goog.ui.Control);


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordCtrl.NEW_RECORD_EVENT = 'new-record';


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.module.RecordCtrl.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.sugar.module.RecordCtrl');


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.RecordCtrl.DEBUG = false;


/**
 * @return {ydn.crm.inj.sugar.module.RecordCtrlRenderer}
 * @override
 */
ydn.crm.inj.sugar.module.RecordCtrl.prototype.getRenderer;


/**
 * @return {ydn.crm.sugar.model.Record}
 * @override
 */
ydn.crm.inj.sugar.module.RecordCtrl.prototype.getModel;


/**
 * @override
 */
ydn.crm.inj.sugar.module.RecordCtrl.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_CONTENT,
      this.getElement());
};


/**
 * Update model. Module may change.
 * @param {ydn.crm.sugar.Record} r
 */
ydn.crm.inj.sugar.module.RecordCtrl.prototype.updateModel = function(r) {

};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.RecordCtrl.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  var model = this.getModel();
  if (model) {
    hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, this.refresh);
  }
  var renderer = /** @type {ydn.crm.inj.sugar.module.RecordCtrlRenderer} */ (this.getRenderer());
  hd.listen(renderer.getDetailButton(this.getElement()), 'click', this.toggleDetail, false);
};


/**
 * Toggle show/hide panel.
 * @param {Event} e
 */
ydn.crm.inj.sugar.module.RecordCtrl.prototype.toggleDetail = function(e) {
  e.preventDefault();
  // console.log('toggle', e.target);
  var renderer = /** @type {ydn.crm.inj.sugar.module.RecordCtrlRenderer} */ (this.getRenderer());
  renderer.toggleDetail(this.getElement());
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.RecordCtrl.prototype.refresh = function(e) {
  var model = this.getModel();
  var root = this.getElement();
  var renderer = this.getRenderer();
  var record = model.getRecord();
  if (ydn.crm.inj.sugar.module.RecordCtrl.DEBUG) {
    window.console.log('module body ' + model.getModuleName() + ' refresh for ' + e.type, record);
  }
  if (record) {
    goog.style.setElementShown(root, true);
  } else {
    goog.style.setElementShown(root, false);
    return;
  }

  if (e && e.type == ydn.crm.sugar.model.events.Type.RECORD_CHANGE) {
    renderer.reset(this);
  }

  for (var i = 0; i < this.getChildCount(); i++) {
    var child = this.getChildAt(i);
    if (child instanceof ydn.crm.inj.sugar.module.Group) {
      var g = /** @type {ydn.crm.inj.sugar.module.Group} */ (child);
      g.refresh();
    }
  }

};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.RecordCtrl,
    ydn.crm.inj.sugar.module.RecordCtrlRenderer);

