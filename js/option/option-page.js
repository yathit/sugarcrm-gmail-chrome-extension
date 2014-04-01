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
  this.search = new SearchPanel();
  this.panels = [
    new HomePanel(),
    this.search,
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
    var ele_name = document.getElementById('user-name');
    var main_menu = document.getElementById('main-menu');
    var content = document.getElementById('content');
    if (user_info.is_login) {
      btn_login.href = user_info.logout_url;
      btn_login.textContent = 'logout';
      ele_name.textContent = user_info.email;
      main_menu.style.display = '';
      content.style.display = '';
    } else {
      var url = user_info.login_url;
      if (OptionPage.DEBUG && url.charAt(0) == '/') {
        // Local dev server need convert relative to full url.
        url = 'http://127.0.0.1:8080' + url;
      }
      btn_login.href = url;
      btn_login.textContent = 'login';
      btn_login.style.display = '';
      ele_name.textContent = '';
      main_menu.style.display = 'none';
      content.style.display = 'none';
    }
  }
};


/**
 * Show message.
 * @param {*} s
 */
OptionPage.prototype.setStatus = function(s) {
  document.getElementById('statusbar').textContent = typeof s == 'object' ?
      JSON.stringify(s) : s;
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
  var connected_background = false;
  var btn_login = document.getElementById('user-login');
  ydn.msg.getChannel().send('echo').addCallbacks(function(ok) {
    connected_background = true;
    this.setStatus('logging in...');
    ydn.msg.getChannel().send('login-info', context).addCallbacks(function(data) {
      var user_info = /** @type {YdnApiUser} */ (data);
      this.user_info = user_info;
      this.setStatus('');
      this.updateUserInfo_(user_info);
      SugarCrmModel.list(function(models) {
        for (var i = 0; i < models.length; i++) {
          if (models[i].isLogin()) {
            document.querySelector('#main-menu li[name=search-menu]').style.display = '';
            this.search.setup(models[i]);
            break;
          }
        }
      }, this);
      if (opt_cb) {
        opt_cb.call(opt_scope, user_info);
      }
    }, function(e) {
      this.setStatus(e.name + ' ' + e.message);
      // btn_login.href = '?' + Math.random(); // refresh the page
      // btn_login.textContent = 'refresh';
    }, this);
  }, function(e) {
    // btn_login.href = '?' + Math.random(); // refresh the page
    // btn_login.textContent = 'refresh';
    var msg = e instanceof Error ? e.name + ' ' + e.message : e;
    this.setStatus('Failed to connect to background page: ' + e);
  }, this);

  setTimeout(function() {
    if (!connected_background) {
      chrome.runtime.reload();
    }
  }, 1000);
};


/**
 * Show a particular section.
 * @param {string} name
 * @private
 */
OptionPage.prototype.showPanel_ = function(name) {
  name = name.trim().toLowerCase();
  var menu = document.getElementById('main-menu');
  var content = document.getElementById('content');
  var has_selected = false;
  for (var i = content.childElementCount - 1; i >= 0; i--) {
    var selected = content.children[i].id == name;
    has_selected |= selected;
    this.panels[i].setVisible(selected);
    menu.children[i].className = selected ? 'selected' : '';
    content.children[i].style.display = selected ? '' : 'none';
  }
  if (!has_selected) {
    // show home
    menu.children[0].className = 'selected';
    content.children[0].style.display = '';
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
  ydn.crm.ui.StatusBar.instance = new ydn.crm.ui.SimpleStatusBar();
  ydn.crm.ui.StatusBar.instance.render(document.getElementById('statusbar'));
  var menu = document.getElementById('main-menu');
  window.addEventListener('popstate', function(e) {
    me.showPanel_(location.hash.replace('#', ''));
  }, false);

  var link = document.getElementById('user-login');
  link.addEventListener('click', function(e) {
    e.preventDefault();
    if (link.textContent == 'logout') {
      ydn.msg.getChannel().send('logout');
    }
    OptionPage.openPageAsDialog_(e);
  }, true);

  chrome.runtime.onMessageExternal.addListener(
      function(request, sender, sendResponse) {
        if (request == 'closing') {
          sendResponse('close');
          location.reload();
        }
      });
  this.login(null, function() {
    if (location.hash) {
      me.showPanel_(location.hash.replace('#', ''));
    }
  }, this);
};



