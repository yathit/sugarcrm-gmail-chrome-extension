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
 * @const
 * @type {string}
 */
ydn.crm.ui.SidebarPanel.CSS_CLASS_INVALID_LOGIN_PANEL = 'invalid-login-panel';


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
  var root = this.getElement();
  var header = root.querySelector('.' + ydn.crm.ui.CSS_CLASS_HEAD);

  var invalid_login = dom.createDom('div', ydn.crm.ui.SidebarPanel.CSS_CLASS_INVALID_LOGIN_PANEL);
  header.appendChild(invalid_login);

  var status_el = dom.createDom('div', ydn.crm.ui.SimpleSidebarPanel.CSS_CLASS_STATUS);
  var status = new ydn.app.msg.StatusBar();
  status.render(status_el);
  ydn.app.msg.Manager.addConsumer(status);
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


/**
 * @override
 */
ydn.crm.ui.SidebarPanel.prototype.updateHeader = function() {
  goog.base(this, 'updateHeader');

  var us = /** @type {ydn.crm.ui.UserSetting} */ (ydn.crm.ui.UserSetting.getInstance());
  if (us.isLogin()) {
    var msg_panel = this.getHeaderElement().querySelector('.' +
        ydn.crm.ui.SidebarPanel.CSS_CLASS_INVALID_LOGIN_PANEL);

    if (!us.hasValidLogin()) {
      var data = {
        ydn_login: us.getLoginEmail()
      };
      goog.soy.renderElement(msg_panel, templ.ydn.crm.inj.wrongLogin, data);
      goog.style.setElementShown(msg_panel, true);
    } else {
      goog.style.setElementShown(msg_panel, false);
    }
  }

};

