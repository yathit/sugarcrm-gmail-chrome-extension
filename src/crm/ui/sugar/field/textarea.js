/**
 * @fileoverview About this file
 */

goog.provide('ydn.crm.ui.sugar.field.TextArea');



/**
 * Secondary record panel
 * @param {ydn.crm.sugar.model.Field} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @implements {ydn.crm.ui.Refreshable}
 */
ydn.crm.ui.sugar.field.TextArea = function(model, dom) {
  goog.base(this, dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.ui.sugar.field.TextArea, goog.ui.Component);


/**
 * @return {ydn.crm.sugar.model.Field}
 * @override
 */
ydn.crm.ui.sugar.field.TextArea.prototype.getModel;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.field.TextArea.CSS_CLASS = 'field';


/** @return {string} */
ydn.crm.ui.sugar.field.TextArea.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.field.TextArea.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.field.TextArea.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var model = this.getModel();
  root.classList.add(this.getCssClass());
  root.classList.add(model.getFieldName());
  var input = dom.createDom(goog.dom.TagName.TEXTAREA, {
    'name': model.getFieldName()
  });
  root.appendChild(input);
};


/**
 * @return {Element}
 */
ydn.crm.ui.sugar.field.TextArea.prototype.getInput = function() {
  return this.getElement().querySelector('textarea');
};


/**
 * refresh.
 */
ydn.crm.ui.sugar.field.TextArea.prototype.refresh = function() {
  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var model = this.getModel();
  this.getInput().value = model.getFieldValue();
};


/**
 * @return {string}
 */
ydn.crm.ui.sugar.field.TextArea.prototype.collectData = function() {
  return this.getInput().value; // Note: not textContent
};
