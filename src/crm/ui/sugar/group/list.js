/**
 * @fileoverview Panel for listed items.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.List');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Group');
goog.require('ydn.crm.ui.sugar.group.Group');
goog.require('ydn.crm.ui.sugar.group.ListRenderer');



/**
 * Panel for listed items.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.Group}
 */
ydn.crm.ui.sugar.group.List = function(model, opt_dom) {
  var renderer = ydn.crm.ui.sugar.group.ListRenderer.getInstance();
  goog.base(this, model, renderer, opt_dom);
};
goog.inherits(ydn.crm.ui.sugar.group.List, ydn.crm.ui.sugar.group.Group);


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.List.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.ui.sugar.group.ListRenderer.CSS_CONTENT_CLASS,
      this.getElement());
};


/**
 * refresh.
 */
ydn.crm.ui.sugar.group.List.prototype.refresh = function() {

  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.ui.Refreshable} */ (this.getChildAt(i));
    child.refresh();
  }
};


