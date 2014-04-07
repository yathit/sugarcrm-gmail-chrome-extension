/**
 * @fileoverview SugarCrm module field.
 */


goog.provide('ydn.crm.inj.sugar.module.FieldRenderer');
goog.require('goog.dom.forms');



/**
 * Create a new module record field.
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.FieldRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.FieldRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.module.FieldRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.FieldRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.FieldRenderer.CSS_CLASS = 'field';


/** @return {string} */
ydn.crm.inj.sugar.module.FieldRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.FieldRenderer.CSS_CLASS;
};


/**
 * A quick UID.
 * @type {string}
 */
ydn.crm.inj.sugar.module.FieldRenderer.UID = 'ydnf-';


/**
 * Make datalist of given enum field. If already exist, this will return it.
 * @param {ydn.crm.sugar.model.Field} model
 * @return {string} datalist id.
 */
ydn.crm.inj.sugar.module.FieldRenderer.getDataList = function(model) {
  var mf = model.getFieldInfo();
  var id = ydn.crm.inj.sugar.module.FieldRenderer.UID + model.getFieldId();
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
 * @override
 */
ydn.crm.inj.sugar.module.FieldRenderer.prototype.createDom = function(controller) {
  var el = goog.base(this, 'createDom', controller);
  var field = /** @type {ydn.crm.inj.sugar.module.Field} */ (controller);
  field.setElementInternal(el);
  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var model = field.getModel();
  var dom = field.getDomHelper();
  var ele_value;
  var ele_name;
  var label = model.getLabel();
  var type = model.getType();
  if (type == 'bool') {
    ele_value = dom.createDom('input', {
      'class': 'value',
      'type': 'checkbox',
      'disabled': '1'
    });
    ele_name = dom.createDom('span', 'name');
  } else if (type == 'enum') {
    ele_value = dom.createDom('input', {
      'class': 'value enum',
      'type': 'text',
      'disabled': '1'
    });
    ele_value.setAttribute('list', ydn.crm.inj.sugar.module.FieldRenderer.getDataList(model));
  } else {
    ele_value = dom.createDom('label', 'value');
    ele_name = dom.createDom('sup', 'name');
  }

  el.classList.add(this.getCssClass());
  el.setAttribute('name', model.getFieldName());
  el.appendChild(ele_value);
  if (ele_name) {
    ele_name.textContent = label;
    el.appendChild(ele_name);
  }
  /*
  if (model.isNormallyHide()) {
    el.classList.add('normally-hide');
  }
  */
  return el;
};


/**
 * @param {Element} ele_field
 * @param {ydn.crm.sugar.model.Field?} model Element to decorate.
 */
ydn.crm.inj.sugar.module.FieldRenderer.prototype.refresh = function(ele_field, model) {
  goog.style.setElementShown(ele_field, !!model);
  if (!model) {
    return;
  }
  var value = model.getFieldValue();
  var is_def = goog.isString(value) ? !goog.string.isEmpty(value) :
      goog.isDefAndNotNull(value);
  // console.log(model.getFieldName() + ' ' + value);
  var ele_value = ele_field.querySelector('.value');
  if (ele_value.tagName == goog.dom.TagName.LABEL) {
    ele_value.textContent = is_def ? value : '';
  } else {
    goog.dom.forms.setValue(ele_value, value);
  }
  if (ydn.crm.inj.sugar.module.FieldRenderer.DEBUG) {
    window.console.log(model.getFieldName(), value);
  }
  if (is_def) {
    // goog.dom.classes.remove(ele_field, 'empty');
    ele_field.classList.remove('empty');
  } else {
    // goog.dom.classes.add(ele_field, 'empty');
    ele_field.classList.add('empty');
  }
};


