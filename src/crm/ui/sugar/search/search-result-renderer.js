/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.SearchResultRenderer');
goog.require('goog.dom.forms');
goog.require('goog.ui.ControlRenderer');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.SearchResultRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.ui.sugar.SearchResultRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.ui.sugar.SearchResultRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.SearchResultRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS = 'search-result';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_HEADER = 'search-header';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_CONTENT = 'search-body';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_TITLE = 'title';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_ICON = 'icon';


/** @return {string} */
ydn.crm.ui.sugar.SearchResultRenderer.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.SearchResultRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var ctrl = /** @type {ydn.crm.ui.sugar.SearchResult} */ (x);
  var dom = ctrl.getDomHelper();
  var ele_header = dom.createDom('div', ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_HEADER);
  var ele_content = dom.createDom('div', ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_CONTENT);
  root.appendChild(ele_header);
  root.appendChild(ele_content);
  var model = ctrl.getModel();
  var module = model.getModuleName();
  var title = dom.createDom('a', ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_TITLE);
  var icon = dom.createDom('span', {
    'class': ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_ICON
  }, module.substr(0, 2));
  ele_header.appendChild(icon);
  ele_header.appendChild(title);
  ele_header.classList.add(module);
  return root;
};


/**
 * @param {Element} header
 * @param {ydn.crm.sugar.model.Record} record
 * @private
 */
ydn.crm.ui.sugar.SearchResultRenderer.prototype.updateHeader_ = function(header, record) {
  var module = record.getModuleName();
  header.className = ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_HEADER + ' ' +
      module;
  var title = goog.dom.getElementByClass(ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_TITLE,
      header);
  var icon = goog.dom.getElementByClass(ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_ICON,
      header);
  title.textContent = record.getRecord().getTitle();
  icon.textContent = module.substring(0, 2);
  title.href = record.getRecord().getViewLink();
  title.target = record.getDomain();
};


/**
 * Refresh UI.
 * @param {ydn.crm.ui.sugar.SearchResult} ctrl
 */
ydn.crm.ui.sugar.SearchResultRenderer.prototype.refresh = function(ctrl) {
  var model = ctrl.getModel();
  var root = ctrl.getElement();
  /**
   * @type {ydn.crm.sugar.model.Record}
   */
  var record = model.getRecord();
  if (record && record.hasRecord()) {
    var header = goog.dom.getElementByClass(ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_HEADER,
        ctrl.getElement());
    this.updateHeader_(header, record);
    goog.style.setElementShown(root, true);
  } else {
    goog.style.setElementShown(root, false);
  }
};




