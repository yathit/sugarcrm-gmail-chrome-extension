/**
 * @fileoverview SugarCrm module field.
 */


goog.provide('ydn.crm.inj.sugar.field.EmailRenderer');
goog.require('ydn.crm.inj.sugar.module.FieldRenderer');



/**
 * Create a new module record field.
 * @constructor
 * @extends {ydn.crm.inj.sugar.module.FieldRenderer}
 * @struct
 */
ydn.crm.inj.sugar.field.EmailRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.field.EmailRenderer, ydn.crm.inj.sugar.module.FieldRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.field.EmailRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.field.EmailRenderer.DEBUG = goog.DEBUG;


/**
 * @override
 */
ydn.crm.inj.sugar.field.EmailRenderer.prototype.createDom = function(controller) {
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
  var ele_value = dom.createDom('span', 'value');
  var label = model.getLabel();
  ele_value.setAttribute('title', label);

  el.classList.add(ydn.crm.inj.sugar.field.EmailRenderer.CSS_CLASS);
  el.setAttribute('name', model.getFieldName());
  el.appendChild(ele_value);

  return el;
};


/**
 * @param {Element} ele_field
 * @param {ydn.crm.sugar.model.Field?} model Element to decorate.
 */
ydn.crm.inj.sugar.field.EmailRenderer.prototype.refresh = function(ele_field, model) {
  goog.style.setElementShown(ele_field, !!model);
  if (!model) {
    return;
  }

  var value = model.getField();
  if (ydn.crm.inj.sugar.field.EmailRenderer.DEBUG) {
    window.console.log(model.getFieldName(), value);
  }
  var ele_value = ele_field.querySelector('.value');
  if (goog.isString(value)) {
    if (ele_value.childElementCount > 0) {
      ele_value.innerHTML = '';
    }
    ele_value.textContent = value;
    ele_field.classList.remove('empty');
  } else if (goog.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      var ef = /** @type {SugarCrm.EmailField} */ (value[i]);
      var span = ele_value.children[i];
      if (!span) {
        span = document.createElement('span');
      }
      span.textContent = ef.email_address;
      if (ef.primary_address) {
        span.classList.add('primary');
      } else {
        span.classList.remove('primary');
      }
      if (ef.opt_out) {
        span.classList.add('optout');
      } else {
        span.classList.remove('optout');
      }
    }
    for (var i = n = ele_value.childElementCount - 1; i >= value.length; i--) {
      ele_value.removeChild(i);
    }
  } else {
    ele_field.classList.add('empty');
    ele_field.classList.remove('empty');
    ele_value.innerHTML = '';
  }

};


