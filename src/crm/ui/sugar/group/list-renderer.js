/**
 * @fileoverview Panel renderer for listed items.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.ListRenderer');
goog.require('goog.ui.ControlRenderer');



/**
 * Panel renderer for listed items.
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.GroupRenderer}
 */
ydn.crm.ui.sugar.group.ListRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.ui.sugar.group.ListRenderer, ydn.crm.ui.sugar.group.GroupRenderer);
goog.addSingletonGetter(ydn.crm.ui.sugar.group.ListRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.group.ListRenderer.DEBUG = goog.DEBUG;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.ListRenderer.CSS_CLASS = 'list';


/** @return {string} */
ydn.crm.ui.sugar.group.ListRenderer.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.group.ListRenderer.CSS_CLASS;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.ListRenderer.CSS_CONTENT_CLASS = 'content';


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.ListRenderer.prototype.createDom = function(x) {
  var dom = x.getDomHelper();
  var root = dom.createDom('div', this.getCssClass());
  var ctrl = /** @type {ydn.crm.ui.sugar.group.List} */ (x);
  /**
   * @type {ydn.crm.sugar.model.Group}
   */
  var model = ctrl.getModel();
  root.setAttribute('name', model.getGroupName());
  root.classList.add(ydn.crm.ui.sugar.group.GroupRenderer.CSS_CLASS);
  var head = dom.createDom('div');
  head.setAttribute('title', model.getGroupLabel());
  root.appendChild(head);
  var content = dom.createDom('div', ydn.crm.ui.sugar.group.ListRenderer.CSS_CONTENT_CLASS);
  root.appendChild(head);
  root.appendChild(content);

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




