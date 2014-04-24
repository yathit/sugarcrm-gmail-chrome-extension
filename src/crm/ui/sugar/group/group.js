/**
 * @fileoverview Panel for group of field in a module.
 *
 * Parent record panel is responsible to refresh if model has changed.
 */


goog.provide('ydn.crm.ui.sugar.group.Group');
goog.require('ydn.crm.inj.sugar.module.Field');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Group');
goog.require('ydn.crm.ui.sugar.group.GroupRenderer');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {ydn.crm.ui.sugar.group.GroupRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @implements {ydn.crm.ui.Refreshable}
 */
ydn.crm.ui.sugar.group.Group = function(model, opt_renderer, opt_dom) {
  goog.base(this, opt_dom);
  /**
   * @protected
   * @type {ydn.crm.ui.sugar.group.GroupRenderer}
   */
  this.renderer = opt_renderer || new ydn.crm.ui.sugar.group.GroupRenderer();
  this.setModel(model);
};
goog.inherits(ydn.crm.ui.sugar.group.Group, goog.ui.Component);


/**
 * @return {ydn.crm.sugar.model.Group}
 * @override
 */
ydn.crm.ui.sugar.group.Group.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Group.prototype.createDom = function() {
  this.renderer.createDom(this);
};


/**
 * Get group name.
 * @return {string}
 */
ydn.crm.ui.sugar.group.Group.prototype.getGroupName = function() {
  return this.getModel().getGroupName();
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Group.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.ui.sugar.group.GroupRenderer.CSS_CONTENT_CLASS,
      this.getElement());
};


/**
 * Collect data of the field user has changes..
 * @return {Object?} null if no change in data.
 */
ydn.crm.ui.sugar.group.Group.prototype.collectData = function() {
  var obj = null;
  for (var j = 0; j < this.getChildCount(); j++) {
    var f = /** @type {ydn.crm.ui.sugar.field.Field} */ (this.getChildAt(j));
    var value = f.collectData();
    if (!goog.isNull(value)) {
      if (!obj) {
        obj = {};
      }
      obj[f.getFieldName()] = value;
    }
  }
  return obj;
};


/**
 * Get field component by field name.
 * @param {string} name
 * @return {ydn.crm.ui.sugar.field.Field}
 */
ydn.crm.ui.sugar.group.Group.prototype.getChildByField = function(name) {
  for (var j = 0; j < this.getChildCount(); j++) {
    var f = /** @type {ydn.crm.ui.sugar.field.Field} */ (this.getChildAt(j));
    if (f.getFieldName() == name) {
      return f;
    }
  }
  return null;
};


/**
 * refresh.
 */
ydn.crm.ui.sugar.group.Group.prototype.refresh = function() {
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.ui.sugar.field.Field} */ (this.getChildAt(i));
    child.refresh();
  }
};


