/**
 * @fileoverview Credentials section.
 */



/**
 * Credentials section.
 * @constructor
 */
var Credentials = function() {

  this.root = document.getElementById('credentials');

  var new_sugar = this.root.querySelector('.new-sugar');
  var sugar_crm_login = new SugarCrmLogin(new_sugar);
  sugar_crm_login.getElement().addEventListener('change', this.onSugarLoginChanged.bind(this), true);

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
 * update GData credentials
 * @private
 */
Credentials.prototype.renderGDataCredentials_ = function() {

  ydn.msg.getChannel().send('gdata-token', window.location.href).addCallback(function(data) {
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
      ydn.msg.getChannel().send('update-host-permission');
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
  ydn.msg.getChannel().send('remove-sugar', domain).addCallback(function(data) {
    this.renderSugarCredentials_();
  }, this);
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
 * Handle on sugar login success.
 * @param {string} domain
 * @protected
 */
Credentials.prototype.onSugarLoginChanged = function(domain) {
  this.renderSugarCredentials_();
};


/**
 * update SugarCRM credentials
 * @private
 */
Credentials.prototype.renderSugarCredentials_ = function() {
  ydn.msg.getChannel().send('list-sugarcrm').addCallback(function(abouts) {
    var ele_sugar = this.root.querySelector('.sugarcrm-tbody');
    ele_sugar.innerHTML = '';
    var domains = [];
    for (var i = 0; i < abouts.length; i++) {
      var about = /** @type {SugarCrm.About} */ (abouts[i]);
      var domain = about.domain;
      domains.push('http://' + domain + '/');
      domains.push('https://' + domain + '/');
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.textContent = 'SugarCrm';
      td.setAttribute('title', 'Locally stored Username/password-hash');
      tr.appendChild(td);
      var span = document.createElement('td');
      span.textContent = domain + ' (' + about.userName + ')';
      tr.appendChild(span);

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
      // console.log(permission.origins, domains);
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
