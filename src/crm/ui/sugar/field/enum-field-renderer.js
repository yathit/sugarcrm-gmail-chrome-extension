/**
 * @fileoverview SugarCrm module field.
 */


goog.provide('ydn.crm.ui.sugar.field.EnumFieldRenderer');
goog.require('ydn.crm.ui.sugar.field.InputFieldRenderer');



/**
 * Create a new module record field.
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.field.InputFieldRenderer}
 */
ydn.crm.ui.sugar.field.EnumFieldRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.ui.sugar.field.EnumFieldRenderer, ydn.crm.ui.sugar.field.InputFieldRenderer);
goog.addSingletonGetter(ydn.crm.ui.sugar.field.EnumFieldRenderer);


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.field.EnumFieldRenderer.prototype.createDom = function(field) {
  var el = goog.base(this, 'createDom', field);
  var model = field.getModel();
  var ele_value = el.querySelector('.' + ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE);
  ele_value.classList.add('enum');
  ele_value.setAttribute('list', ydn.crm.ui.sugar.field.FieldRenderer.getDataList(model));
  return el;
};


