
/**
 * @fileoverview Group model for 'name' group fields.
 *
 *
 */


goog.provide('ydn.crm.sugar.model.PhoneGroup');
goog.require('ydn.crm.sugar.model.Group');
goog.require('ydn.crm.sugar.model.PhoneField');



/**
 * Group model for 'email' group fields.
 * @param {ydn.crm.sugar.model.Record} parent
 * @constructor
 * @extends {ydn.crm.sugar.model.Group}
 * @struct
 */
ydn.crm.sugar.model.PhoneGroup = function(parent) {
  goog.base(this, parent, 'phone');
};
goog.inherits(ydn.crm.sugar.model.PhoneGroup, ydn.crm.sugar.model.Group);


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.PhoneGroup.prototype.createOrGetFieldModel = function(name) {
  var index = this.fields.indexOf(name);
  if (index >= 0) {
    return this.fields[index];
  }
  var f = new ydn.crm.sugar.model.PhoneField(this, name);
  this.fields.push(f);
  return f;
};

