/**
 * @fileoverview Group controller.
 *
 * Group controller manage changes in filed of the records.
 */


goog.provide('ydn.crm.ui.sugar.group.AbstractGroup');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Group');
goog.require('ydn.crm.ui.UserSetting');
goog.require('ydn.crm.ui.sugar.group.GroupRenderer');



/**
 * Group controller.
 * @param {ydn.crm.sugar.model.BaseGroup} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.group.AbstractGroup = function(model, opt_dom) {
  goog.base(this, opt_dom);
  this.setModel(model);
  /**
   * Editable.
   * @type {boolean}
   * @private
   */
  this.is_editable_ = false;
};
goog.inherits(ydn.crm.ui.sugar.group.AbstractGroup, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.group.AbstractGroup.DEBUG = false;


/**
 * @return {ydn.crm.sugar.model.BaseGroup}
 * @override
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.getModel;


/**
 * Get group name.
 * @return {string}
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.getGroupName = function() {
  return this.getModel().getGroupName();
};


/**
 * @return {boolean}
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.isEditable = function() {
  return this.is_editable_;
};


/**
 * @return {!ydn.crm.ui.sugar.setting.Setting}
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.getSetting = function() {
  return new ydn.crm.ui.sugar.setting.Group(this.getGroupName());
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.ui.sugar.group.GroupRenderer.CSS_CLASS_CONTENT,
      this.getElement());
};


/**
 * Collect data of the field user has changes.
 * @return {?Object} null if no change in data.
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.collectData = function() {
  return null;
};


/** @return {string} */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.group.GroupRenderer.CSS_CLASS;
};


/**
 * Get normally hide status as display in DOM.
 * @return {?boolean}
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.isNormallyHide = function() {
  var group = this.getElement();
  return group.classList.contains(ydn.crm.ui.CSS_CLASS_NORMALLY_HIDE);
};


/**
 * Update normally hide status in DOM.
 * Default is adding or removing 'normally-hide' class to 'record-group' Element.
 * @param {boolean} val status value.
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.setNormallyHide = function(val) {
  var ele = this.getElement();
  if (val) {
    ele.classList.add(ydn.crm.ui.CSS_CLASS_NORMALLY_HIDE);
  } else {
    ele.classList.remove(ydn.crm.ui.CSS_CLASS_NORMALLY_HIDE);
  }
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.createDom = function() {
  var dom = this.getDomHelper();
  var root = dom.createDom('div', this.getCssClass());
  var head = dom.createDom('div', ydn.crm.ui.sugar.group.GroupRenderer.CSS_CLASS_HEADER);
  var content = dom.createDom('div', ydn.crm.ui.sugar.group.GroupRenderer.CSS_CLASS_CONTENT);
  root.appendChild(head);
  root.appendChild(content);
  this.setElementInternal(root);
  var model = this.getModel();
  var group_name = model.getGroupName();
  root.setAttribute('name', group_name);
  if (this.getSetting().getNormallyHide()) {
    root.classList.add(ydn.crm.ui.CSS_CLASS_NORMALLY_HIDE);
  }
};


/**
 * Refresh UI when record is updated
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.refresh = function() {

};


/**
 * Refresh UI when record is changed with different ID.
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.reset = function() {
  this.setNormallyHide(this.getSetting().getNormallyHide());
};


/**
 * Simulate user edit.
 * If input field is not found, edit is ignored.
 * @param {?string} name
 * @param {string} value
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.simulateEditByField = function(name, value) {
  var field_sel = name ? '[name="' + name + '"]' : '';
  var input = this.getContentElement().querySelector('div.field' + field_sel + ' input.value');
  if (input) {
    input.value = value;
  } else if (ydn.crm.ui.sugar.group.AbstractGroup.DEBUG) {
    window.console.warn('field ' + field_sel + ' not found in ' + this.getGroupName());
  }
};


/**
 * Get field component by field name.
 * Subclass should override this, default implementation return null.
 * @param {string} name
 * @return {ydn.crm.ui.sugar.field.Field}
 */
ydn.crm.ui.sugar.group.AbstractGroup.prototype.getFieldByName = function(name) {
  return null;
};

