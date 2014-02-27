/**
 * @fileoverview SugarCRM header panel for account setup and host access grant.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.Header');
goog.require('goog.events.KeyHandler');
goog.require('goog.style');
goog.require('goog.ui.Control');
goog.require('ydn.crm.base');
goog.require('ydn.crm.inj.sugar.HeaderRenderer');
goog.require('ydn.crm.sugar');



/**
 * Contact sidebar panel.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.sugar.model.Sugar} model
 * @constructor
 * @struct
 * @extends {goog.ui.Control}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.Header = function(dom, model) {
  goog.base(this, null, null, dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.inj.sugar.Header, goog.ui.Control);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.Header.DEBUG = goog.DEBUG;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.Header.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.sugar.Header');


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.inj.sugar.Header.prototype.getModel;


/**
 * Instead of creating a new tab, open like a dialog box.
 * @param {Event} e
 */
ydn.crm.inj.sugar.Header.openPageAsDialog = function(e) {
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
ydn.crm.inj.sugar.Header.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();
  var handler = this.getHandler();
  var grant = this.getElement().querySelector('.host-permission');
  var div_login = root.querySelector('.login-form');
  var kh = new goog.events.KeyHandler(div_login);
  handler.listen(kh, goog.events.KeyHandler.EventType.KEY, this.handleLogin);
  if (ydn.crm.inj.sugar.HeaderRenderer.USE_POPUP) {
    var a_grant = grant.querySelector('a');
    handler.listen(a_grant, 'click', ydn.crm.inj.sugar.Header.openPageAsDialog, true);
  }

  this.getHandler().listen(ydn.msg.getMain(), ydn.msg.Pipe.EventType, function(e) {
    var ev = /** @type {ydn.msg.Event} */ (e);
    var msg = ev.getMessage();
    // window.console.log('receiving broadcast msg ' + JSON.stringify(msg));
    if (msg.req == ydn.crm.Ch.Req.UPDATE_HOST_PERMISSION) {
      var permissions = msg.data;
      // window.console.log(permissions);
      if (permissions && permissions['origins']) {
        var origins = permissions['origins'];
        var domain = this.info.getDomain();
        for (var i = 0; i < origins.length; i++) {
          var uri = new goog.Uri(origins[i]);
          // window.console.log(uri.getDomain() + ' ' + domain);
          if (uri.getDomain() == domain) {
            this.logger.finer('has host permission on ' + domain);
            var info = /** @type {ydn.crm.sugar.model.Sugar} */ (this.getModel());
            info.setHostPermission(true);
            this.setModel(info);
          }
        }
      }
    }
  }, false);
};


/**
 * @param {goog.events.KeyEvent} keyEvent
 */
ydn.crm.inj.sugar.Header.prototype.handleLogin = function(keyEvent) {
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
ydn.crm.inj.sugar.Header.prototype.injectGrantIframe_ = function(domain) {
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
  var iframe_url = chrome.extension.getURL(ydn.crm.base.HOST_PERMISSION_PAGE);
  iframe_ele = this.dom_.createElement('IFRAME');
  iframe_ele.setAttribute('frameborder', '0');
  iframe_ele.setAttribute('name', 'host-permission');
  iframe_ele.src = iframe_url + '?' + domain;
  grant.appendChild(iframe_ele);
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.inj.sugar.Header.prototype.handleGrantClick = function(e) {
  var model = this.getModel();
  var domain = model.getDomain();
  var origins = ['http://' + domain + '/', 'https://' + domain + '/'];
  var permission = {'origins': origins};
  var me = this;
  chrome.permissions.request(permission, function(grant) {
    var model = me.getModel();
    if (grant) {
      var ch = ydn.msg.getChannel(ydn.msg.Group.SUGAR, domain);
      ch.send(ydn.crm.Ch.Req.UPDATE_HOST_PERMISSION).addCallback(function(about) {
        model.setAbout(about);
        var grant = me.getElement().querySelector('.host-permission');
        goog.style.setElementShown(grant, !model.hasHostPermission());
      });
    }
  });
};


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.inj.sugar.Header.prototype.getModel;


/**
 * @return {string}
 */
ydn.crm.inj.sugar.Header.prototype.getDomain = function() {
  return this.getModel().getDomain();
};


/**
 * Update
 */
ydn.crm.inj.sugar.Header.prototype.refresh = function() {
  var model = /** @type {ydn.crm.sugar.model.Sugar} */ (this.getModel());
  goog.asserts.assert(model);
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
  goog.style.setElementShown(login, false);
  goog.style.setElementShown(grant, false);
  goog.style.setElementShown(root, true);
  if (!model.isLogin()) {
    var ch = ydn.msg.getChannel(ydn.msg.Group.SUGAR, domain).send(ydn.crm.Ch.SReq.ABOUT);
    ch.addCallback(function(x) {
      // window.console.log('about ', x);
      var about = /** @type {SugarCrm.About} */ (x);
      goog.style.setElementShown(login, !about.isLogin);
    });
  }
  if (model.isLogin() && !model.hasHostPermission()) {
    if (ydn.crm.inj.sugar.HeaderRenderer.USE_IFRAME) {
      this.injectGrantIframe_(domain);
    } else {
      var hp_url = chrome.extension.getURL(ydn.crm.base.HOST_PERMISSION_PAGE);
      var a_grant = grant.querySelector('a');
      a_grant.href = hp_url + '?' + domain;
    }
    goog.style.setElementShown(grant, true);
  }
};



goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.Header,
    ydn.crm.inj.sugar.HeaderRenderer);


