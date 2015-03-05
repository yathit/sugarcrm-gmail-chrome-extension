/**
 * @fileoverview Make life easier to getting started.
 */



/**
 * Setup runner.
 * @constructor
 */
var Setup = function() {
  /**
   * @protected
   * @type {Object}
   */
  this.user_info = null;

  if (/modal/.test(location.hash)) {
    var go_gmail = document.getElementById('go-to-gmail');
    go_gmail.style.display = 'none';
    var close = document.getElementById('close');
    close.style.display = '';
    var a_close = close.querySelector('a');
    a_close.onclick = this.close.bind(this);
  }
};


/**
 * Close window.
 */
Setup.prototype.close = function() {
  window.open('', '_self').close();
};


/**
 * Update user info.
 * @param {YdnApiUser} user_info
 * @private
 */
Setup.prototype.updateUserInfo_ = function(user_info) {
  if (user_info) {
    var btn_login = document.getElementById('user-login');
    var ele_name = document.getElementById('user-name');
    var register = document.getElementById('register');
    if (user_info.is_login) {
      btn_login.href = user_info.logout_url;
      btn_login.textContent = 'logout';
      ele_name.textContent = 'User ' + user_info.email + ' login. ';
      register.style.display = 'none';
    } else {
      var url = user_info.login_url;
      btn_login.href = url;
      btn_login.textContent = 'Login';
      btn_login.style.display = '';
      register.style.display = '';
      ele_name.textContent = '';
    }
    Setup.decorateStatus('li-login', !!user_info.is_login);
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
Setup.prototype.login = function(context, opt_cb, opt_scope) {

  this.setStatus('starting...');
  ydn.msg.getChannel().send('echo').addCallbacks(function(ok) {
    this.setStatus('logging in...');
    ydn.msg.getChannel().send('login-info', context).addCallbacks(function(data) {
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
Setup.openPageAsDialog_ = function(e) {
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
Setup.prototype.init = function() {
  var link = document.getElementById('user-login');
  link.addEventListener('click', function(e) {
    e.preventDefault();
    Setup.openPageAsDialog_(e);
  }, true);


  this.login(null, function(x) {
    this.run();
  }, this);
};


/**
 * Open DETAILS content of the first remaining stage.
 */
Setup.showCurrentStage = function() {
  if (Setup.finish_running_) {
    return;
  }
  Setup.finish_running_ = true;
  setTimeout(function() {
    var step_list = document.getElementById('step-list');
    var finished = true;
    // note last page is not to be taken.
    var step = step_list.firstElementChild;
    while (step) {
      if (!step.classList.contains('success')) {
        step.setAttribute('open', '1');
        break;
      }
      step = step.nextElementSibling;
    }
    if (!step || step == step_list.lastElementChild) {
      // all finished.
      step = step_list.lastElementChild;
      step.setAttribute('open', '1');
      step.classList.add('success');
    }
    Setup.finish_running_ = false;
  }, 200);
};


/**
 * Update status.
 * @param {string} id LI element id.
 * @param {boolean} status
 * @param {boolean=} opt_open
 */
Setup.decorateStatus = function(id, status, opt_open) {
  // without timeout, the screen does not refresh in Canary.
  // console.log(id + ' ' + status);

  var li = document.querySelector('#' + id);
  var remove = !opt_open;
  li.className = status ? 'success' : 'fail';
  if (remove) {
    li.removeAttribute('open');
  } else {
    li.setAttribute('open', '1');
  }

  Setup.showCurrentStage();
};


/**
 * Run after login.
 */
Setup.prototype.run = function() {
  // Step 2. Google token
  var gdata = new GDataCredentialWidget(true);
  var li = document.querySelector('#li-token div.detail');
  gdata.render(li);
  gdata.refresh(function(ok) {
    Setup.decorateStatus('li-token', ok);
  });
  // Step 3. SugarCRM
  SugarCrmModel.list(function(models) {
    var model = null;
    for (var i = 0; i < models.length; i++) {
      if (models[i].isLogin()) {
        model = models[i];
        break;
      } else if (!model) {
        model = models[i];
      }
    }
    if (!model) {
      model = new SugarCrmModel(null);
    }

    // console.log(model);
    var sugar = new SugarCrmWidget(model, true);
    sugar.render(document.querySelector('#li-sugarcrm div.detail'));
    Setup.decorateStatus('li-sugarcrm', model.isLogin());
    if (model.isLogin()) {
      model.hasHostPermission(function(ok) {
        Setup.decorateStatus('li-host', ok);
      });
      var btn = document.getElementById('host-detail-permission');
      btn.onclick = function(e) {
        model.requestHostPermission(function(ok) {
          Setup.decorateStatus('li-host', ok);
        }, this);
      };
    } else {
      // neighter success nor fail
      var li = document.querySelector('#li-host');
      li.className = '';
    }
  }, this);
};


/**
 * Show message.
 * @param {*} s
 */
Setup.prototype.setStatus = function(s) {
  document.getElementById('statusbar').textContent = typeof s == 'object' ?
      JSON.stringify(s) : s;
};


chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
      // the redirect page, pm.html will send this message.
      if (request == 'closing') {
        sendResponse('close');
        var link = document.getElementById('user-login');
        if (link.textContent == 'logout') {
          ydn.msg.getChannel().send('logged-out').addCallback(function() {
            location.reload();
          });
        } else {
          location.reload();
        }
      }
    });

ydn.msg.initPipe('setup');
var setup = new Setup();
setup.init();

