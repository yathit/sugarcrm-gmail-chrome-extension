/**
 * @fileoverview Credentials section.
 */



/**
 * Credentials section.
 * @constructor
 */
var Credentials = function() {
  /*
  var menu = document.getElementById('main-menu');
  var btn = menu.querySelector('a[href="#credentials"]');
  var me = this;
  btn.addEventListener('click', function(e) {
    me.show();
  }, false);
  */
  this.root = document.getElementById('credentials');
  var btn_new_sugar = this.root.querySelector('button');
  btn_new_sugar.onclick = this.handleNewSugarCrmClick.bind(this);
  var me = this;
  this.root.onkeypress = function(e) {
    if (e.keyCode == 13) {
      me.handleNewSugarCrmClick(e);
    }
  };
  var input_domain = this.root.querySelector('input[name=domain]');
  input_domain.onblur = this.onDomainBlur.bind(this);
  var div_p = document.getElementById('grant-host-permission');
  var btn = div_p.querySelector('button');
  btn.onclick = this.requestHostPermission.bind(this);
  /**
   * List of granted permission.
   * @type {Array.<string>}
   */
  this.origins = [];
};


/**
 * Handle on domain blur.
 * @param {Element} e
 */
Credentials.prototype.onDomainBlur = function(e) {
  var input = this.root.querySelector('input[name="domain"]');
  var ele_message = input.nextElementSibling;
  ele_message.textContent = '';
  ele_message.className = '';
  var domain = input.value.trim();
  if (!domain) {
    return;
  }
  var msg = new ydn.channel.Message('sugar-server-info', function(info) {
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
  ydn.crm.Ch.getMain().send(msg);
};


/**
 * Handle login button click.
 * @param {Element} e
 */
Credentials.prototype.handleNewSugarCrmClick = function(e) {
  var root = this.root;
  var ele_msg = root.querySelector('.message');
  ele_msg.textContent = '';
  var url = root.querySelector('input[name="domain"]').value.trim();
  var domain = url.replace(/^https?:\/\//, '');
  domain = domain.replace(/\/.*/, ''); // remove after /
  var data = {
    baseUrl: url,
    username: root.querySelector('input[name="username"]').value,
    password: root.querySelector('input[name="password"]').value
  };
  var origins = ['http://' + domain + '/', 'https://' + domain + '/'];
  console.log(origins);
  var permission = {'origins': origins};
  chrome.permissions.request(permission, function(grant) {
    console.log(grant);
  });

  ydn.crm.Ch.createSugarChannel(data).addCallbacks(function(info) {
    console.log(info);
    this.renderSugarCredentials_();
  }, function(e) {
    ele_msg.textContent = 'Error: ' + e;
  }, this);
};


/**
 * update GData credentials
 * @private
 */
Credentials.prototype.renderGDataCredentials_ = function() {
  var msg = new ydn.channel.Message('gdata-token', function(data) {
    var token = /** @type {YdnApiToken} */ (data);
    var ele_gdata = this.root.querySelector('.google-credentials');
    var authorize = ele_gdata.querySelector('.authorize');
    var tbody = this.root.querySelector('.google-tbody');

    if (token.has_token) {
      var scopes = tbody.firstElementChild;
      scopes.setAttribute('title', token.Scopes.join(', '));
      tbody.style.display = '';
      authorize.style.display = 'none';
    } else {
      var btn = authorize.querySelector('a');
      btn.href = token.authorize_url;
      tbody.style.display = 'none';
      authorize.style.display = '';
    }
  }, this);
  msg.setData(window.location.href);
  ydn.crm.Ch.getMain().send(msg);
};


/**
 * @protected
 * @param {Event} e
 */
Credentials.prototype.requestHostPermission = function(e) {
  var permission = {'origins': this.origins};
  chrome.permissions.request(permission, function(grant) {
    console.log(permission, grant);
    if (grant) {
      var div = document.getElementById('grant-host-permission');
      div.style.display = 'none';
      var msg = new ydn.channel.Message('update-host-permission');
      ydn.crm.Ch.getMain().send(msg);
    }
  });

};


/**
 * @param {Event} e
 * @private
 */
Credentials.prototype.revokeSugarCredential_ = function(e) {
  e.preventDefault();
  var a = e.target;
  var domain = a.getAttribute('data-domain');
  var msg = new ydn.channel.Message('remove-sugar', function(data) {
    this.renderSugarCredentials_();
  }, this);
  msg.setData(domain);
  ydn.crm.Ch.getMain().send(msg);
  e.href = '';
  e.onclick = null;
};


/**
 * @param {string} domain
 * @return {string?} return host string if required.
 */
Credentials.prototype.isHostPermissionRequired = function(domain) {
  domain = domain.replace('http://', '').replace('https://', '');
  domain = 'https://' + domain + '/';

  var req = this.permission.origins.some(function(x) {
    return domain == x.substr(0, domain.length);
  });
  return req ? domain : null;
};


/**
 * update SugarCRM credentials
 * @private
 */
Credentials.prototype.renderSugarCredentials_ = function() {
  ydn.crm.Ch.updateChannels().addCallback(function(names) {
    var ele_sugar = this.root.querySelector('.sugarcrm-tbody');
    ele_sugar.innerHTML = '';
    var domains = [];
    for (var i = 0; i < names.length; i++) {
      var domain = names[i].substr('sugar-'.length);
      domains.push('http://' + domain + '/');
      domains.push('https://' + domain + '/');
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.textContent = 'SugarCrm';
      td.setAttribute('title', 'Locally stored Username/password-hash');
      tr.appendChild(td);
      var span = document.createElement('td');
      span.textContent = domain;
      tr.appendChild(span);
      /*
      var btn = document.createElement('button');
      btn.setAttribute('data-permission', domain);
      btn.textContent = 'Grant';
      btn.style.display = 'none';
      btn.onclick = this.requestHostPermission.bind(this);
      tr.appendChild(btn);
       */
      var a = document.createElement('a');
      a.setAttribute('data-domain', domain);
      a.textContent = 'Remove';
      a.href = '#';
      a.onclick = this.revokeSugarCredential_.bind(this);
      var td = document.createElement('td');
      td.appendChild(a);
      tr.appendChild(td);
      ele_sugar.appendChild(tr);
    }
    this.origins = domains;

    chrome.permissions.getAll(function(permission) {
      var has_all_permissions = domains.every(function(domain) {
        return permission.origins.indexOf(domain) >= 0;
      });
      console.log(permission.origins, domains);
      var div_host = document.getElementById('grant-host-permission');
      div_host.style.display = has_all_permissions ? 'none' : '';
    });

  }, this);
};


/**
 * Change visibility.
 * @param {boolean} val
 */
Credentials.prototype.setVisible = function(val) {
  if (!val) {
    this.root.style.display = 'none';
    return;
  }
  this.root.style.display = '';
  // update GData credentials
  this.renderGDataCredentials_();
  this.renderSugarCredentials_();
};
