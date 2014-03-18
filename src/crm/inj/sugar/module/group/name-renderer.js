/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.group.NameRenderer');
goog.require('goog.ui.ControlRenderer');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.group.NameRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.group.NameRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.module.group.NameRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.group.NameRenderer.DEBUG = goog.DEBUG;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.group.NameRenderer.CSS_CLASS = 'name';


/** @return {string} */
ydn.crm.inj.sugar.module.group.NameRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.group.NameRenderer.CSS_CLASS;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.group.NameRenderer.CSS_CONTENT_CLASS = 'content';


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.group.NameRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var ctrl = /** @type {ydn.crm.inj.sugar.module.Group} */ (x);
  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = ctrl.getModel();
  var dom = ctrl.getDomHelper();
  root.setAttribute('name', model.getGroupName());
  root.classList.add(ydn.crm.inj.sugar.module.GroupRenderer.CSS_CLASS);
  var head = dom.createDom('div');
  head.setAttribute('title', model.getGroupLabel());
  root.appendChild(head);
  var content = dom.createDom('div', ydn.crm.inj.sugar.module.group.NameRenderer.CSS_CONTENT_CLASS);
  root.appendChild(head);
  root.appendChild(content);

  ctrl.setElementInternal(root);


  var fields = model.listFields();
  var ren = ydn.crm.inj.sugar.module.SimpleFieldRenderer.getInstance();
  var field_model, field;
  if (model.hasField('salutation')) {
    field_model = model.getFieldModel('salutation');
    field = new ydn.crm.inj.sugar.module.Field(field_model, ren, dom);
    ctrl.addChild(field, true);
  }
  ctrl.addChild(new ydn.crm.inj.sugar.module.Field(model.getFieldModel('first_name'),
      ren, dom), true);
  ctrl.addChild(new ydn.crm.inj.sugar.module.Field(model.getFieldModel('last_name'),
      ren, dom), true);

  return root;
};




