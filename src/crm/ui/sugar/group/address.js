/**
 * @fileoverview Panel for group of field in a module.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.Address');
goog.require('ydn.crm.ui.sugar.group.SimpleGroup');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.AddressGroup} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.SimpleGroup}
 */
ydn.crm.ui.sugar.group.Address = function(model, opt_dom) {
  goog.base(this, model, null, opt_dom);
  /**
   * User edited value.
   * @type {?Object}
   * @private
   */
  this.patches_ = null;
};
goog.inherits(ydn.crm.ui.sugar.group.Address, ydn.crm.ui.sugar.group.SimpleGroup);


/**
 * @return {ydn.crm.sugar.model.AddressGroup}
 * @override
 */
ydn.crm.ui.sugar.group.Address.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Address.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var input = this.getElement().querySelector('input');
  input.setAttribute('disabled', '1');
};


/**
 * Get active field value, i.e., if user edited, it is user edited value, otherwise
 * model field value.
 * @param {string} name field name.
 * @return {?string}
 * @protected
 */
ydn.crm.ui.sugar.group.Address.prototype.getActiveFieldValue = function(name) {
  if (this.patches_ && this.patches_[name]) {
    return this.patches_[name];
  } else {
    var model = this.getModel();
    return model.getFieldAsValue(name);
  }
};


/**
 * Set patch value.
 * @param {string} name field name.
 * @param {string} value
 */
ydn.crm.ui.sugar.group.Address.prototype.setPatchFieldValue = function(name, value) {
  if (!this.patches_) {
    this.patches_ = {};
  }
  this.patches_[name] = value;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Address.prototype.getTemplateData = function() {

  var model = this.getModel();
  var data = [];
  var module_info = model.getModuleInfo();

  var group_name = model.getGroupName();
  for (var name in module_info.module_fields) {
    var field = module_info.module_fields[name];
    if (field.group == group_name) {
      data.push({
        name: name,
        label: field.label,
        type: field.type,
        value: this.getActiveFieldValue(name),
        listId: ydn.crm.ui.sugar.field.FieldRenderer.getDataList(model.getModuleName(),
            field)
      });
    }
  }

  return {
    fields: data
  };
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Address.prototype.fillByMetaContact = function(meta) {
  if (!meta) {
    return false;
  }
  var location = meta.getLocationDeduced();
  var modified = false;
  if (location) {
    var model = this.getModel();
    var prefix = this.getGroupName() + '_';
    if (!this.getActiveFieldValue(prefix + 'country') &&
        !!location.country) {
      if (!!location.country.code) {
        this.setPatchFieldValue(prefix + 'country', location.country.code);
        modified = true;
      } else if (!!location.country.name) {
        this.setPatchFieldValue(prefix + 'country', location.country.name);
        modified = true;
      }
    }
    if (!this.getActiveFieldValue(prefix + 'city') &&
        !!location.city && !!location.city.name) {
      this.setPatchFieldValue(prefix + 'city', location.city.name);
      modified = true;
    }
    if (!this.getActiveFieldValue(prefix + 'state') &&
        !!location.state && !!location.state.name) {
      this.setPatchFieldValue(prefix + 'state', location.state.name);
      modified = true;
    }
    if (modified) {
      var label = this.getGroupValue();
      this.setInputValue(label);
    }
  }
  return modified;
};


/**
 * Return group value from user patch and model value.
 * @return {string}
 */
ydn.crm.ui.sugar.group.Address.prototype.getGroupValue = function() {
  var model = this.getModel();
  if (this.patches_) {
    var prefix = this.getGroupName() + '_';
    var country = this.getActiveFieldValue(prefix + 'country');
    var city = this.getActiveFieldValue(prefix + 'city');
    var state = this.getActiveFieldValue(prefix + 'state');
    var postalcode = this.getActiveFieldValue(prefix + 'postalcode');
    var street = this.getActiveFieldValue(prefix + 'street');
    var street_2 = this.getActiveFieldValue(prefix + 'street_2');
    var label = ydn.crm.sugar.model.AddressGroup.makeGroupValue(country, city, state,
        postalcode, street, street_2);
    return label;
  } else {
    return model.getGroupValue();
  }
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Address.prototype.doEditorApplyDefault = function(ev) {
  this.patches_ = ydn.object.clone(ev.patches);
  var label = this.getGroupValue();
  this.setInputValue(label);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Address.prototype.collectData = function() {
  return this.patches_ || null;
};
