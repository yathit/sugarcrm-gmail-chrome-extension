/**
 * @fileoverview Panel to synchronize SugarCRM and GData Contact.
 */



goog.provide('ydn.crm.ui.sugar.Record');
goog.require('goog.ui.Container');
goog.require('ydn.crm.inj.sugar.RecordRenderer');



/**
 * Panel to synchronize SugarCRM and GData Contact.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.sugar.model.Module} model
 * @constructor
 * @struct
 * @extends {goog.ui.Control}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.Record = function(dom, model) {
  goog.base(this, null, null, dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.ui.sugar.Record, goog.ui.Control);


/**
 * @return {ydn.crm.sugar.model.Module}
 */
ydn.crm.ui.sugar.Record.prototype.getModel;


goog.ui.registry.setDefaultRenderer(ydn.crm.ui.sugar.Record,
    ydn.crm.inj.sugar.RecordRenderer);
