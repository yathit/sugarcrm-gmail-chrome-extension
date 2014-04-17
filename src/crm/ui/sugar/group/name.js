/**
 * @fileoverview Panel for name group fields.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.Name');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Group');
goog.require('ydn.crm.ui.sugar.group.Group');
goog.require('ydn.crm.ui.sugar.group.NameRenderer');



/**
 * Panel for name group fields.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.Group}
 */
ydn.crm.ui.sugar.group.Name = function(model, opt_dom) {
  var renderer = ydn.crm.ui.sugar.group.NameRenderer.getInstance();
  goog.base(this, model, renderer, opt_dom);
};
goog.inherits(ydn.crm.ui.sugar.group.Name, ydn.crm.ui.sugar.group.Group);


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Name.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.ui.sugar.group.NameRenderer.CSS_CONTENT_CLASS,
      this.getElement());
};


/**
 * refresh.
 */
ydn.crm.ui.sugar.group.Name.prototype.refresh = function() {

  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.ui.Refreshable} */ (this.getChildAt(i));
    child.refresh();
  }
};


