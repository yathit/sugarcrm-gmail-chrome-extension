/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.GroupRenderer');
goog.require('goog.ui.ControlRenderer');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 */
ydn.crm.ui.sugar.group.GroupRenderer = function() {

};
goog.addSingletonGetter(ydn.crm.ui.sugar.group.GroupRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.group.GroupRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.GroupRenderer.CSS_CLASS = 'record-group';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.GroupRenderer.CSS_CONTENT_CLASS = 'content';


/** @return {string} */
ydn.crm.ui.sugar.group.GroupRenderer.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.group.GroupRenderer.CSS_CLASS;
};


/**
 * @param {ydn.crm.ui.sugar.group.Group} ctrl
 * @return {Element}
 */
ydn.crm.ui.sugar.group.GroupRenderer.prototype.createDom = function(ctrl) {
  var dom = ctrl.getDomHelper();
  var root = dom.createDom('div', this.getCssClass());
  var head = dom.createDom('div');
  var content = dom.createDom('div', ydn.crm.ui.sugar.group.GroupRenderer.CSS_CONTENT_CLASS);
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
  var ren = ydn.crm.ui.sugar.field.FieldRenderer.getInstance();
  for (var i = 0; i < groups.length; i++) {
    var name = groups[i];
    var field_model = model.createOrGetFieldModel(name);
    var field = new ydn.crm.ui.sugar.field.Field(field_model, ren, dom);
    ctrl.addChild(field, true);
  }

  if (model.isNormallyHide()) {
    root.classList.add('normally-hide');
  }

  return root;
};




