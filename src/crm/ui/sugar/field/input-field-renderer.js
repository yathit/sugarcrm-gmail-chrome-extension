/**
 * @fileoverview SugarCrm module field.
 */


goog.provide('ydn.crm.ui.sugar.field.InputFieldRenderer');
goog.require('ydn.crm.ui.sugar.field.FieldRenderer');



/**
 * Create a new module record field.
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.field.FieldRenderer}
 */
ydn.crm.ui.sugar.field.InputFieldRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.ui.sugar.field.InputFieldRenderer, ydn.crm.ui.sugar.field.FieldRenderer);
goog.addSingletonGetter(ydn.crm.ui.sugar.field.InputFieldRenderer);


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.field.InputFieldRenderer.prototype.createDom = function(field) {
  var el = goog.base(this, 'createDom', field);

  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var model = field.getModel();
  var dom = field.getDomHelper();

  var label = model.getLabel();
  // console.log(label, type, calculated);

  var ele_value = dom.createDom('input', {
    'type': 'text'
  });

  ele_value.classList.add(ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE);

  el.appendChild(ele_value);
  ele_value.setAttribute('title', label);
  return el;
};


/**
 * @param {Element} ele_field
 * @param {ydn.crm.sugar.model.Field?} model Element to decorate.
 */
ydn.crm.ui.sugar.field.InputFieldRenderer.prototype.refresh = function(ele_field, model) {
  goog.style.setElementShown(ele_field, !!model);
  if (!model) {
    return;
  }
  var value = model.getFieldValue();
  var is_def = goog.isString(value) ? !goog.string.isEmpty(value) :
      goog.isDefAndNotNull(value);
  // console.log(model.getFieldName() + ' ' + value);
  var ele_value = ele_field.querySelector('.' + ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE);

  ele_value.value = is_def ? value : '';

  if (is_def) {
    ele_field.classList.remove(ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_EMPTY);
  } else {
    ele_field.classList.add(ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_EMPTY);
  }
};


/**
 * Collect data.
 * @param {ydn.crm.ui.sugar.field.Field} ctrl
 * @return {*} return value of the element.
 */
ydn.crm.ui.sugar.field.InputFieldRenderer.prototype.collectValue = function(ctrl) {
  var ele = ctrl.getContentElement();
  var ele_value = ele.querySelector('.' + ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE);
  return ele_value.value;
};


