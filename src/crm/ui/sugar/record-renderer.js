/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.RecordRenderer');
goog.require('goog.dom.forms');
goog.require('goog.ui.ControlRenderer');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.RecordRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.RecordRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.RecordRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.RecordRenderer.DEBUG = goog.DEBUG;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.RecordRenderer.CSS_CLASS = 'record';


/** @return {string} */
ydn.crm.inj.sugar.RecordRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.RecordRenderer.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.RecordRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var body = /** @type {ydn.crm.ui.sugar.Record} */ (x);


  return root;
};




