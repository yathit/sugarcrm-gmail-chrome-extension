
/**
 * @fileoverview Group model for 'name' group fields.
 *
 *
 */


goog.provide('ydn.crm.sugar.model.PhoneField');
goog.require('ydn.crm.sugar.model.Field');



/**
 * Group model for 'phone' group fields.
 * @param {ydn.crm.sugar.model.PhoneGroup} parent
 * @param {string} field name
 * @constructor
 * @extends {ydn.crm.sugar.model.Field}
 * @struct
 */
ydn.crm.sugar.model.PhoneField = function(parent, field) {
  goog.base(this, parent, field);
};
goog.inherits(ydn.crm.sugar.model.PhoneField, ydn.crm.sugar.model.Field);


/**
 * Check the field value is deletable.
 * Extra field like, phone number, address, email are deletable.
 * @return {Array.<ydn.crm.sugar.model.Field.FieldOption>}
 */
ydn.crm.sugar.model.PhoneField.prototype.getMoreOptions = function() {
  // Note: only InputFieldRenderer display delete button.
  return [
    {
      name: ydn.crm.sugar.model.Field.Command.REMOVE,
      label: 'Remove'
    }
  ];
};
