
/**
 * @fileoverview Group model for 'name' group fields.
 *
 *
 */


goog.provide('ydn.crm.sugar.model.EmailField');
goog.require('ydn.crm.sugar.model.Field');
goog.require('ydn.object');



/**
 * Group model for 'email' group fields.
 * @param {ydn.crm.sugar.model.EmailGroup} parent
 * @param {string} field name
 * @constructor
 * @extends {ydn.crm.sugar.model.Field}
 * @struct
 */
ydn.crm.sugar.model.EmailField = function(parent, field) {
  goog.base(this, parent, field);
};
goog.inherits(ydn.crm.sugar.model.EmailField, ydn.crm.sugar.model.Field);


/**
 * @return {ydn.crm.sugar.model.EmailGroup}
 */
ydn.crm.sugar.model.EmailField.prototype.getParentModel = function() {
  return /** @type {ydn.crm.sugar.model.EmailGroup} */ (this.parent);
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.EmailField.prototype.getFieldValue = function() {
  var email_model = this.getParentModel();
  return email_model.getFieldValueByEmailId(this.field_name);
};


/**
 * @return {?boolean}
 */
ydn.crm.sugar.model.EmailField.prototype.isOptOut = function() {
  var email_model = this.getParentModel();
  return email_model.isOptOut(this.field_name);
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.EmailField.prototype.getFieldInfo = function() {
  return this.parent.getFieldInfo(this.field_name) ||
      this.parent.getFieldInfo('email');
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.EmailField.prototype.patch = function(email) {
  if (!email) {
    return null; // we don't delete on update
  }
  email = /** @type {string} */ (email);
  var email_model = this.getParentModel();
  if (email_model.isBean()) {
    // bean format
    var bean_email = email_model.getEmails();
    for (var i = 0; i < bean_email.length; i++) {
      var bean = bean_email[i];
      if (bean_email[i].email_address_id == this.field_name) {
        if (bean.email_address == email) {
          return null;
        }
        bean_email[i].email_address = email;
        bean_email[i].email_address_caps = email.toUpperCase();
        return {
          'email': bean_email
        };
      }
    }
    return null;
  } else {
    // old format
    var original_value = email_model.module.value(this.field_name);
    if (original_value == email) {
      return null;
    } else {
      var obj = {};
      obj[this.field_name] = email;
      return obj;
    }
  }
};


/**
 * Get a patch for given email.
 * @return {Object} null if no path required.
 */
ydn.crm.sugar.model.EmailField.prototype.removeEmail = function() {
  var email_model = this.getParentModel();
  if (email_model.isBean()) {
    // bean format
    var bean_email = email_model.getEmails();
    for (var i = 0; i < bean_email.length; i++) {
      if (bean_email[i].email_address_id == this.field_name) {
        var emails = ydn.object.clone(bean_email);
        emails.splice(i, 1);
        return {
          'email': emails
        };
      }
    }
    return null;
  } else {
    // old format
    var original_value = email_model.module.value(this.field_name);
    if (original_value) {
      var obj = {};
      obj[this.field_name] = undefined;
      return obj;
    } else {
      return null;
    }
  }
};


/**
 * Check the field value is deletable.
 * Extra field like, phone number, address, email are deletable.
 * @return {Array.<ydn.crm.sugar.model.Field.FieldOption>}
 */
ydn.crm.sugar.model.EmailField.prototype.getMoreOptions = function() {
  // Note: only InputFieldRenderer display delete button.
  return [
    {
      name: ydn.crm.sugar.model.Field.Command.REMOVE,
      label: 'Remove'
    }, {
      name: ydn.crm.sugar.model.Field.Command.OPT_OUT,
      label: 'Opt out',
      type: 'bool',
      value: this.isOptOut()
    }
  ];
};
