/**
 * @fileoverview Panel for group of field in a module.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.group.Address');
goog.require('ydn.crm.inj.sugar.module.group.AddressBody');
goog.require('ydn.crm.inj.sugar.module.group.AddressRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Group');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.inj.sugar.module.Group}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.group.Address = function(model, opt_dom) {
  var renderer = new ydn.crm.inj.sugar.module.group.AddressRenderer();
  goog.base(this, model, renderer, opt_dom);
};
goog.inherits(ydn.crm.inj.sugar.module.group.Address, ydn.crm.inj.sugar.module.Group);


/**
 * refresh.
 */
ydn.crm.inj.sugar.module.group.Address.prototype.refresh = function() {
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.inj.sugar.module.group.AddressBody} */ (this.getChildAt(i));
    child.refresh();
  }
};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.group.Address,
    ydn.crm.inj.sugar.module.group.AddressRenderer);

