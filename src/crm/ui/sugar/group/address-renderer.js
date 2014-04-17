/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.AddressRenderer');
goog.require('ydn.crm.ui.sugar.group.GroupRenderer');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.GroupRenderer}
 */
ydn.crm.ui.sugar.group.AddressRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.ui.sugar.group.AddressRenderer, ydn.crm.ui.sugar.group.GroupRenderer);
goog.addSingletonGetter(ydn.crm.ui.sugar.group.AddressRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.group.AddressRenderer.DEBUG = goog.DEBUG;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.AddressRenderer.CSS_CLASS = 'address';


/** @return {string} */
ydn.crm.ui.sugar.group.AddressRenderer.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.group.AddressRenderer.CSS_CLASS;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.AddressRenderer.CSS_CONTENT_CLASS = 'content';


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.AddressRenderer.prototype.createDom = function(x) {
  var dom = x.getDomHelper();
  var root = dom.createDom('div', this.getCssClass());
  var ctrl = /** @type {ydn.crm.ui.sugar.group.Address} */ (x);
  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = ctrl.getModel();
  root.setAttribute('name', model.getGroupName());
  root.classList.add(ydn.crm.ui.sugar.group.GroupRenderer.CSS_CLASS);
  var details = dom.createDom('details');
  var head = dom.createDom('summary');
  head.textContent = model.getGroupLabel();
  root.appendChild(head);
  var content = dom.createDom('div', ydn.crm.ui.sugar.group.AddressRenderer.CSS_CONTENT_CLASS);
  details.appendChild(head);
  details.appendChild(content);
  root.appendChild(details);
  ctrl.setElementInternal(root);
  var fields = model.listFields();

  for (var i = 0; i < fields.length; i++) {
    var name = fields[i];
    var field_model = model.createOrGetFieldModel(name);
    var field = new ydn.crm.ui.sugar.field.Field(field_model, null, dom);
    ctrl.addChild(field, true);
  }

  return root;
};




