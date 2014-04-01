/**
 * @fileoverview Panel for group of field in a module.
 *
 * Parent record panel is responsible to refresh if model has changed.
 */


goog.provide('ydn.crm.inj.sugar.module.Group');
goog.require('ydn.crm.inj.sugar.module.GroupRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Group');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {goog.ui.ControlRenderer} renderer
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Control}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @implements {ydn.crm.ui.Refreshable}
 */
ydn.crm.inj.sugar.module.Group = function(model, renderer, opt_dom) {
  goog.base(this, null, renderer, opt_dom);
  this.setHandleMouseEvents(false);
  this.setAllowTextSelection(true);
  this.setAutoStates(goog.ui.Component.State.ALL, false);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);
  this.setSupportedState(goog.ui.Component.State.SELECTED, false);
  this.setModel(model);
};
goog.inherits(ydn.crm.inj.sugar.module.Group, goog.ui.Control);


/**
 * @return {ydn.crm.sugar.model.Group}
 * @override
 */
ydn.crm.inj.sugar.module.Group.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.Group.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.GroupRenderer.CSS_CONTENT_CLASS,
      this.getElement());
};


/**
 * refresh.
 */
ydn.crm.inj.sugar.module.Group.prototype.refresh = function() {
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.ui.Refreshable} */ (this.getChildAt(i));
    child.refresh();
  }
};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.Group,
    ydn.crm.inj.sugar.module.GroupRenderer);

