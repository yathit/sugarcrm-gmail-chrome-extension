/**
 * @fileoverview Panel for group of field in a module.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.GroupBody');
goog.require('ydn.crm.inj.sugar.module.Field');
goog.require('ydn.crm.inj.sugar.module.GroupBodyRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Group');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {ydn.crm.inj.sugar.module.GroupBodyRenderer} renderer
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Container}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.GroupBody = function(model, renderer, opt_dom) {
  goog.base(this, goog.ui.Container.Orientation.VERTICAL, renderer, opt_dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.inj.sugar.module.GroupBody, goog.ui.Container);


/**
 * @return {ydn.crm.sugar.model.Group}
 * @override
 */
ydn.crm.inj.sugar.module.GroupBody.prototype.getModel;


/**
 * refresh.
 */
ydn.crm.inj.sugar.module.GroupBody.prototype.refresh = function() {
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.inj.sugar.module.Field} */ (this.getChildAt(i));
    child.refresh();
  }
};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.GroupBody,
    ydn.crm.inj.sugar.module.GroupBodyRenderer);

