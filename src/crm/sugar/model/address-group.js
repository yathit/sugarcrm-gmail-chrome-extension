
/**
 * @fileoverview Group model for 'name' group fields.
 *
 *
 */


goog.provide('ydn.crm.sugar.model.AddressGroup');
goog.require('ydn.crm.sugar.model.BaseGroup');



/**
 * Group model for 'email' group fields.
 * @param {ydn.crm.sugar.model.Record} parent
 * @param {string} group_name group name, should be 'alt_address', 'primary_address'
 * or 'address'.
 * @constructor
 * @extends {ydn.crm.sugar.model.BaseGroup}
 * @struct
 */
ydn.crm.sugar.model.AddressGroup = function(parent, group_name) {
  goog.base(this, parent, group_name);
};
goog.inherits(ydn.crm.sugar.model.AddressGroup, ydn.crm.sugar.model.BaseGroup);


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.AddressGroup.prototype.getGroupLabel = function() {
  return 'Name';
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.AddressGroup.prototype.hasGroupValue = function() {
  return !!this.getGroupLabel();
};


/**
 * Get address field value by address field.
 * @param {string} fn address field name, such as 'city', 'country', etc.
 * @return {?string}
 */
ydn.crm.sugar.model.AddressGroup.prototype.getValueByAddressField = function(fn) {
  var field_name = this.getGroupName() + '_' + fn;
  return this.module.value(field_name);
};


/**
 * Get one linear short label for this address.
 * Eg: Salt Lake City, 91691 NY, USA
 * @return {string}
 * @override
 */
ydn.crm.sugar.model.AddressGroup.prototype.getGroupValue = function() {

  // A typical SugarCRM address:
  /*
   primary_address_city: "Denver"
   primary_address_country: "USA"
   primary_address_postalcode: "12477"
   primary_address_state: "CA"
   primary_address_street: "345 Sugar Blvd."
   primary_address_street_2: ""
   primary_address_street_3: ""
   */
  /*
   alt_address_city: ""
   alt_address_country: ""
   alt_address_postalcode: ""
   alt_address_state: ""
   alt_address_street: ""
   alt_address_street_2: ""
   alt_address_street_3: ""
   */

  var country = this.getValueByAddressField('country');
  var city = this.getValueByAddressField('city');
  var state = this.getValueByAddressField('state');
  var code = this.getValueByAddressField('postalcode');
  var label = '';
  if (country) {
    label += country;
  }
  if (state) {
    if (code) {
      label = state + ' ' + code + ', ' + label;
    } else {
      label += ' ' + state;
    }
  } else if (code) {
    label += ' ' + code;
  }
  if (!label) {
    label = this.getValueByAddressField('street') || '';
  }
  if (!label) {
    label = this.getValueByAddressField('street_2') || '';
  }
  if (city) {
    label = city + ' ' + label;
  }

  return label;
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.AddressGroup.prototype.getAdditionalOptions = function() {
  return {
    label: 'Edit',
    name: ydn.crm.sugar.model.Field.Command.EDIT,
    type: 'text'
  };
};
