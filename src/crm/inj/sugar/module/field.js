/**
 * @fileoverview SugarCrm module field.
 */


goog.provide('ydn.crm.inj.sugar.module.Field');
goog.require('goog.ui.Control');
goog.require('ydn.crm.inj.sugar.module.FieldRenderer');



/**
 * Create a new module record field.
 * @param {ydn.crm.sugar.model.Field} info
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @extends {goog.ui.Control}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.Field = function(info, opt_renderer, opt_domHelper) {
  goog.base(this, null, opt_renderer, opt_domHelper);
  this.setModel(info);
};
goog.inherits(ydn.crm.inj.sugar.module.Field, goog.ui.Control);


/**
 * @return {ydn.crm.sugar.model.Field}
 * @override
 */
ydn.crm.inj.sugar.module.Field.prototype.getModel;


/**
 * @return {string}
 */
ydn.crm.inj.sugar.module.Field.prototype.getFieldName = function() {
  return this.getModel().getFieldName();
};


goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.Field,
    ydn.crm.inj.sugar.module.FieldRenderer);


/**
 * Refresh UI for model changes.
 */
ydn.crm.inj.sugar.module.Field.prototype.refresh = function() {
  var renderer = /** @type {ydn.crm.inj.sugar.module.FieldRenderer} */ (this.getRenderer());
  renderer.refresh(this.getElement(), this.getModel());
};



goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.Field,
    ydn.crm.inj.sugar.module.FieldRenderer);

