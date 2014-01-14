/**
 * @fileoverview SugarCrm login form control.
 */



/**
 * Create SugarCrm login form control.
 * @param {HTMLElement} ele
 * @constructor
 */
var SugarCrmLogin = function(ele) {

  /**
   * @protected
   * @type {HTMLElement} // should beShadowRoot
   */
  this.root = ele.webkitCreateShadowRoot();

  var template = document.querySelector('#sugarcrm-login-form');
  this.root.appendChild(template.content.cloneNode(true));

  var input_domain = this.root.querySelector('input[name=domain]');
  input_domain.onblur = this.onDomainBlur.bind(this);

  var btn_new_sugar = this.root.querySelector('button');
  btn_new_sugar.onclick = this.handleNewSugarCrmClick.bind(this);
  var me = this;
  this.root.addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {
      me.handleNewSugarCrmClick(e);
    }
  }, false);
};


/**
 * Get root Element
 * @return {Element}
 */
SugarCrmLogin.prototype.getElement = function() {
  return this.root;
};


/**
 * Handle on domain blur.
 * @param {Event} e
 */
SugarCrmLogin.prototype.onDomainBlur = function(e) {
  var input = this.root.querySelector('input[name="domain"]');
  var ele_message = input.nextElementSibling;
  ele_message.textContent = '';
  ele_message.className = '';
  var domain = input.value.trim();
  if (!domain) {
    return;
  }
  ydn.msg.getChannel().send('sugar-server-info', domain).addCallbacks(function(info) {
    ele_message.textContent = 'SugarCRM ' + info.flavor + ' ' + info.version;
    ele_message.className = '';
  }, function(e) {
    ele_message.textContent = e.name + ': ' + e.message;
    ele_message.className = 'error';
  }, this);
};


/**
 * Reset form.
 */
SugarCrmLogin.prototype.reset = function() {
  this.root.querySelector('input[name="domain"]').value = null;
  this.root.querySelector('input[name="username"]').value = null;
  this.root.querySelector('input[name="password"]').value = null;
};


/**
 * Handle login button click.
 * @param {Event} e
 */
SugarCrmLogin.prototype.handleNewSugarCrmClick = function(e) {
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
  // console.log(origins);
  var permission = {'origins': origins};

  var btn_new_sugar = this.root.querySelector('button');
  btn_new_sugar.textContent = 'logging in...';
  btn_new_sugar.setAttribute('disabled', '1');

  chrome.permissions.request(permission, function(grant) {
    ydn.msg.getChannel().send('new-sugarcrm', data).addCallbacks(function(info) {
      btn_new_sugar.removeAttribute('disabled');
      btn_new_sugar.textContent = 'Login';
      this.reset();
      var event = new CustomEvent('change', {
        'domain': domain
      });
      this.root.dispatchEvent(event);
    }, function(e) {
      btn_new_sugar.removeAttribute('disabled');
      btn_new_sugar.textContent = 'Login';
      ele_msg.textContent = 'Error: ' + e;
    }, this);
  });
};



