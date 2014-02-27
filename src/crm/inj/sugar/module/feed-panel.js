/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This panel two components: Header and Body.
 */


goog.provide('ydn.crm.inj.sugar.FeedPanel');
goog.require('goog.ui.Control');
goog.require('ydn.crm.inj.sugar.FeedPanelRenderer');
goog.require('ydn.crm.sugar');



/**
 * Contact sidebar panel.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.sugar.model.Sugar} model model
 * @constructor
 * @struct
 * @extends {goog.ui.Control}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.FeedPanel = function(dom, model) {
  goog.base(this, null, null, dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.inj.sugar.FeedPanel, goog.ui.Control);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.FeedPanel.DEBUG = false;


/**
 * @return {!ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.inj.sugar.FeedPanel.prototype.getModel;


/**
 * Refresh view due to change in model.
 */
ydn.crm.inj.sugar.FeedPanel.prototype.refresh = function() {
  var model = this.getModel();
  var root = this.getElement();
  var r = /** {ydn.crm.inj.sugar.FeedPanelRenderer} */ (this.getRenderer());
  r.refresh(root, model);
};

goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.FeedPanel,
    ydn.crm.inj.sugar.FeedPanelRenderer);
