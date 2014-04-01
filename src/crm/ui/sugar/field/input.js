/**
 * @fileoverview About this file
 */

goog.provide('ydn.crm.ui.sugar.field.Input');



/**
 * Secondary record panel
 * @param {ydn.crm.sugar.model.Field} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 *  @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @implements {ydn.crm.ui.Refreshable}
 */
ydn.crm.ui.sugar.field.Input = function(model, dom) {
  goog.base(this, dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.ui.sugar.field.Input, goog.ui.Component);


/**
 * @return {ydn.crm.sugar.model.Field}
 * @override
 */
ydn.crm.ui.sugar.field.Input.prototype.getModel;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.field.Input.CSS_CLASS = 'field';


/** @return {string} */
ydn.crm.ui.sugar.field.Input.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.field.Input.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.field.Input.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var model = this.getModel();
  root.classList.add(this.getCssClass());
  root.classList.add(model.getFieldName());
  var input = dom.createDom(goog.dom.TagName.INPUT, {
    'type': 'text',
    'name': model.getFieldName()
  });
  root.appendChild(input);
};


/**
 * @return {Element}
 */
ydn.crm.ui.sugar.field.Input.prototype.getInput = function() {
  return this.getElement().querySelector('input');
};


/**
 * refresh.
 */
ydn.crm.ui.sugar.field.Input.prototype.refresh = function() {
  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var model = this.getModel();
  this.getInput().value = model.getFieldValue();
};


/**
 * @return {string}
 */
ydn.crm.ui.sugar.field.Input.prototype.collectData = function() {
  return this.getInput().value;
};
