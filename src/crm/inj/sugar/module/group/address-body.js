/**
 * @fileoverview Panel for group of field in a module.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.group.AddressBody');
goog.require('ydn.crm.inj.sugar.module.Field');
goog.require('ydn.crm.inj.sugar.module.group.AddressBodyRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Group');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Container}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.group.AddressBody = function(model, opt_dom) {
  var renderer = ydn.crm.inj.sugar.module.group.AddressBodyRenderer.getInstance();
  goog.base(this, goog.ui.Container.Orientation.VERTICAL, renderer, opt_dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.inj.sugar.module.group.AddressBody, goog.ui.Container);


/**
 * @return {ydn.crm.sugar.model.Group}
 * @override
 */
ydn.crm.inj.sugar.module.group.AddressBody.prototype.getModel;


/**
 * refresh.
 */
ydn.crm.inj.sugar.module.group.AddressBody.prototype.refresh = function() {
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.inj.sugar.module.Field} */ (this.getChildAt(i));
    child.refresh();
  }
};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.group.AddressBody,
    ydn.crm.inj.sugar.module.group.AddressBodyRenderer);

