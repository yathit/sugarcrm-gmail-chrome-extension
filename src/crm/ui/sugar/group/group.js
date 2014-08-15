/**
 * @fileoverview Group controller.
 *
 * Group controller manage changes in filed of the records.
 */


goog.provide('ydn.crm.ui.sugar.group.Group');
goog.require('goog.ui.Dialog');
goog.require('ydn.crm.sugar.model.Group');
goog.require('ydn.crm.ui.sugar.group.AbstractGroup');
goog.require('ydn.crm.ui.sugar.group.GroupRenderer');



/**
 * Group controller.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {ydn.crm.ui.sugar.group.GroupRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.AbstractGroup}
 */
ydn.crm.ui.sugar.group.Group = function(model, opt_renderer, opt_dom) {
  /**
   * @protected
   * @type {ydn.crm.ui.sugar.group.GroupRenderer}
   */
  this.renderer = opt_renderer || ydn.crm.ui.sugar.group.GroupRenderer.getInstance();
  goog.base(this, model, opt_dom);
};
goog.inherits(ydn.crm.ui.sugar.group.Group, ydn.crm.ui.sugar.group.AbstractGroup);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.group.Group.DEBUG = false;


/**
 * @return {ydn.crm.sugar.model.Group}
 * @override
 */
ydn.crm.ui.sugar.group.Group.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Group.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();

  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = this.getModel();
  var dom = this.getDomHelper();
  var groups = model.listFields();
  for (var i = 0; i < groups.length; i++) {
    var name = groups[i];
    var field_model = model.createOrGetFieldModel(name);
    var field;
    if (field_model instanceof ydn.crm.sugar.model.EmailField) {
      var email = /** @type {ydn.crm.sugar.model.EmailField} */(field_model);
      field = new ydn.crm.ui.sugar.field.Email(email, dom);
    } else if (field_model instanceof ydn.crm.sugar.model.PhoneField) {
      var phone = /** @type {ydn.crm.sugar.model.PhoneField} */(field_model);
      field = new ydn.crm.ui.sugar.field.Phone(phone, dom);
    } else {
      field = new ydn.crm.ui.sugar.field.Field(field_model, null, dom);
    }
    this.addChild(field, true);
  }

};


/**
 * Attach handlers when the control become editable.
 * Superclass override to attach handlers. This will be called only when
 * handlers were not being attached.
 * @protected
 */
ydn.crm.ui.sugar.group.Group.prototype.attachHandlers = function() {

};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Group.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  if (this.isEditable()) {
    this.attachHandlers();
  }

  this.getHandler().listen(this, ydn.crm.ui.sugar.field.EventType.ACTION,
      this.onMenuAction);

};


/**
 * @param {ydn.crm.ui.sugar.field.MenuActionEvent} ma
 * @protected
 */
ydn.crm.ui.sugar.group.Group.prototype.onMenuAction = function(ma) {

};


/**
 * @inheritDoc
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
ydn.crm.ui.sugar.group.Group.prototype.getFieldByName = function(name) {
  for (var j = 0; j < this.getChildCount(); j++) {
    var f = /** @type {ydn.crm.ui.sugar.field.Field} */ (this.getChildAt(j));
    if (f.getFieldName() == name) {
      return f;
    }
  }
  return null;
};


/**
 * @override
 */
ydn.crm.ui.sugar.group.Group.prototype.refresh = function() {
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.ui.sugar.field.Field} */ (this.getChildAt(i));
    if (ydn.crm.ui.sugar.group.Group.DEBUG && !child) {
      console.error(this + ' child ' + i + ' ' + child);
    }
    child.refresh();
  }
};


