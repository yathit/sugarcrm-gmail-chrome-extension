/**
 * @fileoverview SugarCrm module field.
 */


goog.provide('ydn.crm.inj.sugar.module.SimpleFieldRenderer');



/**
 * Create a new module record field.
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.SimpleFieldRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.SimpleFieldRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.module.SimpleFieldRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.SimpleFieldRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.SimpleFieldRenderer.CSS_CLASS = 'field';


/** @return {string} */
ydn.crm.inj.sugar.module.SimpleFieldRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.SimpleFieldRenderer.CSS_CLASS;
};


/**
 * @override
 */
ydn.crm.inj.sugar.module.SimpleFieldRenderer.prototype.createDom = function(controller) {
  var el = controller.getDomHelper().createDom(
      'span', this.getClassNames(controller).join(' '), controller.getContent());
  this.setAriaStates(controller, el);

  var field = /** @type {ydn.crm.inj.sugar.module.Field} */ (controller);
  field.setElementInternal(el);
  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var model = field.getModel();
  var dom = field.getDomHelper();
  var ele_value;
  var label = model.getLabel();
  var type = model.getType();
  if (type == 'bool') {
    ele_value = dom.createDom('input', {
      'class': 'value',
      'type': 'checkbox',
      'disabled': '1'
    });
  } else if (type == 'enum') {
    ele_value = dom.createDom('select', {
      'class': 'value',
      'disabled': '1'
    });
    var options = model.getOptions();
    for (var opt in options) {
      var item = dom.createDom('option', {
        'name': options[opt].name
      }, options[opt].value);
      ele_value.appendChild(item);
    }
  } else {
    ele_value = dom.createDom('label', 'value');
  }
  ele_value.setAttribute('title', label);

  el.classList.add(ydn.crm.inj.sugar.module.SimpleFieldRenderer.CSS_CLASS);
  el.setAttribute('name', model.getFieldName());
  el.appendChild(ele_value);

  return el;
};


/**
 * @param {Element} ele_field
 * @param {ydn.crm.sugar.model.Field?} model Element to decorate.
 */
ydn.crm.inj.sugar.module.SimpleFieldRenderer.prototype.refresh = function(ele_field, model) {
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
  if (ydn.crm.inj.sugar.module.SimpleFieldRenderer.DEBUG) {
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


