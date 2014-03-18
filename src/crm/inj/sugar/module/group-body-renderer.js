/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.GroupBodyRenderer');
goog.require('goog.dom.forms');
goog.require('goog.ui.ContainerRenderer');
goog.require('ydn.crm.sugar.model.GDataSugar');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ContainerRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.GroupBodyRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.GroupBodyRenderer, goog.ui.ContainerRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.module.GroupBodyRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.GroupBodyRenderer.DEBUG = goog.DEBUG;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.GroupBodyRenderer.CSS_CLASS = 'record-group';


/** @return {string} */
ydn.crm.inj.sugar.module.GroupBodyRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.GroupBodyRenderer.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.GroupBodyRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var body = /** @type {ydn.crm.inj.sugar.module.GroupBody} */ (x);
  body.setElementInternal(root);

  goog.dom.classes.add(root, this.getCssClass());
  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = body.getModel();
  var dom = body.getDomHelper();
  var groups = model.listFields();
  for (var i = 0; i < groups.length; i++) {
    var name = groups[i];
    var field_model = model.getFieldModel(name);
    var ren = ydn.crm.inj.sugar.module.FieldRenderer.getInstance();
    var field = new ydn.crm.inj.sugar.module.Field(field_model, ren, dom);
    body.addChild(field, true);
  }


  return root;
};




