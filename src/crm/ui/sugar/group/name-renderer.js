/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.NameRenderer');
goog.require('ydn.crm.ui.sugar.group.GroupRenderer');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.GroupRenderer}
 */
ydn.crm.ui.sugar.group.NameRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.ui.sugar.group.NameRenderer, ydn.crm.ui.sugar.group.GroupRenderer);
goog.addSingletonGetter(ydn.crm.ui.sugar.group.NameRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.group.NameRenderer.DEBUG = goog.DEBUG;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.NameRenderer.CSS_CLASS = 'name';


/** @return {string} */
ydn.crm.ui.sugar.group.NameRenderer.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.group.NameRenderer.CSS_CLASS;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.NameRenderer.CSS_CONTENT_CLASS = 'content';


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.NameRenderer.prototype.createDom = function(x) {
  var dom = x.getDomHelper();
  var root = dom.createDom('div', this.getCssClass());
  var ctrl = /** @type {ydn.crm.ui.sugar.group.Name} */ (x);
  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = ctrl.getModel();
  root.setAttribute('name', model.getGroupName());
  root.classList.add(ydn.crm.ui.sugar.group.GroupRenderer.CSS_CLASS);
  var head = dom.createDom('div');
  head.setAttribute('title', model.getGroupLabel());
  root.appendChild(head);
  var content = dom.createDom('div', ydn.crm.ui.sugar.group.NameRenderer.CSS_CONTENT_CLASS);
  root.appendChild(head);
  root.appendChild(content);

  ctrl.setElementInternal(root);


  var fields = model.listFields();

  var field_model, field;
  if (model.hasField('salutation')) {
    field_model = model.createOrGetFieldModel('salutation');
    field = new ydn.crm.ui.sugar.field.Field(field_model, null, dom);
    ctrl.addChild(field, true);
  }
  if (model.hasField('first_name')) {
    ctrl.addChild(new ydn.crm.ui.sugar.field.Field(model.createOrGetFieldModel('first_name'),
        null, dom), true);
  }
  if (model.hasField('last_name')) {
    ctrl.addChild(new ydn.crm.ui.sugar.field.Field(model.createOrGetFieldModel('last_name'),
        null, dom), true);
  }

  return root;
};




