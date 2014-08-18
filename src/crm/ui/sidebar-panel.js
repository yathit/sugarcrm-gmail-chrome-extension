/**
 * @fileoverview Contact sidebar panel.
 */


goog.provide('ydn.crm.ui.SidebarPanel');
goog.require('ydn.crm.ui.SidebarHeader');
goog.require('ydn.crm.ui.SimpleSidebarPanel');
goog.require('ydn.crm.ui.sugar.SugarPanel');



/**
 * Contact sidebar panel.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.SimpleSidebarPanel}
 */
ydn.crm.ui.SidebarPanel = function(opt_dom) {
  goog.base(this, opt_dom);

  /**
   * @type {ydn.crm.ui.gmail.Template}
   * @private
   */
  this.gmail_template_ = null;
};
goog.inherits(ydn.crm.ui.SidebarPanel, ydn.crm.ui.SimpleSidebarPanel);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.SidebarPanel.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.SidebarPanel.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.SidebarPanel');


/**
 * Add sugarcrm panel as child component.
 * @param {ydn.crm.sugar.model.GDataSugar} sugar
 * @protected
 */
ydn.crm.ui.SidebarPanel.prototype.addSugarPanel = function(sugar) {
  var panel = new ydn.crm.ui.sugar.SugarPanel(sugar, this.dom_);
  this.logger.finer('sugar panel ' + sugar.getDomain() + ' created');
  this.addChild(panel, true);

  if (!this.gmail_template_ && sugar.isLogin()) {
    this.logger.finer('compose template initialized.');
    this.gmail_template_ = new ydn.crm.ui.gmail.Template(sugar);
  }
};


/**
 * Inject template menu on Gmail compose panel.
 * @return {boolean} true if injected.
 */
ydn.crm.ui.SidebarPanel.prototype.injectTemplateMenu = function() {
  if (this.gmail_template_) {
    return this.gmail_template_.attach();
  } else {
    this.logger.warning('SugarCRM instance not ready.');
    return false;
  }
};


