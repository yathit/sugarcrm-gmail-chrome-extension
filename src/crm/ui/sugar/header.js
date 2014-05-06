/**
 * @fileoverview SugarCRM header panel for account setup and host access grant.
 *
 */


goog.provide('ydn.crm.ui.sugar.Header');
goog.require('goog.events.KeyHandler');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('ydn.crm.base');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.ui.sugar.SearchPanel');
goog.require('ydn.crm.ui.sugar.activity.Panel');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Sugar} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.Header = function(model, dom) {
  goog.base(this, dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.ui.sugar.Header, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.Header.DEBUG = false;


/**
 * @define {boolean} whether to use iframe.
 */
ydn.crm.ui.sugar.Header.USE_IFRAME = false;


/**
 * @define {boolean} whether to use popup.
 */
ydn.crm.ui.sugar.Header.USE_POPUP = true;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.sugar.Header.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.sugar.Header');


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.ui.sugar.Header.prototype.getModel;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.Header.CSS_CLASS_CONTENT = 'sugar-header-content';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.Header.CSS_CLASS = 'sugar-header';


/** @return {string} */
ydn.crm.ui.sugar.Header.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.Header.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.Header.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.sugar.Header.CSS_CLASS_CONTENT);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.Header.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var ctrl = this;
  /**
   * @type {ydn.crm.sugar.model.Sugar}
   */
  var model = this.getModel();
  var dom = this.getDomHelper();
  goog.dom.classes.add(root, this.getCssClass());
  var a = dom.createDom('a');
  a.textContent = model.getDomain();
  a.href = model.getHomeUrl();
  var ele_title = dom.createDom('div', {
    'class': 'main-title',
    'title': 'SugarCRM'}, [a]);
  root.appendChild(ele_title);
  var grants = [];
  if (!ydn.crm.ui.sugar.Header.USE_IFRAME) {
    var href = chrome.extension.getURL(ydn.crm.base.OPTION_PAGE) + '#credentials';
    var target = 'option-page';
    var msg = 'Setup host permission';
    if (ydn.crm.ui.sugar.Header.USE_POPUP) {
      href = chrome.extension.getURL(ydn.crm.base.HOST_PERMISSION_PAGE) + '?' + model.getDomain();
      target = 'host-permission';
      msg = 'Grant host permission';
    }
    // var btn = dom.createDom('button', null, msg);
    // using button inside a doesn't work, possible for strict security of chrome extension
    var btn_grant = dom.createDom('a', {
      'className': 'classic-button',
      'href': href,
      'target': target
    }, msg);
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
  var content_ele = dom.createDom('div', ydn.crm.ui.sugar.Header.CSS_CLASS_CONTENT);
  root.appendChild(div_login);
  root.appendChild(content_ele);
  goog.style.setElementShown(div_grant, !model.hasHostPermission());
  goog.style.setElementShown(div_login, !model.isLogin());
  goog.style.setElementShown(content_ele, this.getModel().hasHostPermission());

  var search = new ydn.crm.ui.sugar.SearchPanel(dom, model);
  this.addChild(search, true);

  var activity_panel = new ydn.crm.ui.sugar.activity.Panel(model, dom);
  this.addChild(activity_panel, true);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.Header.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();
  var handler = this.getHandler();
  var grant = this.getElement().querySelector('.host-permission');
  var div_login = root.querySelector('.login-form');
  var kh = new goog.events.KeyHandler(div_login);
  handler.listen(kh, goog.events.KeyHandler.EventType.KEY, this.handleLogin);
  if (ydn.crm.ui.sugar.Header.USE_POPUP) {
    var a_grant = grant.querySelector('a');
    handler.listen(a_grant, 'click', ydn.crm.base.openPageAsDialog, true);
  }

  handler.listen(this.getModel(), ydn.crm.sugar.model.Sugar.Event.HOST_ACCESS_GRANT,
      this.handleHostGrant);
  handler.listen(this.getModel(), ydn.crm.sugar.model.Sugar.Event.LOGIN,
      this.handleModelLogin);

  if (ydn.crm.ui.sugar.Header.USE_IFRAME) {
    this.injectGrantIframe_(this.getModel().getDomain());
  }
};


/**
 * @param e
 */
ydn.crm.ui.sugar.Header.prototype.handleModelLogin = function(e) {
  var div_login = this.getElement().querySelector('.login-form');
  goog.style.setElementShown(div_login, !this.getModel().isLogin());
};


/**
 * Listen model event for host grant access.
 * @param {Event} e
 */
ydn.crm.ui.sugar.Header.prototype.handleHostGrant = function(e) {
  var grant = this.getElement().querySelector('.host-permission');
  var has_per = this.getModel().hasHostPermission();
  goog.style.setElementShown(grant, !has_per);
  goog.style.setElementShown(this.getContentElement(), has_per);
  if (ydn.crm.ui.sugar.Header.USE_IFRAME && !has_per) {
    this.injectGrantIframe_(this.getModel().getDomain());
  }
};


/**
 * @param {goog.events.KeyEvent} keyEvent
 */
ydn.crm.ui.sugar.Header.prototype.handleLogin = function(keyEvent) {
  if (keyEvent.keyCode == goog.events.KeyCodes.ENTER) {
    var root = this.getElement();
    var div_login = root.querySelector('.login-form');
    var model = /** @type {ydn.crm.sugar.model.Sugar} */ (this.getModel());
    var un = div_login.querySelector('input[name=username]').value;
    var ps = div_login.querySelector('input[name=password]').value;
    var msg = div_login.querySelector('.message');
    msg.textContent = 'logging in...';
    model.doLogin(un, ps).addCallbacks(function(info) {
      if (model.isLogin()) {
        msg.textContent = '';
        goog.style.setElementShown(div_login, false);
      } else {
        msg.textContent = 'login failed';
      }
    }, function(e) {
      msg.textContent = 'Error: ' + e;
    }, this);
  }
};


/**
 * @param {string} domain
 * @private
 */
ydn.crm.ui.sugar.Header.prototype.injectGrantIframe_ = function(domain) {
  domain = encodeURIComponent(domain);
  var grant = this.getElement().querySelector('.host-permission');
  var iframe_ele = grant.querySelector('IFRAME');
  if (iframe_ele) {
    var uri = new goog.Uri(iframe_ele.src);
    if (uri.getQuery() == domain) {
      return;
    } else {
      grant.removeChild(iframe_ele);
    }
  }
  if (ydn.crm.ui.sugar.Header.DEBUG) {
    window.console.log('injected host permiossion iframe for ' + domain);
  }
  var iframe_url = chrome.extension.getURL(ydn.crm.base.HOST_PERMISSION_PAGE);
  iframe_ele = this.dom_.createElement('IFRAME');
  iframe_ele.setAttribute('frameborder', '0');
  iframe_ele.setAttribute('name', 'host-permission');
  iframe_ele.src = iframe_url + '?' + domain;
  grant.appendChild(iframe_ele);
};


/**
 * @return {string}
 */
ydn.crm.ui.sugar.Header.prototype.getDomain = function() {
  return this.getModel().getDomain();
};


/**
 * Update
 * @protected
 */
ydn.crm.ui.sugar.Header.prototype.handleSugarChanged = function() {
  var model = /** @type {ydn.crm.sugar.model.Sugar} */ (this.getModel());
  goog.asserts.assert(model, 'empty model?');
  var domain = model.getDomain();
  goog.asserts.assertString(domain, 'domain must be provided.');
  var root = this.getElement();
  var a_title = root.querySelector('.main-title a');
  var login = root.querySelector('.login-form');
  var grant = root.querySelector('.host-permission');
  a_title.textContent = domain;
  a_title.href = model.getBaseUrl() || 'https://' + domain;
  var user_name = login.querySelector('input[name=username]');
  user_name.textContent = model.getUserName() || '';
  var content_ele = this.getContentElement();
  goog.style.setElementShown(login, false);
  goog.style.setElementShown(grant, false);
  goog.style.setElementShown(root, true);
  goog.style.setElementShown(content_ele, true);
  if (!model.isLogin()) {
    var ch = ydn.msg.getChannel(ydn.msg.Group.SUGAR, domain).send(ydn.crm.Ch.SReq.ABOUT);
    ch.addCallback(function(x) {
      // window.console.log('about ', x);
      var about = /** @type {SugarCrm.About} */ (x);
      goog.style.setElementShown(login, !about.isLogin);
    });
  }
  if (model.isLogin() && !model.hasHostPermission()) {
    if (ydn.crm.ui.sugar.Header.USE_IFRAME) {
      this.injectGrantIframe_(domain);
    } else {
      var hp_url = chrome.extension.getURL(ydn.crm.base.HOST_PERMISSION_PAGE);
      var a_grant = grant.querySelector('a');
      a_grant.href = hp_url + '?' + domain;
    }
    goog.style.setElementShown(grant, true);
    goog.style.setElementShown(content_ele, false);
  }
};




