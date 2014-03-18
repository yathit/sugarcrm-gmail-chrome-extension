/**
 * @fileoverview Panel for listed items.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.group.List');
goog.require('ydn.crm.inj.sugar.module.group.ListRenderer');
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
ydn.crm.inj.sugar.module.group.List = function(model, opt_dom) {
  var renderer = ydn.crm.inj.sugar.module.group.ListRenderer.getInstance();
  goog.base(this, model, renderer, opt_dom);
};
goog.inherits(ydn.crm.inj.sugar.module.group.List, ydn.crm.inj.sugar.module.Group);


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.group.List.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.group.ListRenderer.CSS_CONTENT_CLASS,
      this.getElement());
};


/**
 * refresh.
 */
ydn.crm.inj.sugar.module.group.List.prototype.refresh = function() {

  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.ui.Refreshable} */ (this.getChildAt(i));
    child.refresh();
  }
};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.group.List,
    ydn.crm.inj.sugar.module.group.ListRenderer);

