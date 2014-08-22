/**
 * @fileoverview Panel to synchronize SugarCRM and GData Contact.
 */



goog.provide('ydn.crm.ui.sugar.SyncPanel');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Option');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarMenuButton');
goog.require('goog.ui.ToolbarRenderer');
goog.require('goog.ui.ToolbarSelect');
goog.require('goog.ui.ToolbarSeparator');
goog.require('goog.ui.ToolbarToggleButton');
goog.require('templ.ydn.crm.sugar');
goog.require('ydn.crm.inj.ContactModel');
goog.require('ydn.crm.sugar.model.Sugar');
goog.require('ydn.crm.ui.sugar.Record');



/**
 * Panel to synchronize SugarCRM and GData Contact.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.sugar.model.Sugar} model
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.SyncPanel = function(dom, model) {
  goog.base(this, dom);
  this.setModel(model);
  /**
   * @protected
   * @final
   * @type {goog.ui.Component}
   */
  this.content_sugar = new goog.ui.Component(dom);
  /**
   * @protected
   * @final
   * @type {goog.ui.Component}
   */
  this.content_gdata = new goog.ui.Component(dom);
  /**
   * @type {string?}
   * @private
   */
  this.record_type_ = null;
};
goog.inherits(ydn.crm.ui.sugar.SyncPanel, goog.ui.Component);


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.ui.sugar.SyncPanel.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.SyncPanel.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(goog.getCssName('content'), this.getElement());
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.SyncPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.dom_;
  var root = this.getElement();
  var data = {

  };
  goog.soy.renderElement(root, templ.ydn.crm.sugar.syncPanel, data);
  var toolbar = new goog.ui.Toolbar();
  toolbar.decorate(goog.dom.getElementByClass('goog-toolbar', root));
  this.addChild(this.content_sugar, true);
  this.addChild(this.content_gdata, true);
  goog.style.setElementShown(this.content_gdata.getElement(), false);
};


/**
 * @return {string?}
 * @protected
 */
ydn.crm.ui.sugar.SyncPanel.prototype.getBaseRecordType = function() {
  var base = this.getElement().querySelector('div[name=base-record]');
  var sel = goog.dom.getElementByClass(goog.getCssName('goog-option-selected'), base);
  return sel ? sel.getAttribute('name') : 'contacts';
};


/**
 * @return {string}
 * @protected
 */
ydn.crm.ui.sugar.SyncPanel.prototype.getSortBy = function() {
  var base = this.getElement().querySelector('div[name=sort-by]');
  var sel = goog.dom.getElementByClass(goog.getCssName('goog-option-selected'), base);
  return sel ? sel.getAttribute('name') : 'modified';
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.SyncPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();
};


/**
 * Set record type of content panel.
 * @param {string} type
 */
ydn.crm.ui.sugar.SyncPanel.prototype.setRecordType = function(type) {
  if (this.record_type_ == type) {
    return;
  }
  if (type == 'gdata-contact') {

  } else {
    var module_name = ydn.crm.sugar.assertModuleName(type);
    this.getModel().listRecords(type, this.getSortBy()).addCallbacks(function(arr) {
      var cn = this.content_sugar.getChildCount();
      var n = arr.length;
      var m = Math.max(cn, n);
      for (var i = 0; i < m; i++) {
        if (i < cn) {
          var child = /** @type {ydn.crm.ui.sugar.Record} */ (this.content_sugar.getChildAt(i));
          var model = child.getModel();
          if (i < n) {
            var r = new ydn.crm.sugar.Record(this.getModel().getDomain(), module_name, arr[i]);
            model.setRecord(r);
            child.setVisible(true);
          } else {
            model.setRecord(null);
            child.setVisible(false);
          }
        }
        if (i >= cn) {
          var mm = new ydn.crm.sugar.model.ImmutableRecord(this.getModel(), module_name);
          mm.setRecord(arr[i]);
          var child_panel = new ydn.crm.ui.sugar.Record(this.getDomHelper(), mm);
          this.content_sugar.addChild(child_panel, true);
        }
      }
    }, function(e) {
      throw e;
    }, this);
  }
  this.record_type_ = type;
};


/**
 * Refresh UI.
 */
ydn.crm.ui.sugar.SyncPanel.prototype.refresh = function() {

};


