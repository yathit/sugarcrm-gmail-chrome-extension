/**
 * @fileoverview SugarCrm module field.
 */


goog.provide('ydn.crm.ui.sugar.field.Field');
goog.require('goog.ui.Component');
goog.require('ydn.crm.ui.Refreshable');
goog.require('ydn.crm.ui.sugar.field.FieldRenderer');



/**
 * Create a new module record field.
 * @param {ydn.crm.sugar.model.Field} info
 * @param {ydn.crm.ui.sugar.field.FieldRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @extends {goog.ui.Component}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @implements {ydn.crm.ui.Refreshable}
 */
ydn.crm.ui.sugar.field.Field = function(info, opt_renderer, opt_domHelper) {
  goog.base(this, opt_domHelper);
  /**
   * @protected
   * @type {ydn.crm.ui.sugar.field.FieldRenderer}
   */
  this.renderer = opt_renderer || ydn.crm.ui.sugar.field.FieldRenderer.getInstance();
  this.setModel(info);

};
goog.inherits(ydn.crm.ui.sugar.field.Field, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.field.Field.DEBUG = false;


/**
 * @return {ydn.crm.sugar.model.Field}
 * @override
 */
ydn.crm.ui.sugar.field.Field.prototype.getModel;


/**
 * @return {ydn.crm.ui.sugar.field.FieldRenderer}
 */
ydn.crm.ui.sugar.field.Field.prototype.getRenderer = function() {
  return this.renderer;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.field.Field.prototype.createDom = function() {
  this.renderer.createDom(this);
};


/**
 * @return {string}
 */
ydn.crm.ui.sugar.field.Field.prototype.getFieldName = function() {
  return this.getModel().getFieldName();
};


/**
 * Refresh UI for model changes.
 */
ydn.crm.ui.sugar.field.Field.prototype.refresh = function() {
  var renderer = /** @type {ydn.crm.ui.sugar.field.FieldRenderer} */ (this.getRenderer());
  renderer.refresh(this.getElement(), this.getModel());
};


/**
 * Collect data from UI.
 * @return {*} return null if not modified.
 */
ydn.crm.ui.sugar.field.Field.prototype.collectData = function() {
  var new_value = this.getRenderer().collectValue(this);
  /**
   * @type {ydn.crm.sugar.model.Field}
   */
  var m = this.getModel();
  var old_value = m.getField();
  if (m.getType() == 'bool' && !goog.isBoolean(old_value)) {
    if (old_value == 'on' || old_value == 'off') {
      new_value = new_value ? 'on' : 'off';
    } else if (old_value == 'true' || old_value == 'false') {
      new_value = new_value ? 'true' : 'false';
    } else if (old_value == '1' || old_value == '0') {
      new_value = new_value ? '1' : '0';
    }
  } else if (old_value === false && !m.getType() != 'bool' && new_value == 'false') {
    new_value = old_value; // restore wired old value.
  } else if (!goog.isDef(old_value) || !new_value) {
    new_value = old_value; // restore undefined status.
  }
  if (ydn.crm.ui.sugar.field.Field.DEBUG) {
    window.console.log(this.getFieldName(), m.getType(), m.getField(),
        this.getRenderer().collectValue(this), new_value);
  }
  if (new_value != old_value) {
    return new_value;
  } else {
    return null;
  }
};


/**
 * Get field value from the model.
 * @return {*}
 */
ydn.crm.ui.sugar.field.Field.prototype.getValue = function() {
  return this.getModel().getFieldValue();
};


/**
 * Check modification on UI value with model value.
 * @return {boolean}
 */
ydn.crm.ui.sugar.field.Field.prototype.hasChanged = function() {
  return this.getValue() != this.collectData();
};




