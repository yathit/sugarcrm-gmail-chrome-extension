/**
 * @fileoverview Make life easier to getting started.
 */



/**
 * Login runner.
 * @constructor
 */
var Login = function() {
  /**
   * @protected
   * @type {Object}
   */
  this.user_info = null;

  this.modal_ = /model/.test(location.search);
};


/**
 * Close window.
 */
Login.prototype.close = function() {
  window.open('', '_self').close();
};


/**
 * Update user info.
 * @param {YdnApiUser} user_info
 * @private
 */
Login.prototype.updateUserInfo_ = function(user_info) {
  if (user_info) {
    var btn_login = document.getElementById('user-login');
    var btn_logout = document.getElementById('logout');
    var ele_name = document.getElementById('user-name');
    var close = document.querySelector('.close');
    var detail = document.querySelector('.ydn-detail');
    if (user_info.is_login) {
      btn_logout.href = user_info.logout_url;
      ele_name.textContent = 'User ' + user_info.email + ' login. ';
      btn_logout.style.display = '';
      close.style.display = '';
      detail.style.display = 'none';
      if (this.modal_) {
        btn_login.style.display = 'none';
        this.close();
      }
    } else {
      detail.style.display = '';
      btn_logout.style.display = 'none';
      btn_login.href = user_info.login_url;
      btn_login.style.display = '';
      ele_name.textContent = '';
      this.setStatus('Login required.');
      close.style.display = 'none';
    }
  }
};


/**
 * Do silence login.
 * @protected
 * @param {Object?} context login context
 * @param {function(this: T, Object)=} opt_cb
 * @param {T=} opt_scope
 * @template T
 */
Login.prototype.login = function(context, opt_cb, opt_scope) {

  this.setStatus('starting...');
  ydn.msg.getChannel().send('echo').addCallbacks(function(ok) {
    this.setStatus('logging in...');
    var param = {interactive: false, url: location.href, login: 'server', force: true};
    ydn.msg.getChannel().send('logged-in', param).addCallbacks(function(data) {
      var user_info = /** @type {YdnApiUser} */ (data);
      this.user_info = user_info;
      this.setStatus('');
      this.updateUserInfo_(user_info);
      if (opt_cb) {
        opt_cb.call(opt_scope, user_info);
      }
    }, function(e) {
      this.setStatus(e.name + ' ' + e.message);
    }, this);
  }, function(e) {
    var msg = e instanceof Error ? e.name + ' ' + e.message : e;
    this.setStatus('Failed to connect to background page: ' + msg);
  }, this);

};


/**
 * Instead of creating a new tab, open like a dialog box.
 * @param {Event} e
 * @private
 */
Login.openPageAsDialog_ = function(e) {
  e.preventDefault();
  var w = 900;
  var h = 700;
  var left = (screen.width / 2) - (w / 2);
  var top = (screen.height / 2) - (h / 2);
  var url = e.target.href;
  window.open(url, undefined, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
};


/**
 * Initialize.
 */
Login.prototype.init = function() {

  var close = document.querySelector('.close');
  close.onclick = this.close.bind(this);

  chrome.runtime.onMessageExternal.addListener(
      function(request, sender, sendResponse) {
        if (request == 'closing') {
          sendResponse('close');
          location.reload();
        }
      });

};


/**
 * Run after login.
 */
Login.prototype.run = function() {
  this.login(null, function(x) {
    console.log(x);
  }, this);
};


/**
 * Show message.
 * @param {*} s
 */
Login.prototype.setStatus = function(s) {
  document.getElementById('statusbar').textContent = typeof s == 'object' ?
      JSON.stringify(s) : s;
};

ydn.msg.initPipe('setup');
var setup = new Login();
setup.init();
setup.run();

