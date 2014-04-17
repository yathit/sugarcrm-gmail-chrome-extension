/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.group.AddressRenderer');
goog.require('goog.ui.ControlRenderer');
goog.require('ydn.crm.inj.sugar.module.SimpleFieldRenderer');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.group.AddressRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.group.AddressRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.module.group.AddressRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.group.AddressRenderer.DEBUG = goog.DEBUG;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.group.AddressRenderer.CSS_CLASS = 'address';


/** @return {string} */
ydn.crm.inj.sugar.module.group.AddressRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.group.AddressRenderer.CSS_CLASS;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.group.AddressRenderer.CSS_CONTENT_CLASS = 'content';


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.group.AddressRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var ctrl = /** @type {ydn.crm.inj.sugar.module.Group} */ (x);
  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = ctrl.getModel();
  var dom = ctrl.getDomHelper();
  root.setAttribute('name', model.getGroupName());
  root.classList.add(ydn.crm.inj.sugar.module.GroupRenderer.CSS_CLASS);
  var details = dom.createDom('details');
  var head = dom.createDom('summary');
  head.textContent = model.getGroupLabel();
  root.appendChild(head);
  var content = dom.createDom('div', ydn.crm.inj.sugar.module.group.AddressRenderer.CSS_CONTENT_CLASS);
  details.appendChild(head);
  details.appendChild(content);
  root.appendChild(details);

  ctrl.setElementInternal(root);


  var fields = model.listFields();
  var ren = ydn.crm.inj.sugar.module.SimpleFieldRenderer.getInstance();
  for (var i = 0; i < fields.length; i++) {
    var name = fields[i];
    var field_model = model.createOrGetFieldModel(name);
    var field = new ydn.crm.inj.sugar.module.Field(field_model, ren, dom);
    ctrl.addChild(field, true);
  }

  return root;
};




