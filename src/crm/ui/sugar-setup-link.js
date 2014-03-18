/**
 * @fileoverview Login task.
 */

goog.provide('ydn.crm.ui.SugarSetupLink');
goog.require('goog.debug.Logger');
goog.require('goog.ui.Component');
goog.require('ydn.crm.base');



/**
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.SugarSetupLink = function(opt_dom) {
  goog.base(this, opt_dom);
};
goog.inherits(ydn.crm.ui.SugarSetupLink, goog.ui.Component);


/**
 * @inheritDoc
 */
ydn.crm.ui.SugarSetupLink.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.dom_;
  goog.dom.classes.add(root, 'sugarcrm-link-panel');
  var a = dom.createElement('a');
  a.textContent = 'Setup SugarCRM';
  a.href = chrome.extension.getURL(ydn.crm.base.OPTION_PAGE) + '#credentials';
  a.className = 'sugarcrm-setup-link';
  root.appendChild(a);
  goog.style.setElementShown(root, false);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.SugarSetupLink.prototype.setModel = function(m) {
  goog.base(this, 'setModel', m);
  var has_sugar = goog.isArray(m) && m.length > 0;
  goog.style.setElementShown(this.getElement(), !has_sugar);
};



