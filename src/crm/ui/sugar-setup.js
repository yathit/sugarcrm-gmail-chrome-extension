/**
 * @fileoverview Login task.
 */

goog.provide('ydn.crm.ui.SugarSetup');
goog.require('goog.log');
goog.require('goog.events.KeyHandler');
goog.require('goog.ui.Component');
goog.require('templ.ydn.crm.inj');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.inj');



/**
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @deprecated not using
 */
ydn.crm.ui.SugarSetup = function(opt_dom) {
  goog.base(this, opt_dom);
  /**
   * @protected
   * @type {string?}
   */
  this.channel_name = null;
};
goog.inherits(ydn.crm.ui.SugarSetup, goog.ui.Component);


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.SugarSetup.DUMMY_PASSWORD = 'xxxxxx';


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.SugarSetup.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.SugarSetup');


/**
 * @inheritDoc
 */
ydn.crm.ui.SugarSetup.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  goog.soy.renderElement(root, templ.ydn.crm.inj.sugarSetupPanel);
  goog.style.setElementShown(root, false);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.SugarSetup.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();
  var btn = root.querySelector('button');
  goog.events.listen(btn, 'click', this.doLogin_, true, this);
  var kh = new goog.events.KeyHandler(root);
  goog.events.listen(kh, goog.events.KeyHandler.EventType.KEY, function(e) {
    var keyEvent = /** @type {goog.events.KeyEvent} */ (e);
    if (keyEvent.keyCode == goog.events.KeyCodes.ENTER) {
      this.doLogin_(e);
    }
  }, false, this);
  var input = root.querySelector('input[name="domain"]');
  goog.events.listen(input, goog.events.EventType.BLUR, this.onDomainBlur, false, this);
};


/**
 * Handle on domain blur.
 * @param {Element} e
 * @protected
 */
ydn.crm.ui.SugarSetup.prototype.onDomainBlur = function(e) {
  var root = this.getElement();
  var input = root.querySelector('input[name="domain"]');
  var ele_message = input.nextElementSibling;
  ele_message.textContent = '';
  ele_message.className = '';
  var domain = input.value.trim();
  if (!domain) {
    return;
  }
  var msg = new ydn.msg.Message('sugar-server-info', function(m) {
    var info = /** @type {SugarCrm.ServerInfo} */ (m);
    window.console.log(info);
    if (msg.isError()) {
      ele_message.textContent = msg.getErrorMessage();
      ele_message.className = 'error';
    } else {
      ele_message.textContent = 'SugarCRM ' + info.flavor + ' ' + info.version;
      ele_message.className = '';
    }
  }, this);
  msg.setData(domain);
  ydn.msg.getMain().send(msg);
};


/**
 * Handle login click.
 * @param {Event} e
 * @private
 */
ydn.crm.ui.SugarSetup.prototype.doLogin_ = function(e) {
  var root = this.getElement();
  var model = this.getModel();
  var domain = root.querySelector('input[name=domain]').value.trim();
  var username = root.querySelector('input[name=username]').value.trim();
  var password = root.querySelector('input[name=password]').value.trim();
  password = password == ydn.crm.ui.SugarSetup.DUMMY_PASSWORD ? null : password;
  var ele_msg = root.querySelector('.message');
  ele_msg.textContent = '';
  if (!/https?:\/\//.test(domain)) {
    domain = 'https://' + domain;
  }
  domain = new goog.Uri(domain).getDomain();
  var origins = ['https://' + domain + '/', 'http://' + domain + '/'];
  var me = this;
  // console.log(origins);

  chrome.permissions.request({origins: origins}, function(grant) {
    if (grant) {
      model.doLogin(domain, username, password).addCallbacks(function(info) {

      }, function(e) {

      }, this);
    } else {
      ele_msg.textContent = 'This extension requires access to host "' + domain +
          '", but permissions was not granted.';
      goog.style.setElementShown(ele_msg.parentElement, true);
    }
  });
};


/**
 * @override
 */
ydn.crm.ui.SugarSetup.prototype.setModel = function(m) {
  goog.base(this, 'setModel', m);
  var model = /** @type {ydn.crm.sugar.model.Sugar} */ (m);
  var root = this.getElement();
  var input_domain = root.querySelector('input[name=domain]');
  if (model.isFixDomain()) {
    input_domain.setAttribute('disable', 'true');
  } else {
    input_domain.removeAttribute('disable');
  }
  if (model.isLogin()) {
    goog.style.setElementShown(root, false);
  } else {
    this.refresh(model.getInfo());
    goog.style.setElementShown(root, true);
  }
};


/**
 * @param {SugarCrm.ServerInfo} info
 * @protected
 */
ydn.crm.ui.SugarSetup.prototype.refresh = function(info) {
  var root = this.getElement();
  var p_domain = root.querySelector('.domain');
  var p_username = root.querySelector('.username');
  var p_password = root.querySelector('.password');
  var input_domain = root.querySelector('input[name=domain]');
  var input_username = root.querySelector('input[name=username]');
  var input_password = root.querySelector('input[name=password]');

  input_domain.value = info.baseUrl || info.domain || '';
  input_username.value = info.userName || '';

  if (info.isLogin) {
    input_password.value = ydn.crm.ui.SugarSetup.DUMMY_PASSWORD;
  } else {
    input_password.value = '';
  }
};



