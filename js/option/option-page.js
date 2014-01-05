/**
 * @fileoverview Yathit CRM Option Page.
 */



/**
 * Yathit CRM Option Page.
 * @constructor
 */
var OptionPage = function() {
  /**
   * @protected
   * @type {Object}
   */
  this.user_info = null;
  this.panels = [
    new HomePanel(),
    new SearchPanel(),
    new Credentials()
  ];
};


/**
 * @define {boolean} debug flag.
 */
OptionPage.DEBUG = true;


/**
 * Update user info.
 * @param {YdnApiUser} user_info
 * @private
 */
OptionPage.prototype.updateUserInfo_ = function(user_info) {
  if (user_info) {
    var btn_login = document.getElementById('user-login');
    var login_link = document.getElementById('before-login-link');
    var ele_name = document.getElementById('user-name');
    if (user_info.is_login) {
      btn_login.href = user_info.logout_url;
      btn_login.textContent = 'logout';
      ele_name.textContent = user_info.email;
    } else {
      var url = user_info.login_url;
      if (OptionPage.DEBUG && url.charAt(0) == '/') {
        url = 'http://127.0.0.1:8080' + url;
      }
      btn_login.href = url;
      login_link.href = url;
      btn_login.textContent = 'login';
      btn_login.style.display = '';
      ele_name.textContent = '';
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
OptionPage.prototype.login = function(context, opt_cb, opt_scope) {
  var msg = new ydn.channel.Message('login-info', function(data) {
    if (msg.isError()) {
      document.getElementById('before-login-msg').textContent = 'login error';
    } else {
      this.user_info = data;
      var before_login = document.getElementById('before-login');
      var after_login = document.getElementById('after-login');
      if (data && data.is_login) {
        before_login.style.display = 'none';
        after_login.style.display = '';
        if (opt_cb) {
          opt_cb.call(opt_scope, data);
        }
      } else {
        before_login.style.display = '';
        after_login.style.display = 'none';
      }
      this.updateUserInfo_(data);
    }
  }, this);
  msg.setData(context);
  ydn.crm.Ch.getMain().send(msg);
};


/**
 * Show a particular section.
 * @param {string} name
 * @private
 */
OptionPage.prototype.showPanel_ = function(name) {
  var menu = document.getElementById('main-menu');
  var content = document.getElementById('content');
  for (var i = content.childElementCount - 1; i >= 0; i--) {
    var selected = content.children[i].id == name;
    this.panels[i].setVisible(selected);
    menu.children[i].className = selected ? 'selected' : '';
    content.children[i].style.display = selected ? '' : 'none';
  }
};


/**
 * Instead of creating a new tab, open like a dialog box.
 * @param {Event} e
 * @private
 */
OptionPage.openPageAsDialog_ = function(e) {
  e.preventDefault();
  var w = 900;
  var h = 700;
  var left = (screen.width / 2) - (w / 2);
  var top = (screen.height / 2) - (h / 2);
  var url = e.target.href;
  window.open(url, undefined, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
};


/**
 * Initialize UI.
 * @protected
 */
OptionPage.prototype.init = function() {
  var me = this;
  var menu = document.getElementById('main-menu');
  window.addEventListener('popstate', function(e) {
    me.showPanel_(location.hash.replace('#', ''));
  }, false);
  /*

  menu.addEventListener('click', function(e) {

    e.preventDefault();
    if (e.target.tagName == 'A') {
      for (var i = menu.childElementCount - 1; i >= 0; i--) {
        menu.children[i].className = '';
      }
      e.target.parentElement.className = 'selected';
      me.showPanel_(e.target.href.match(/#(\w+)/)[1]);
    }

  }, false);
   */
  var link = document.getElementById('user-login');
  link.addEventListener('click', function(e) {
    OptionPage.openPageAsDialog_(e);
  }, true);
  link = document.getElementById('before-login-link');
  link.addEventListener('click', function(e) {
    OptionPage.openPageAsDialog_(e);
  }, true);

  chrome.runtime.onMessageExternal.addListener(
      function(request, sender, sendResponse) {
        if (request == 'closing') {
          sendResponse('close');
          location.reload();
        }
      });

  this.login(null, function(info) {
    ydn.crm.Ch.updateChannels(function() {
      var panel = location.hash.substring(1);
      if (['search', 'credentials'].indexOf(panel) >= 0) {
        this.showPanel_(panel);
      } else {
        this.showPanel_('home');
      }
    }, this);
  }, this);

};

app = new OptionPage();
app.init();


