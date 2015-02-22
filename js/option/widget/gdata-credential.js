/**
 * @fileoverview Google GData credential widget.
 */



/**
 * GData credential widget.
 * @param {boolean=} opt_hide_title
 * @constructor
 */
var GDataCredentialWidget = function(opt_hide_title) {
  /**
   * @type {Element}
   */
  this.root = null;
  this.hide_title_ = !!opt_hide_title;
};


/**
 * @param {Element} ele
 */
GDataCredentialWidget.prototype.render = function(ele) {
  var div = document.createElement('div');
  ele.appendChild(div);
  this.root = div.createShadowRoot();
  var template = document.querySelector('#gdata-credentail-template');
  this.root.appendChild(template.content);

  var a_revoke = this.root.querySelector('a[name=gdata-token-revoke]');
  a_revoke.addEventListener('click', this.revoke_.bind(this), true);

  if (this.hide_title_) {
    this.root.querySelector('h3').style.display = 'none';
  }

};


/**
 * Revoke credential.
 * @param {Event} e
 * @return {boolean} true
 * @private
 */
GDataCredentialWidget.prototype.revoke_ = function(e) {
  e.preventDefault();
  var a_revoke = this.root.querySelector('a[name=gdata-token-revoke]');
  var ok = window.confirm('Are you sure you want to revoke your Google offline access token in YDN server?');
  if (ok) {
    ydn.msg.getChannel().send(ydn.crm.ch.Req.TOKEN_REVOKE_GDATA).addCallbacks(function() {
      a_revoke.textContent = 'Done';
      a_revoke.setAttribute('title', 'successfully revoked');
      a_revoke.removeAttribute('href');
    }, function(e) {
      a_revoke.setAttribute('title', 'Fail to revoke, click here to manage in your Google account');
      a_revoke.textContent = 'Manage';
      a_revoke.classList.add('error');
      a_revoke.href = 'https://security.google.com/settings/security/permissions';
    }, this);
  }
  return true;
};


/**
 * Refresh the data.
 * @param {function(this: T, boolean)=} opt_cb return true if has token.
 * @param {T=} opt_scope
 * @template T
 */
GDataCredentialWidget.prototype.refresh = function(opt_cb, opt_scope) {
  ydn.msg.getChannel().send('token-gdata', window.location.href).addCallback(function(data) {
    var token = /** @type {YdnApiToken} */ (data);

    var authorize_panel = this.root.querySelector('.authorize');
    var display_panel = this.root.querySelector('.display');

    if (token.has_token) {
      var email = display_panel.querySelector('span[name=email]');
      email.textContent = token.owner_email;
      var scopes = display_panel.querySelector('span[name=scopes]');
      scopes.textContent = token.Scopes.join(', ');
      display_panel.style.display = '';
      authorize_panel.style.display = 'none';
      if (opt_cb) {
        opt_cb.call(opt_scope, true);
      }
    } else {
      var btn = authorize_panel.querySelector('a');
      btn.href = token.authorize_url;
      display_panel.style.display = 'none';
      authorize_panel.style.display = '';
      if (opt_cb) {
        opt_cb.call(opt_scope, false);
      }
    }
  }, this);
};
