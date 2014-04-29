/**
 * @fileoverview SugarCrm module field.
 */


goog.provide('ydn.crm.ui.sugar.field.CheckboxFieldRenderer');
goog.require('ydn.crm.ui.sugar.field.FieldRenderer');



/**
 * Create a new module record field.
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.field.FieldRenderer}
 */
ydn.crm.ui.sugar.field.CheckboxFieldRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.ui.sugar.field.CheckboxFieldRenderer, ydn.crm.ui.sugar.field.FieldRenderer);
goog.addSingletonGetter(ydn.crm.ui.sugar.field.CheckboxFieldRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.field.CheckboxFieldRenderer.DEBUG = false;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.field.CheckboxFieldRenderer.prototype.createDom = function(field) {
  var el = goog.base(this, 'createDom', field);

  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var model = field.getModel();
  var dom = field.getDomHelper();

  var label = model.getLabel();
  var calculated = model.isCalculated();
  // console.log(label, type, calculated);
  var id = goog.ui.IdGenerator.getInstance().getNextUniqueId();
  var ele_value = dom.createDom('input', {
    'type': 'checkbox',
    'id': id
  });
  var ele_label = dom.createDom('label', {'for': id}, label);
  if (calculated) {
    ele_value.setAttribute('disabled', 'true');
  }
  ele_value.classList.add(ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE);
  // ele_value.setAttribute('disabled', '1');

  el.appendChild(ele_value);
  el.appendChild(ele_label);
  return el;
};


/**
 * @param {Element} ele_field
 * @param {ydn.crm.sugar.model.Field?} model Element to decorate.
 */
ydn.crm.ui.sugar.field.CheckboxFieldRenderer.prototype.refresh = function(ele_field, model) {
  goog.style.setElementShown(ele_field, !!model);
  if (!model) {
    return;
  }
  var value = model.getFieldValue();
  var is_def = goog.isString(value) ? !goog.string.isEmpty(value) :
      goog.isDefAndNotNull(value);
  // console.log(model.getFieldName() + ' ' + value);
  var ele_value = ele_field.querySelector('.' + ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE);

  if (model.getType() == 'bool' && !goog.isBoolean(value)) {
    if (value == '1' || value == 'on' || value == 'true') {
      value = true;
    } else {
      value = false;
    }
  }
  ele_value.value = value;

  if (ydn.crm.ui.sugar.field.CheckboxFieldRenderer.DEBUG) {
    window.console.log(model.getFieldName(), model.getType(), value);
  }

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
ydn.crm.ui.sugar.field.CheckboxFieldRenderer.prototype.collectValue = function(ctrl) {
  var ele = ctrl.getContentElement();
  var ele_value = ele.querySelector('.' + ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE);
  if (ele_value.tagName == goog.dom.TagName.LABEL ||
      ele_value.tagName == goog.dom.TagName.SPAN || ele_value.tagName == goog.dom.TagName.DIV) {
    return ele_value.textContent;
  } else if (ele_value.type == 'checkbox') {
    return ele_value.checked; // goog.dom.forms get value incorrect.
  } else {
    return ele_value.value; // goog.dom.forms.getValue(ele_value);
  }
};


