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
  domain: 'https://xiwxzn5048.trial.sugarcrm.com',
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
  var domain = input.value.trim();
  if (!domain) {
    return;
  }
  if (/\.trial\.sugarcrm\.com/.test(domain)) {
    // all trial password from trial.sugarcrm.com are same.
    this.root.querySelector('input[name=username]').value = SugarCrmWidget.trialCredentials.user_name;
    this.root.querySelector('input[name=password]').value = SugarCrmWidget.trialCredentials.password;
  }
  this.model.setInstanceUrl(domain, function(info) {
    if (info instanceof Error) {
      ele_message.textContent = info.name + ': ' + info.message;
      ele_message.className = 'error';
    } else {
      ele_message.textContent = 'SugarCRM ' + info.flavor + ' ' + info.version;
      ele_message.className = '';
    }
  }, this);
};


/**
 * @param {Event} e
 * @private
 */
SugarCrmWidget.prototype.handleHostPermissionRequest_ = function(e) {
  e.preventDefault();
  this.model.requestHostPermission(function(grant) {
    if (grant) {
      var a = this.root.querySelector('#grant-host-permission');
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
  var login_panel = this.root.querySelector('div.sugar-login');
  var info_panel = this.root.querySelector('div.info');
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
    } else {
      login_panel.querySelector('#domain').textContent = about.baseUrl;
      login_panel.querySelector('#username').textContent = about.userName;
      login_panel.style.display = '';
      permission_panel.style.display = 'none';
    }
  } else {
    login_panel.style.display = '';
    info_panel.style.display = 'none';
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

  var btn_new_sugar = this.root.querySelector('button');
  btn_new_sugar.textContent = 'logging in...';
  btn_new_sugar.setAttribute('disabled', '1');

  this.model.login(url, username, password, function(info) {
    if (info instanceof Error) {
      btn_new_sugar.removeAttribute('disabled');
      btn_new_sugar.textContent = 'Login';
      ele_msg.textContent = info.name + ': ' + info.message;
    } else {
      window.location.reload();
    }
  }, this);
};

