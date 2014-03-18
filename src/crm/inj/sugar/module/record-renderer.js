/**
 * @fileoverview Record module panel renderer.
 *
 */


goog.provide('ydn.crm.inj.sugar.module.RecordRenderer');
goog.require('goog.ui.ControlRenderer');
goog.require('ydn.crm.inj.sugar.module.Group');
goog.require('ydn.crm.inj.sugar.module.group.Address');
goog.require('ydn.crm.inj.sugar.module.group.Name');
goog.require('ydn.crm.sugar.model.GDataSugar');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.RecordRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.RecordRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.module.RecordRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.RecordRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS = 'record-body';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_HEADER = 'record-body-header';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_CONTENT = 'record-body-content';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_NAME_VIEW = 'view';


/**
 * @const
 * @type {string} class name for body content when viewing.
 */
ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_VIEW = 'view';


/** @return {string} */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var body = /** @type {ydn.crm.inj.sugar.module.Record} */ (x);
  var dom = body.getDomHelper();

  var header = dom.createDom('div', ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_HEADER);
  var content = dom.createDom('div', ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_CONTENT);
  root.appendChild(header);
  root.appendChild(content);
  body.setElementInternal(root);

  // create ui elements
  var a_view = dom.createDom('a', {
    'name': ydn.crm.inj.sugar.module.RecordRenderer.CSS_NAME_VIEW
  }, 'view');
  a_view.href = '#';
  header.appendChild(a_view);

  var model = body.getModel();
  var groups = model.listGroups();
  var group_renderer = ydn.crm.inj.sugar.module.GroupRenderer.getInstance();
  for (var i = 0; i < groups.length; i++) {
    var name = groups[i];
    var field;
    var field_model = model.getGroupModel(name);
    if (/address/i.test(name)) {
      field = new ydn.crm.inj.sugar.module.group.Address(field_model, dom);
    } else if (name == 'name') {
      field = new ydn.crm.inj.sugar.module.group.Name(field_model, dom);
    } else {
      field = new ydn.crm.inj.sugar.module.Group(field_model, group_renderer, dom);
    }
    body.addChild(field, true);
  }

  return root;
};


/**
 * Get View click control
 * @param {Element} ele ancentor
 * @return {Element}
 */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.getViewButton = function(ele) {
  return ele.querySelector('a[name=' +
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_NAME_VIEW + ']');
};


/**
 * Reset control UI to initial state.
 * @param {Element} ele
 */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.reset = function(ele) {
  var header_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_HEADER, ele);
  var content_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_CONTENT, ele);
  var a_view = this.getViewButton(header_ele);
  a_view.textContent = 'view';
  content_ele.classList.remove(ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_VIEW);
};


/**
 * Toggle view.
 * @param {Element} ele
 */
ydn.crm.inj.sugar.module.RecordRenderer.prototype.toggleView = function(ele) {
  var header_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_HEADER, ele);
  var content_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_CONTENT, ele);
  var a_view = this.getViewButton(header_ele);
  if (content_ele.classList.contains(ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_VIEW)) {
    a_view.textContent = 'view';
    content_ele.classList.remove(ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_VIEW);
  } else {
    a_view.textContent = 'hide';
    content_ele.classList.add(ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_VIEW);
  }
};




