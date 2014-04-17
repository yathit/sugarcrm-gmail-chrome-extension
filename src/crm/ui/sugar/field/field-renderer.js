/**
 * @fileoverview SugarCrm module field.
 */


goog.provide('ydn.crm.ui.sugar.field.FieldRenderer');
goog.require('goog.dom.TagName');
goog.require('goog.dom.forms');



/**
 * Create a new module record field.
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.field.FieldRenderer = function() {

};
goog.addSingletonGetter(ydn.crm.ui.sugar.field.FieldRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.field.FieldRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_EMPTY = 'empty';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE = 'value';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS = 'field';


/** @return {string} */
ydn.crm.ui.sugar.field.FieldRenderer.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS;
};


/**
 * A quick UID.
 * @type {string}
 */
ydn.crm.ui.sugar.field.FieldRenderer.UID = 'ydnf-';


/**
 * Make datalist of given enum field. If already exist, this will return it.
 * @param {ydn.crm.sugar.model.Field} model
 * @return {string} datalist id.
 */
ydn.crm.ui.sugar.field.FieldRenderer.getDataList = function(model) {
  var mf = model.getFieldInfo();
  var id = ydn.crm.ui.sugar.field.FieldRenderer.UID + model.getFieldId();
  if (mf.type == 'enum' && !!mf.options && !document.getElementById(id)) {
    var datalist = document.createElement('datalist');
    datalist.id = id;
    for (var name in mf.options) {
      if (name) {
        var option = document.createElement('option');
        option.setAttribute('value', name);
        datalist.appendChild(option);
      }
    }
    document.body.appendChild(datalist);
  }
  return id;
};


/**
 * @param {ydn.crm.ui.sugar.field.Field} field
 */
ydn.crm.ui.sugar.field.FieldRenderer.prototype.createDom = function(field) {

  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var model = field.getModel();
  var dom = field.getDomHelper();
  var el = dom.createDom('div');
  el.classList.add(this.getCssClass());
  field.setElementInternal(el);
  var ele_value;
  var ele_label;
  var label = model.getLabel();
  var type = model.getType();
  var calculated = model.isCalculated();
  // console.log(label, type, calculated);
  if (type == 'bool') {
    var id = goog.ui.IdGenerator.getInstance().getNextUniqueId();
    ele_value = dom.createDom('input', {
      'type': 'checkbox',
      'id': id
    });
    ele_label = dom.createDom('label', {'for': id}, label);
    if (calculated) {
      ele_value.setAttribute('disabled', 'true');
    }
  } else if (type == 'text') {
    ele_value = dom.createDom(goog.dom.TagName.TEXTAREA);
  } else if (type == 'enum') {
    ele_value = dom.createDom('input', {
      'class': 'enum',
      'type': 'text'
    });
    ele_value.setAttribute('list', ydn.crm.ui.sugar.field.FieldRenderer.getDataList(model));
  } else {
    ele_value = dom.createDom('div', 'value');
    if (!calculated) {
      ele_value.setAttribute('contenteditable', 'true');
    }
    // ele_value = dom.createDom('input', 'value');
  }
  ele_value.classList.add(ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE);
  // ele_value.setAttribute('disabled', '1');

  el.classList.add(this.getCssClass());
  el.setAttribute('name', model.getFieldName());
  el.appendChild(ele_value);
  if (ele_label) {
    el.appendChild(ele_label);
  } else {
    ele_value.setAttribute('title', label);
  }

};


/**
 * @param {Element} ele_field
 * @param {ydn.crm.sugar.model.Field?} model Element to decorate.
 */
ydn.crm.ui.sugar.field.FieldRenderer.prototype.refresh = function(ele_field, model) {
  goog.style.setElementShown(ele_field, !!model);
  if (!model) {
    return;
  }
  var value = model.getFieldValue();
  var is_def = goog.isString(value) ? !goog.string.isEmpty(value) :
      goog.isDefAndNotNull(value);
  // console.log(model.getFieldName() + ' ' + value);
  var ele_value = ele_field.querySelector('.' + ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE);
  if (ele_value.tagName == goog.dom.TagName.LABEL ||
      ele_value.tagName == goog.dom.TagName.SPAN || ele_value.tagName == goog.dom.TagName.DIV) {
    ele_value.textContent = is_def ? value : '';
  } else {
    if (model.getType() == 'bool' && !goog.isBoolean(value)) {
      if (value == '1' || value == 'on') {
        value = true;
      } else {
        value = false;
      }
    }
    goog.dom.forms.setValue(ele_value, value);
  }
  if (ydn.crm.ui.sugar.field.FieldRenderer.DEBUG) {
    window.console.log(model.getFieldName(), value);
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
 * @return {string|boolean}  if field value is not available empty string return.
 */
ydn.crm.ui.sugar.field.FieldRenderer.prototype.collectValue = function(ctrl) {
  var ele = ctrl.getContentElement();
  var ele_value = ele.querySelector('.' + ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS_VALUE);
  if (ele_value.tagName == goog.dom.TagName.LABEL ||
      ele_value.tagName == goog.dom.TagName.SPAN || ele_value.tagName == goog.dom.TagName.DIV) {
    return ele_value.textContent.trim();
  } else if (ele_value.tagName == goog.dom.TagName.INPUT && ele_value.type == 'checkbox') {
    var prev_value = ctrl.getModel().getFieldValue();
    if (goog.isBoolean(prev_value)) {
      return ele_value.checked ? true : false;
    } else if (prev_value == 'on' || prev_value == 'off') {
      return ele_value.checked ? 'on' : 'off';
    } else {
      return ele_value.checked ? '1' : '0';
    }
  } else {
    return ele_value.value.trim();
  }
};


