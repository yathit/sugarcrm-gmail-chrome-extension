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
 * @return {Element}
 */
ydn.crm.ui.sugar.field.FieldRenderer.prototype.createDom = function(field) {

  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var model = field.getModel();
  var dom = field.getDomHelper();
  var el = dom.createDom('div');
  el.classList.add(this.getCssClass());
  el.setAttribute('name', model.getFieldName());
  field.setElementInternal(el);
  return el;
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
  ele_field.textContent = value;
  if (ydn.crm.ui.sugar.field.FieldRenderer.DEBUG) {
    window.console.log(model.getFieldName(), model.getType(), value);
  }
  var is_def = goog.isString(value) ? !goog.string.isEmpty(value) :
      goog.isDefAndNotNull(value);
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
ydn.crm.ui.sugar.field.FieldRenderer.prototype.collectValue = function(ctrl) {
  var ele = ctrl.getContentElement();
  return ele.textContent;
};


