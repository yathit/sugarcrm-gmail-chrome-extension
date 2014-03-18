/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.GroupRenderer');
goog.require('goog.ui.ContainerRenderer');



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
  ctrl.setElementInternal(root);
  var name = ctrl.getModel().getGroupName();
  root.setAttribute('name', name);
  var rdr = ydn.crm.inj.sugar.module.GroupBodyRenderer.getInstance();
  var body = new ydn.crm.inj.sugar.module.GroupBody(ctrl.getModel(), rdr, ctrl.getDomHelper());

  ctrl.addChild(body, true);

  return root;
};




