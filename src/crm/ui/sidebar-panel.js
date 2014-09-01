/**
 * @fileoverview Contact sidebar panel.
 */


goog.provide('ydn.crm.ui.SidebarPanel');
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
 * @inheritDoc
 */
ydn.crm.ui.SidebarPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  // status bar
  var dom = this.getDomHelper();
  var status_el = dom.createDom('div', ydn.crm.ui.SimpleSidebarPanel.CSS_CLASS_STATUS);
  var status = new ydn.app.msg.StatusBar();
  status.render(status_el);
  ydn.app.msg.Manager.addConsumer(status);
  var root = this.getElement();
  root.insertBefore(status_el, root.firstElementChild);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.SidebarPanel.prototype.addSugarPanel = function(sugar) {
  var panel = new ydn.crm.ui.sugar.SugarPanel(sugar, this.dom_);
  this.addChild(panel, true);
  if (ydn.crm.ui.SidebarPanel.DEBUG) {
    window.console.info('sugar panel ' + sugar.getDomain() + ' created, now ' +
        this.getChildCount() + ' panels');
  }
};



