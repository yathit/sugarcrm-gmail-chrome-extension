/**
 * @fileoverview Panel for group of field in a module.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.Address');
goog.require('ydn.crm.ui.sugar.group.AddressRenderer');
goog.require('ydn.crm.ui.sugar.group.Group');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Group} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.Group}
 */
ydn.crm.ui.sugar.group.Address = function(model, opt_dom) {
  var renderer = ydn.crm.ui.sugar.group.AddressRenderer.getInstance();
  goog.base(this, model, renderer, opt_dom);
};
goog.inherits(ydn.crm.ui.sugar.group.Address, ydn.crm.ui.sugar.group.Group);


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Address.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.sugar.group.AddressRenderer.CSS_CONTENT_CLASS);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Address.prototype.enterDocument = function() {
  this.getHandler().listen(this.getElement().querySelector('summary'), 'click', this.handleSummaryClick);
};


/**
 * @param {Event} e
 */
ydn.crm.ui.sugar.group.Address.prototype.handleSummaryClick = function(e) {
  var parent = e.target.parentElement;
  if (parent.tagName == goog.dom.TagName.DETAILS) {
    if (parent.hasAttribute('open')) {
      e.target.textContent = this.getLabel();
    } else {
      e.target.textContent = this.getModel().getGroupLabel();
    }
  }
};


/**
 * Get one linear short label for this address.
 * Eg: Salt Lake City, 91691 NY, USA
 * @return {string}
 */
ydn.crm.ui.sugar.group.Address.prototype.getLabel = function() {

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
  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = this.getModel();
  var country = model.getFieldModelByName('primary_address_country') ||
      model.getFieldModelByName('alt_address_country');
  var city = model.getFieldModelByName('primary_address_city') ||
      model.getFieldModelByName('alt_address_city');
  var state = model.getFieldModelByName('primary_address_state') ||
      model.getFieldModelByName('alt_address_state');
  var code = model.getFieldModelByName('primary_address_postalcode') ||
      model.getFieldModelByName('alt_address_postalcode');
  var label = '';
  if (country) {
    label += country.getFieldValue();
  }
  if (state && state.hasFieldValue()) {
    if (code && code.hasFieldValue()) {
      label = state.getFieldValue() + ' ' + code.getFieldValue() + ', ' + label;
    } else {
      label += ' ' + state.getFieldValue();
    }
  } else if (code && code.hasFieldValue()) {
    label += ' ' + code.getFieldValue();
  }
  if (!label) {
    var st = model.getFieldModelByName('primary_address_street') ||
        model.getFieldModelByName('alt_address_street');
    if (st) {
      label = st.getFieldValue();
    }
  }
  if (!label) {
    var st2 = model.getFieldModelByName('alt_address_street_2') ||
        model.getFieldModelByName('alt_address_street_2');
    if (st2) {
      label = st2.getFieldValue();
    }
  }
  if (city && city.hasFieldValue()) {
    label = city.getFieldValue() + ' ' + label;
  }

  return label || model.getGroupLabel();
};


/**
 * refresh.
 */
ydn.crm.ui.sugar.group.Address.prototype.refresh = function() {
  var summary = this.getElement().querySelector('summary');
  summary.textContent = this.getLabel();
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.ui.sugar.field.Field} */ (this.getChildAt(i));
    child.refresh();
  }
};


