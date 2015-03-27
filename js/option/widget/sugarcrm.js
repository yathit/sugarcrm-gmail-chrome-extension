/**
 * @fileoverview SugarCRM credential widget.
 */



/**
 * GData credential widget.
 * @param {SugarCrmModel} model
 * @param {boolean=} opt_hide_title
 * @constructor
 */
var SugarCrmWidget = function(model, opt_hide_title) {
  /**
   * @protected
   * @type {SugarCrmModel}
   */
  this.model = model;
  /**
   * @type {Element}
   */
  this.root = document.createElement('div');
  this.hide_title_ = !!opt_hide_title;
};


/**
 * Trial credential from http://www.sugarcrm.com
 * @type {{domain: string, user_name: string, password: string}}
 */
SugarCrmWidget.trialCredentials = {
  domain: 'https://rflkda0265.trial.sugarcrm.com/index.php',
  user_name: 'jane',
  password: '!Jane1'
};


/**
 * @param {Element} ele
 */
SugarCrmWidget.prototype.render = function(ele) {
  var div = document.createElement('div');
  ele.appendChild(div);
  var sr = div.webkitCreateShadowRoot ? div.webkitCreateShadowRoot() : div.createShadowRoot();
  var shadow = sr.appendChild(this.root);
  var template = document.querySelector('#sugarcrm-template');
  this.root.appendChild(document.importNode(template.content, true));
  // this.root.appendChild(template.content);

  var a_revoke = this.root.querySelector('a[name=remove]');
  a_revoke.addEventListener('click', this.remove_.bind(this), true);

  var a_grant = this.root.querySelector('#grant-host-permission > button');
  a_grant.onclick = this.handleHostPermissionRequest_.bind(this);

  var input_domain = this.root.querySelector('input[name=domain]');
  input_domain.onblur = this.onDomainBlur.bind(this);
  input_domain.setAttribute('placeholder', SugarCrmWidget.trialCredentials.domain);

  var input_baseurl = this.root.querySelector('input[name=baseurl]');
  input_baseurl.value = '';

  var btn_new_sugar = this.root.querySelector('button');
  btn_new_sugar.onclick = this.handleLogin.bind(this);
  var me = this;
  this.root.addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {
      me.handleLogin(e);
    }
  }, false);

  if (this.hide_title_) {
    this.root.querySelector('h3').style.display = 'none';
  }

  this.refresh();
};


/**
 * Handle on domain blur.
 * @param {Event} e
 */
SugarCrmWidget.prototype.onDomainBlur = function(e) {
  var input = this.root.querySelector('input[name="domain"]');
  var ele_message = input.nextElementSibling;
  ele_message.textContent = '';
  ele_message.className = '';
  var base_url = input.value.trim();
  if (!base_url) {
    return;
  }
  if (/\.trial\.sugarcrm\.[com|eu]/.test(base_url)) {
    // all trial password from trial.sugarcrm.com are same.
    this.root.querySelector('input[name=username]').value = SugarCrmWidget.trialCredentials.user_name;
    this.root.querySelector('input[name=password]').value = SugarCrmWidget.trialCredentials.password;
  }
  this.model.setInstanceUrl(base_url);
  chrome.permissions.request(this.model.getPermissionObject(), (function(grant) {
    this.model.getInfo(function(info) {
      var input_baseurl = this.root.querySelector('input[name=baseurl]');
      input_baseurl.value = '';
      if (info instanceof Error) {
        ele_message.textContent = info.name;
        ele_message.className = 'error';
        ele_message.setAttribute('title', info.message || '');
      } else {
        ele_message.textContent = 'SugarCRM ' + info.flavor + ' ' + info.version;
        ele_message.className = '';
        if (info['baseUrl']) {
          input_baseurl.value = info['baseUrl'];
        }
        ele_message.removeAttribute('title');
      }
    }, this);

    var btn = this.getHostPermissionBtn_();
    btn.setAttribute('data-domain', base_url);
    btn.style.display = grant ? 'none' : '';
  }).bind(this));

};


/**
 * @return {Element}
 * @private
 */
SugarCrmWidget.prototype.getHostPermissionBtn_ = function() {
  return this.root.querySelector('#grant-host-permission');
};


/**
 * @param {Event} e
 * @private
 */
SugarCrmWidget.prototype.handleHostPermissionRequest_ = function(e) {
  e.preventDefault();
  this.model.requestHostPermission(function(grant) {
    if (grant) {
      var a = this.getHostPermissionBtn_();
      a.style.display = 'none';
    }
  }, this);

};


/**
 * Revoke credential.
 * @param {Event} e
 * @private
 */
SugarCrmWidget.prototype.remove_ = function(e) {
  e.preventDefault();
  var a = e.target;
  var domain = this.model.getDomain();
  ydn.msg.getChannel().send('remove-sugar', domain).addCallback(function(data) {
    this.root.style.display = 'none';
    window.location.reload();
  }, this);
  a.href = '';
  a.onclick = null;
  a.textContent = 'removing...';
};


/**
 * Refresh the data.
 */
SugarCrmWidget.prototype.refresh = function() {
  var h3 = this.root.querySelector('h3');
  if (!this.model.getDomain()) {
    h3.textContent = 'Add a new SugarCRM instance';
  } else {
    h3.textContent = 'SugarCRM';
  }
  var about = this.model.getDetails();
  var login_panel = this.root.querySelector('div[name=login-panel]');
  var info_panel = this.root.querySelector('div[name=info-panel]');
  var remove_panel = this.root.querySelector('div[name=remove-panel]');
  var permission_panel = this.root.querySelector('#grant-host-permission');
  if (about) {
    if (about.isLogin) {
      var a = info_panel.querySelector('a[name=instance]');
      a.textContent = about.domain;
      a.href = about.baseUrl;
      a.target = about.domain;
      info_panel.querySelector('span[name=user]').textContent = about.userName;
      this.model.getInfo(function(info) {
        var info_div = login_panel.querySelector('span[name=instance-info]');
        if (info && !(info instanceof Error)) {
          info_div.textContent = info.version + ' ' + info.flavor;
        }
      }, this);
      this.model.hasHostPermission(function(grant) {
        permission_panel.style.display = grant ? 'none' : '';
      }, this);
      login_panel.style.display = 'none';
      info_panel.style.display = '';
      remove_panel.style.display = '';
    } else {
      // baseUrl ?
      login_panel.querySelector('#sugarcrm-domain').value = about.baseUrl;
      login_panel.querySelector('#sugarcrm-username').value = about.userName;
      login_panel.style.display = '';
      permission_panel.style.display = about.hostPermission ? 'none' : '';
      info_panel.style.display = 'none';
      remove_panel.style.display = '';
    }
  } else {
    login_panel.style.display = '';
    info_panel.style.display = 'none';
    remove_panel.style.display = 'none';
  }
};


/**
 * Handle login button click.
 * @param {Event} e
 */
SugarCrmWidget.prototype.handleLogin = function(e) {
  var root = this.root;
  var ele_msg = root.querySelector('.message');
  ele_msg.textContent = '';

  var url = root.querySelector('input[name="domain"]').value;
  var username = root.querySelector('input[name="username"]').value;
  var password = root.querySelector('input[name="password"]').value;
  var provider = root.querySelector('select[name="sugarcrm-auth"]').value;
  var baseurl = root.querySelector('input[name="baseurl"]').value;
  if (baseurl) {
    url = baseurl;
  }

  var btn_new_sugar = this.root.querySelector('button');
  btn_new_sugar.textContent = 'logging in...';
  btn_new_sugar.setAttribute('disabled', '1');

  var force = !!e.altKey;
  chrome.permissions.request(this.model.getPermissionObject(), (function(grant) {
    // console.log('grant ' + grant);
    if (!grant && !force) {
      ele_msg.textContent = 'Access permission to ' + url + ' is required.';
      return;
    }
    this.model.login(url, username, password, provider, function(info) {
      if (info instanceof Error) {
        btn_new_sugar.removeAttribute('disabled');
        btn_new_sugar.textContent = 'Login';
        ele_msg.textContent = info.name + ': ' + info.message;
      } else {
        window.location.reload();
      }
    }, this);
  }).bind(this));

};

