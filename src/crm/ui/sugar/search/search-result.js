/**
 * @fileoverview Panel to synchronize SugarCRM and GData Contact.
 */



goog.provide('ydn.crm.ui.sugar.SearchResult');
goog.require('goog.ui.Container');
goog.require('ydn.crm.inj.sugar.module.Record');
goog.require('ydn.crm.sugar.model.Result');
goog.require('ydn.crm.ui.sugar.SearchResultRenderer');



/**
 * Panel to synchronize SugarCRM and GData Contact.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.sugar.model.Result} model
 * @param {boolean=} opt_show_summary
 * @constructor
 * @struct
 * @extends {goog.ui.Control}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.SearchResult = function(dom, model, opt_show_summary) {
  goog.base(this, null, null, dom);
  this.setModel(model);
  this.setHandleMouseEvents(false);
  this.setAllowTextSelection(true);
  this.setAutoStates(goog.ui.Component.State.ALL, false);
  var r = new ydn.crm.sugar.Record(model.getDomain(), model.getModuleName());
  var r_model = new ydn.crm.sugar.model.Record(model.getParent(), r);
  this.record_panel = new ydn.crm.inj.sugar.module.Record(r_model, null, dom);
  this.addChild(this.record_panel, true);
  this.getHandler().listen(model, goog.events.EventType.CHANGE, this.handleRecordChange, true);
};
goog.inherits(ydn.crm.ui.sugar.SearchResult, goog.ui.Control);


/**
 * @return {ydn.crm.sugar.model.Result}
 */
ydn.crm.ui.sugar.SearchResult.prototype.getModel;


/**
 * @return {ydn.crm.inj.sugar.module.Record}
 */
ydn.crm.ui.sugar.SearchResult.prototype.getRecordPanel = function() {
  return this.record_panel;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.SearchResult.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.ui.sugar.SearchResultRenderer.CSS_CLASS_CONTENT,
      this.getElement());
};


/**
 * Handle model change.
 * @param e
 */
ydn.crm.ui.sugar.SearchResult.prototype.handleRecordChange = function(e) {
  var record = /** @type {ydn.crm.sugar.model.Record} */ (this.record_panel.getModel());
  var result = this.getModel();
  var r = result.getRecord();
  record.setRecord(r ? r.getRecord() : null);
  var redenerer = /** @type {ydn.crm.ui.sugar.SearchResultRenderer} */ (this.getRenderer());
  redenerer.refresh(this);
  this.record_panel.refresh(e);
};


goog.ui.registry.setDefaultRenderer(ydn.crm.ui.sugar.SearchResult,
    ydn.crm.ui.sugar.SearchResultRenderer);
