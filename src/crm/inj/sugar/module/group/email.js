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
 * @fileoverview Panel for listed items.
 *
 * This module provide adding, linking and syncing.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.inj.sugar.module.group.Email');
goog.require('ydn.crm.inj.sugar.module.group.EmailRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Group');



/**
 * Panel for listed items.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.inj.sugar.module.Group}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @implements {ydn.crm.ui.Refreshable}
 */
ydn.crm.inj.sugar.module.group.Email = function(model, opt_dom) {
  var renderer = ydn.crm.inj.sugar.module.group.EmailRenderer.getInstance();
  goog.base(this, model, renderer, opt_dom);
};
goog.inherits(ydn.crm.inj.sugar.module.group.Email, ydn.crm.inj.sugar.module.Group);


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.group.Email.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.group.EmailRenderer.CSS_CONTENT_CLASS,
      this.getElement());
};


/**
 * refresh.
 * @param e
 */
ydn.crm.inj.sugar.module.group.Email.prototype.refresh = function(e) {
  var r = /** @type {ydn.crm.inj.sugar.module.group.EmailRenderer} */ (this.getRenderer());
  r.refresh(this);
};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.group.Email,
    ydn.crm.inj.sugar.module.group.EmailRenderer);

