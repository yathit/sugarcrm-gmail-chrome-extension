
/**
 * @fileoverview Group model for 'name' group fields.
 *
 *
 */


goog.provide('ydn.crm.sugar.model.EmailGroup');
goog.require('ydn.crm.sugar.model.EmailField');
goog.require('ydn.crm.sugar.model.Group');
goog.require('ydn.object');



/**
 * Group model for 'email' group fields.
 * @param {ydn.crm.sugar.model.Record} parent
 * @constructor
 * @extends {ydn.crm.sugar.model.Group}
 * @struct
 */
ydn.crm.sugar.model.EmailGroup = function(parent) {
  goog.base(this, parent, 'email');
};
goog.inherits(ydn.crm.sugar.model.EmailGroup, ydn.crm.sugar.model.Group);


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.EmailGroup.prototype.listFields = function() {
  var email = this.module.value('email');
  if (goog.isArray(email)) {
    // Bean format
    var beans = /** @type {Array.<SugarCrm.EmailField>} */ (/** @type {*} */ (email));
    return beans.map(function(x) {
      return x.email_address_id;
    });
  } else {
    var module_info = this.module.getModuleInfo();
    var emails = [];
    for (var name in module_info.module_fields) {
      var field = module_info.module_fields[name];
      if (field.group == 'email') {
        emails.push(name);
      }
    }
    return emails;
  }
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.EmailGroup.prototype.createOrGetFieldModel = function(name) {
  var index = this.fields.indexOf(name);
  if (index >= 0) {
    return this.fields[index];
  }
  var f = new ydn.crm.sugar.model.EmailField(this, name);
  this.fields.push(f);
  return f;
};


/**
 * @return {boolean}
 */
ydn.crm.sugar.model.EmailGroup.prototype.isBean = function() {
  var email = this.module.value('email');
  return goog.isArray(email);
};


/**
 * Check existence of a field name.
 * @param {string} name
 * @return {boolean}
 */
ydn.crm.sugar.model.EmailGroup.prototype.hasField = function(name) {
  var email = this.module.value('email');
  if (goog.isArray(email)) {
    var beans = /** @type {Array.<SugarCrm.EmailField>} */ (/** @type {*} */ (email));
    return beans.some(function(x) {
      return x.email_address_id == name;
    });
  } else {
    return goog.base(this, 'hasField', name);
  }
};


/**
 * Return email value by email id.
 * @param {string} name
 * @return {?string}
 */
ydn.crm.sugar.model.EmailGroup.prototype.getFieldValueByEmailId = function(name) {
  var email = this.module.value('email');
  if (goog.isArray(email)) {
    var beans = /** @type {Array.<SugarCrm.EmailField>} */ (/** @type {*} */ (email));
    for (var i = 0; i < beans.length; i++) {
      var obj = beans[i];
      if (obj.email_address_id == name) {
        return obj.email_address;
      }
    }
    return null;
  } else {
    return this.module.value(name);
  }
};


/**
 * Check email opt in status.
 * @param {string} name
 * @return {?boolean}
 */
ydn.crm.sugar.model.EmailGroup.prototype.isOptOut = function(name) {
  var email = this.module.value('email');
  if (goog.isArray(email)) {
    var beans = /** @type {Array.<SugarCrm.EmailField>} */ (/** @type {*} */ (email));
    for (var i = 0; i < beans.length; i++) {
      var obj = beans[i];
      if (obj.email_address_id == name) {
        return obj.opt_out == '1';
      }
    }
    return null;
  } else if (name == 'email') {
    return this.module.value('email_opt_out') == '1';
  } else {
    return null;
  }
};


/**
 * Get all emails as normalized form of EmailBean.
 * @return {Array.<SugarCrm.EmailField>} list of all emails.
 */
ydn.crm.sugar.model.EmailGroup.prototype.getEmails = function() {
  var email = this.module.value('email');
  if (goog.isArray(email)) {
    // Bean format
    return /** @type {Array.<SugarCrm.EmailField>} */ (/** @type {*} */ (email));
  } else {
    var module_info = this.module.getModuleInfo();
    var emails = [];
    for (var name in module_info.module_fields) {
      var field = module_info.module_fields[name];
      if (field.group == 'email') {
        emails.push({
          'email_address_id': name,
          'email_address': this.module.value(name),
          'primary_address': emails.length == 0 ? '1' : '0'
        });
      }
    }
    return emails;
  }
};

