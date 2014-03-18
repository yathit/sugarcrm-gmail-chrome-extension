/**
 * @fileoverview Home page.
 *                                                 `
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.Setting');
goog.require('goog.dom');
goog.require('goog.style');



/**
 * Home panel.
 * @constructor
 */
ydn.crm.ui.Setting = function() {

  /**
   * @protected
   * @type {Element}
   */
  this.root = null;
  /**
   * Google user info.
   * @type {YdnApiUser}
   * @private
   */
  this.user_info_ = null;

};


/**
 * Initialize ui.
 * @param {Element} e
 */
ydn.crm.ui.Setting.prototype.init = function(e) {
  this.root = e;
  var btn_login = document.getElementById('user-login');
  /*
   var url = ydn.crm.base.RAW ? 'crm-ex/option-page-dev.html' : 'option-page.html';
   url = chrome.extension.getURL(url) + '?login';
   */
  goog.events.listen(btn_login, 'click', function(e) {
    e.preventDefault();
    // popup in middle
    var w = 600;
    var h = 400;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var url = e.target.href;
    window.open(url, undefined, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    /*
     chrome.windows.create({
     'url': url,
     'width': w,
     'height': h,
     'left': left,
     'top': top
     });
     */
    return true;
  }, true, this);

};


/**
 * @return {YdnApiUser}
 */
ydn.crm.ui.Setting.prototype.getUserInfo = function() {
  return this.user_info_;
};


/**
 * @param {string} name class name of the child node of the root to show.
 * @private
 */
ydn.crm.ui.Setting.prototype.showOnly_ = function(name) {
  // last always show.
  for (var i = this.root.childElementCount - 2; i >= 0; i--) {
    var show = goog.dom.classes.has(this.root.children[i], name);
    goog.style.setElementShown(this.root.children[i], show);
  }
};


/**
 * @param {string} msg
 * @private
 */
ydn.crm.ui.Setting.prototype.showMessage_ = function(msg) {
  var ele = goog.dom.getElementByClass('home-panel-message', this.root);
  ele.textContent = msg;
  goog.style.setElementShown(ele, true);
};


/**
 * Update sugarcrm login data
 * @private
 */
ydn.crm.ui.Setting.prototype.updateSugarLogin_ = function() {
  //
};


/**
 * Run after login
 * @param {YdnApiUser|Error} userinfo
 */
ydn.crm.ui.Setting.prototype.updateUserInfo = function(userinfo) {
  if (!userinfo || (userinfo instanceof Error)) {
    this.user_info_ = null;
    return;
  } else {
    this.user_info_ = userinfo;
  }
  if (!this.root) {
    return;
  }
  // this.showMessage_('loading...');
  var btn_login = document.getElementById('user-login');
  var ele_name = document.getElementById('user-name');
  var ele_msg = goog.dom.getElementByClass('login-message', this.root);
  if (userinfo instanceof Error) {
    ele_msg.textContent = userinfo.message;
    goog.style.setElementShown(ele_msg, true);
    goog.style.setElementShown(btn_login, false);
    return;
  }

  if (!this.user_info_.is_login) {
    btn_login.href = this.user_info_.login_url;
    btn_login.textContent = 'login';
    btn_login.style.display = '';
    ele_name.textContent = '';
    goog.style.setElementShown(ele_msg, true);
    goog.style.setElementShown(btn_login, true);
    // check sugar login
    this.updateSugarLogin_();
  } else {
    btn_login.href = this.user_info_.logout_url;
    btn_login.textContent = 'logout';
    ele_name.textContent = this.user_info_.email;
    goog.style.setElementShown(ele_msg, false);
    goog.style.setElementShown(btn_login, false); // hide logout menu
  }

};

