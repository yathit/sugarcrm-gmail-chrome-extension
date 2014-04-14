/**
 * @fileoverview Login task.
 */

goog.provide('ydn.crm.ui.SugarLogin');
goog.require('goog.log');
goog.require('goog.events.KeyHandler');
goog.require('templ.ydn.crm.inj');
goog.require('ydn.crm.inj');



/**
 * @constructor
 * @struct
 * @deprecated not using
 */
ydn.crm.ui.SugarLogin = function() {
  /**
   * @protected
   * @type {string?}
   */
  this.channel_name = null;
  /**
   * @protected
   * @type {Element}
   */
  this.root = goog.soy.renderAsElement(templ.ydn.crm.inj.sugarLoginPanel);
  goog.style.setElementShown(this.root, false);
  var me = this;
  var btn = this.root.querySelector('button');
  btn.addEventListener('click', goog.bind(this.doLogin_, this), true);
  var kh = new goog.events.KeyHandler(this.root);
  goog.events.listen(kh, goog.events.KeyHandler.EventType.KEY, function(e) {
    var keyEvent = /** @type {goog.events.KeyEvent} */ (e);
    if (keyEvent.keyCode == goog.events.KeyCodes.ENTER) {
      this.doLogin_(e);
    }
  });
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.SugarLogin.DUMMY_PASSWORD = 'xxxxxx';


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.SugarLogin.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.SugarLogin');


/**
 * Handle login click.
 * @param {Event} e
 * @private
 */
ydn.crm.ui.SugarLogin.prototype.doLogin_ = function(e) {
  var base_url = this.root.querySelector('input[name=domain]').value.trim();
  var username = this.root.querySelector('input[name=username]').value.trim();
  var password = this.root.querySelector('input[name=password]').value.trim();
  var domain = base_url;
  password = password == ydn.crm.ui.SugarLogin.DUMMY_PASSWORD ? null : password;
  var ele_msg = this.root.querySelector('.message');
  ele_msg.textContent = '';
  if (!/https?:\/\//.test(domain)) {
    domain = 'https://' + domain;
  }
  domain = new goog.Uri(domain).getDomain();
  var me = this;
  chrome.permissions.request({origins: ['https://' + domain + '/']}, function(grant) {
    if (grant) {
      var ch = ydn.msg.getChannel(ydn.msg.Group.SUGAR, domain);
      var data = {
        'baseUrl': base_url,
        'username': username,
        'password': password
      };
      ch.send(ydn.crm.Ch.SReq.ABOUT, data).addCallbacks(function(info) {
        me.refresh(/** @type {Object} */ (info));

      }, function(e) {
        ele_msg.textContent = 'Error: ' + e;
        goog.style.setElementShown(ele_msg.parentElement, true);
      });
    } else {
      ele_msg.textContent = 'This extension requires access to host "' + domain +
          '", but permissions was not granted.';
      goog.style.setElementShown(ele_msg.parentElement, true);
    }
  });
};


/**
 * Initialize ui. This can be call more than once.
 * @param {Element} ele
 * @return {Element}
 */
ydn.crm.ui.SugarLogin.prototype.render = function(ele) {
  if (this.root.parentElement) {
    this.root.parentElement.removeChild(this.root);
  }
  if (ele) {
    ele.appendChild(this.root);
  }
  goog.style.setElementShown(this.root, true);
  this.refresh({});
  return this.root;
};


/**
 * Detach panel.
 */
ydn.crm.ui.SugarLogin.prototype.detach = function() {
  this.root.parentElement.removeChild(this.root);
};


/**
 * Update for given sugar domain.
 * @param {ydn.msg.Pipe|Object} domain sugar domain name or sugar channel.
 */
ydn.crm.ui.SugarLogin.prototype.update = function(domain) {
  var channel = domain instanceof ydn.msg.Pipe ? domain : ydn.crm.Ch.createSugarChannel(domain);
  if (channel) {
    channel.send(ydn.crm.Ch.SReq.ABOUT).addCallback(function(info) {
      this.refresh(info);
    }, this);
  } else {
    this.refresh({});
  }
};


/**
 * Refresh login status.
 * @param {Object} info sugar login info
 */
ydn.crm.ui.SugarLogin.prototype.refresh = function(info) {
  var ele_domain = this.root.children[0].children[1];
  var ele_username = this.root.children[1].children[1];
  var ele_password = this.root.children[2].children[1];
  var ele_message = this.root.children[3].children[0];
  goog.style.setElementShown(this.root.children[0], false);
  goog.style.setElementShown(this.root.children[1], false);
  goog.style.setElementShown(this.root.children[2], false);
  goog.style.setElementShown(this.root.children[3], false);
  if (info['is_login']) {
    ele_message.textContent = info['domain'] + ' (' + info['username'] + ')';
    goog.style.setElementShown(this.root.children[3], true);
  } else {
    ele_domain.value = info['domain'] ? 'https://' + info['domain'] : '';
    goog.style.setElementShown(this.root.children[0], true);
    ele_username.value = info['username'] || '';
    goog.style.setElementShown(this.root.children[1], true);
    ele_password.value = info['has_password'] ? ydn.crm.ui.SugarLogin.DUMMY_PASSWORD : '';
    goog.style.setElementShown(this.root.children[2], true);
    if (info['message']) {
      ele_message.textContent = info['message'];
      goog.style.setElementShown(this.root.children[3], true);
    }
  }
};

