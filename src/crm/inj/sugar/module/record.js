/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This is container for group panel and has some controls to viewing and editing.
 */


goog.provide('ydn.crm.inj.sugar.module.Record');
goog.require('goog.ui.Control');
goog.require('ydn.crm.inj.sugar.module.Field');
goog.require('ydn.crm.inj.sugar.module.RecordRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.Sugar');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Record} model
 * @param {goog.ui.ControlRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Control}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @implements {ydn.crm.ui.Refreshable}
 */
ydn.crm.inj.sugar.module.Record = function(model, opt_renderer, opt_dom) {
  var renderer = opt_renderer || ydn.crm.inj.sugar.module.RecordRenderer.getInstance(); // needed?
  goog.base(this, null, renderer, opt_dom);
  goog.asserts.assert(model);
  this.setModel(model);
};
goog.inherits(ydn.crm.inj.sugar.module.Record, goog.ui.Control);


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.Record.NEW_RECORD_EVENT = 'new-record';


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.module.Record.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.sugar.module.Record');


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.Record.DEBUG = false;


/**
 * @return {ydn.crm.inj.sugar.module.RecordRenderer}
 * @override
 */
ydn.crm.inj.sugar.module.Record.prototype.getRenderer;


/**
 * @return {ydn.crm.sugar.model.Record}
 * @override
 */
ydn.crm.inj.sugar.module.Record.prototype.getModel;


/**
 * @override
 */
ydn.crm.inj.sugar.module.Record.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.RecordRenderer.CSS_CLASS_CONTENT,
      this.getElement());
};


/**
 * Update model. Module may change.
 * @param {ydn.crm.sugar.Record} r
 */
ydn.crm.inj.sugar.module.Record.prototype.updateModel = function(r) {

};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.Record.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  var model = this.getModel();
  if (model) {
    hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, this.refresh);
  }
  var renderer = /** @type {ydn.crm.inj.sugar.module.RecordRenderer} */ (this.getRenderer());
  hd.listen(renderer.getViewButton(this.getElement()), 'click', this.toggleView, false);
};


/**
 * Toggle show/hide panel.
 * @param {Event} e
 */
ydn.crm.inj.sugar.module.Record.prototype.toggleView = function(e) {
  e.preventDefault();
  // console.log('toggle', e.target);
  var renderer = /** @type {ydn.crm.inj.sugar.module.RecordRenderer} */ (this.getRenderer());
  renderer.toggleView(this.getElement());
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.Record.prototype.refresh = function(e) {
  var model = this.getModel();
  var root = this.getElement();
  var renderer = this.getRenderer();
  var record = model.getRecord();
  if (ydn.crm.inj.sugar.module.Record.DEBUG) {
    window.console.log('module body ' + model.getModuleName() + ' refresh for ' + e.type, record);
  }
  if (record) {
    goog.style.setElementShown(root, true);
  } else {
    goog.style.setElementShown(root, false);
    return;
  }

  if (e && e.type == ydn.crm.sugar.model.events.Type.RECORD_CHANGE) {
    renderer.reset(this.getElement());
  }

  for (var i = 0; i < this.getChildCount(); i++) {
    var child = this.getChildAt(i);
    if (child instanceof ydn.crm.inj.sugar.module.Group) {
      var g = /** @type {ydn.crm.inj.sugar.module.Group} */ (child);
      g.refresh();
    } else if (child instanceof ydn.crm.inj.sugar.module.group.Address) {
      var a = /** @type {ydn.crm.inj.sugar.module.group.Address} */ (child);
      a.refresh();
    }
  }

};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.Record,
    ydn.crm.inj.sugar.module.RecordRenderer);

