/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.GroupRenderer');
goog.require('goog.ui.ControlRenderer');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.GroupRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.GroupRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.module.GroupRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.GroupRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.GroupRenderer.CSS_CLASS = 'record-group';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.GroupRenderer.CSS_CONTENT_CLASS = 'content';


/** @return {string} */
ydn.crm.inj.sugar.module.GroupRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.GroupRenderer.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.GroupRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var ctrl = /** @type {ydn.crm.inj.sugar.module.Group} */ (x);
  var dom = ctrl.getDomHelper();
  var head = dom.createDom('div');
  var content = dom.createDom('div', ydn.crm.inj.sugar.module.GroupRenderer.CSS_CONTENT_CLASS);
  root.appendChild(head);
  root.appendChild(content);
  ctrl.setElementInternal(root);
  var group_name = ctrl.getModel().getGroupName();
  root.setAttribute('name', group_name);

  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = ctrl.getModel();
  var groups = model.listFields();
  var ren = ydn.crm.inj.sugar.module.FieldRenderer.getInstance();
  for (var i = 0; i < groups.length; i++) {
    var name = groups[i];
    var field_model = model.createOrGetFieldModel(name);
    var field = new ydn.crm.inj.sugar.module.Field(field_model, ren, dom);
    ctrl.addChild(field, true);
  }

  if (model.isNormallyHide()) {
    root.classList.add('normally-hide');
  }

  return root;
};




