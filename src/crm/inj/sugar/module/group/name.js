/**
 * @fileoverview Panel for name group fields.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.group.Name');
goog.require('ydn.crm.inj.sugar.module.group.NameRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Group');



/**
 * Panel for name group fields.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.inj.sugar.module.Group}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @implements {ydn.crm.ui.Refreshable}
 */
ydn.crm.inj.sugar.module.group.Name = function(model, opt_dom) {
  var renderer = ydn.crm.inj.sugar.module.group.NameRenderer.getInstance();
  goog.base(this, model, renderer, opt_dom);
};
goog.inherits(ydn.crm.inj.sugar.module.group.Name, ydn.crm.inj.sugar.module.Group);


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.group.Name.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.group.NameRenderer.CSS_CONTENT_CLASS,
      this.getElement());
};


/**
 * refresh.
 */
ydn.crm.inj.sugar.module.group.Name.prototype.refresh = function() {

  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.ui.Refreshable} */ (this.getChildAt(i));
    child.refresh();
  }
};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.group.Name,
    ydn.crm.inj.sugar.module.group.NameRenderer);

