/**
 * @fileoverview Feed panel show relevant record from the SugarCRM relative to
 * current gmail inbox contact.
 *
 * This panel two components: Header and Body.
 */


goog.provide('ydn.crm.inj.sugar.FeedBody');
goog.require('goog.ui.Container');
goog.require('ydn.crm.inj.sugar.FeedBodyRenderer');
goog.require('ydn.crm.sugar');



/**
 * Contact sidebar panel.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.inj.sugar.model.GDataSugar} model model
 * @constructor
 * @struct
 * @extends {goog.ui.Container}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.FeedBody = function(dom, model) {
  var renderer = ydn.crm.inj.sugar.FeedBodyRenderer.getInstance();
  goog.base(this, goog.ui.Container.Orientation.VERTICAL, renderer, dom);
  this.setModel(model);
  /**
   * Object pool for module panels.
   * @final
   * @type {Array.<!ydn.crm.inj.sugar.module.GDataPanel>}
   */
  this.panel_pool = [];
};
goog.inherits(ydn.crm.inj.sugar.FeedBody, goog.ui.Container);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.FeedBody.DEBUG = false;


/**
 * @return {!ydn.crm.inj.sugar.model.GDataSugar}
 * @override
 */
ydn.crm.inj.sugar.FeedBody.prototype.getModel;


/**
 * @override
 */
ydn.crm.inj.sugar.FeedBody.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.FeedBodyRenderer.CSS_CLASS_CONTENT,
      this.getElement());
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.FeedBody.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.getModel(), ydn.crm.sugar.model.events.Type.CONTEXT_DATA_CHANGE,
      this.refresh);
};


/**
 * Obtain a free module panel form object pool.
 * @param {ydn.crm.sugar.ModuleName} type panel type or module name.
 * @return {!ydn.crm.inj.sugar.module.GDataPanel}
 */
ydn.crm.inj.sugar.FeedBody.prototype.popPanel = function(type) {
  for (var i = 0; i < this.panel_pool.length; i++) {
    var panel = this.panel_pool[i];
    if (panel.getModuleName() == type) {
      goog.array.removeAt(this.panel_pool, i);
      return panel;
    }
  }
  var model = this.getModel();
  var m = model.getRecordModel(type);
  return new ydn.crm.inj.sugar.module.GDataPanel(this.getDomHelper(), m);
};


/**
 * Free panel if no longer use.
 * @param {ydn.crm.inj.sugar.module.GDataPanel} panel
 */
ydn.crm.inj.sugar.FeedBody.prototype.freePanel = function(panel) {
  if (panel) {
    this.panel_pool.push(panel);
  }
};


/**
 * Refresh view due to change in model.
 * @param {ydn.crm.sugar.model.events.Event} e
 */
ydn.crm.inj.sugar.FeedBody.prototype.refresh = function(e) {
  var model = this.getModel();
  var root = this.getElement();
  var r = /** {ydn.crm.inj.sugar.FeedBodyRenderer} */ (this.getRenderer());
  r.refresh(root, model);

  if (e.type == ydn.crm.sugar.model.events.Type.CONTEXT_DATA_CHANGE) {
    // this event is not propage to module
    for (var i = this.getChildCount() - 1; i >= 0; i--) {
      var p_panel = /** @type {ydn.crm.inj.sugar.module.GDataPanel} */ (this.getChildAt(i));
      p_panel.refresh(e);
    }
  }
};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.FeedBody,
    ydn.crm.inj.sugar.FeedBodyRenderer);
