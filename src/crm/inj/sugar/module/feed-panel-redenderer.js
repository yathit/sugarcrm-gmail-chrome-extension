/**
 * @fileoverview Feed panel show relevant record from the SugarCRM relative to
 * current gmail inbox contact.
 *
 * This provides adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.FeedPanelRenderer');
goog.require('goog.ui.ControlRenderer');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.FeedPanelRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.FeedPanelRenderer, goog.ui.ControlRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.FeedPanelRenderer.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.FeedPanelRenderer.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.sugar.FeedPanelRenderer');


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.FeedPanelRenderer.CSS_CLASS = 'feed-panel';


/** @return {string} */
ydn.crm.inj.sugar.FeedPanelRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.FeedPanelRenderer.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.FeedPanelRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var header = /** {ydn.crm.inj.sugar.FeedPanel} */ (x);
  var model = /** @type {ydn.crm.sugar.model.Sugar} */ (header.getModel());
  var dom = header.getDomHelper();
  var content = dom.createDom('div', 'feed', 'Feed panel');
  root.appendChild(content);

  return root;
};


/**
 * Refresh view due to change in model.
 * @param {Element} root
 * @param {ydn.crm.sugar.model.GDataRecord} model
 */
ydn.crm.inj.sugar.FeedPanelRenderer.prototype.refresh = function(root, model) {



};




