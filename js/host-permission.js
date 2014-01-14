/**
 * @fileoverview Yathit CRM Option Page.
 */


var HostPermission = function() {
  this.permissions = null;
  var btn = document.querySelector('.host-permission button');
  btn.addEventListener('click', this.handleHostPermissionClick.bind(this), true);
};


/**
 * @define {boolean} debug flag.
 */
HostPermission.DEBUG = true;


/**
 * @param {Event} e
 */
HostPermission.prototype.handleHostPermissionClick = function(e) {
  if (this.permissions) {
    var permissions = this.permissions;
    chrome.permissions.request(permissions, function(grant) {
      if (HostPermission.DEBUG) {
        console.log(permissions, grant);
      }
      chrome.runtime.sendMessage({
        permissions: permissions,
        grant: grant
      }, function(resp) {
        if (resp == 'close') {
          window.open('', '_self').close();
        }
      });
      document.querySelector('.host-permission').style.display = grant ? 'none' : '';
    });
  } else {
    document.querySelector('.host-permission').style.display = 'none';
  }
};


/**
 * Create host request of given domain.
 * @param {string} domain
 */
HostPermission.prototype.requestHost = function(domain) {
  if (!domain) {
    this.permissions = null;
    document.querySelector('.host-permission').style.display = 'none';
    return;
  }
  this.permissions = {'origins': ['https://' + domain + '/', 'http://' + domain + '/']};
  document.querySelector('.host-permission').style.display =
      this.permissions ? '' : 'none';


};


/**
 * Run the app.
 */
HostPermission.prototype.run = function() {
  this.requestHost(location.search.replace('?', ''));
};


var app = new HostPermission();
app.run();
