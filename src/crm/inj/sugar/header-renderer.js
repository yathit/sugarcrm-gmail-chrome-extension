/**
 * @fileoverview SugarCRM header panel for account setup and host access grant.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.HeaderRenderer');
goog.require('goog.events.KeyHandler');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('ydn.crm.base');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.ui.sugar.SearchPanel');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.HeaderRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.HeaderRenderer, goog.ui.ControlRenderer);


/**
 * @define {boolean} whether to use iframe.
 */
ydn.crm.inj.sugar.HeaderRenderer.USE_IFRAME = false;


/**
 * @define {boolean} whether to use iframe.
 */
ydn.crm.inj.sugar.HeaderRenderer.USE_POPUP = false;


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.HeaderRenderer.DEBUG = goog.DEBUG;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.HeaderRenderer.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.sugar.HeaderRenderer');


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.HeaderRenderer.CSS_CLASS = 'sugar-header';


/** @return {string} */
ydn.crm.inj.sugar.HeaderRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.HeaderRenderer.CSS_CLASS;
};


/**
 * Instead of creating a new tab, open like a dialog box.
 * @param {Event} e
 */
ydn.crm.inj.sugar.HeaderRenderer.openPageAsDialog = function(e) {
  e.preventDefault();
  var w = 200;
  var h = 100;
  var left = (screen.width / 2) - (w / 2);
  var top = (screen.height / 2) - (h / 2);
  var url = e.target.href;
  window.open(url, undefined, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.HeaderRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var ctrl = /** @type {ydn.crm.inj.sugar.Header} */ (x);
  /**
   * @type {ydn.crm.sugar.model.Sugar}
   */
  var model = ctrl.getModel();
  var dom = ctrl.getDomHelper();
  goog.dom.classes.add(root, this.getCssClass());
  var a = dom.createDom('a');
  a.textContent = model.getDomain();
  a.href = model.getHomeUrl();
  var ele_title = dom.createDom('div', {
    'class': 'main-title',
    'title': 'SugarCRM'}, [a]);
  root.appendChild(ele_title);
  var grants = [];
  if (!ydn.crm.inj.sugar.HeaderRenderer.USE_IFRAME) {
    var href = chrome.extension.getURL(ydn.crm.base.OPTION_PAGE) + '#credentials';
    var target = 'option-page';
    var msg = 'Setup host permission';
    if (ydn.crm.inj.sugar.HeaderRenderer.USE_POPUP) {
      href = chrome.extension.getURL(ydn.crm.base.HOST_PERMISSION_PAGE);
      target = 'host-permission';
      msg = 'Grant host permission';
    }
    var btn_grant = dom.createDom('a', {'href': href, 'target': target}, msg);
    btn_grant.setAttribute('title', 'Your permission is required to connect your' +
        ' server from this extension. Without permission request to server will be slow.');
    grants.push(btn_grant);
  }
  var div_grant = dom.createDom('div', {'class': 'host-permission'}, grants);
  root.appendChild(div_grant);
  var un = dom.createDom('input', {'name': 'username', 'type': 'text'});
  var div_username = dom.createDom('div', null, [un]);
  var ps = dom.createDom('input', {'name': 'password', 'type': 'password'});
  var div_password = dom.createDom('div', null, [ps]);
  var div_msg = dom.createDom('div', 'message');
  var div_login = dom.createDom('div', 'login-form', [div_username, div_password, div_msg]);
  goog.style.setElementShown(div_grant, false);
  goog.style.setElementShown(div_login, false);
  root.appendChild(div_login);
  var search = new ydn.crm.ui.sugar.SearchPanel(dom, model);
  ctrl.addChild(search);
  var ele_search = dom.createDom('div');
  root.appendChild(ele_search);
  search.render(ele_search);
  return root;
};



