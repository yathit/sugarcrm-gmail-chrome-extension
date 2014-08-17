/**
 * @fileoverview Login task.
 */

goog.provide('ydn.crm.ui.SidebarHeader');
goog.require('goog.log');
goog.require('goog.ui.Component');
goog.require('ydn.crm.base');



/**
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.SidebarHeader = function(opt_dom) {
  goog.base(this, opt_dom);
};
goog.inherits(ydn.crm.ui.SidebarHeader, goog.ui.Component);


/**
 * @inheritDoc
 */
ydn.crm.ui.SidebarHeader.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.dom_;
  goog.dom.classlist.add(root, 'sugarcrm-link-panel');
  var a = dom.createElement('a');
  a.textContent = 'Setup';
  a.href = chrome.extension.getURL(ydn.crm.base.SETUP_PAGE) + '#modal';
  a.className = 'setup-link maia-button blue';
  a.setAttribute('data-window-height', '600');
  a.setAttribute('data-window-width', '800');
  root.appendChild(a);
  goog.style.setElementShown(root, false);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.SidebarHeader.prototype.setModel = function(m) {
  goog.base(this, 'setModel', m);
  var has_sugar = goog.isArray(m) && m.length > 0;
  goog.style.setElementShown(this.getElement(), !has_sugar);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.SidebarHeader.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var handler = this.getHandler();

  var a_grant = this.getElement().querySelector('a.setup-link');
  handler.listen(a_grant, 'click', ydn.crm.base.openPageAsDialog, true);

};



