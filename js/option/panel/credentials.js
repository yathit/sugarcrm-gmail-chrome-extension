/**
 * @fileoverview Credentials section.
 */



/**
 * Credentials section.
 * @constructor
 */
var Credentials = function() {

  this.root = document.getElementById('credentials');

  var list = this.root.querySelector('ul.credentials-list');

  var details_assess_log = this.root.querySelector('.audit-log a[name=detail]');
  details_assess_log.addEventListener('click', this.displayDetailLog.bind(this));

  var gdata = new GDataCredentialWidget();
  var li = document.createElement('li');
  list.appendChild(li);
  gdata.render(li);

  SugarCrmModel.list(function(models) {
    for (var i = 0; i < models.length; i++) {
      var view = new SugarCrmWidget(models[i]);
      var li = document.createElement('li');
      list.appendChild(li);
      view.render(li);
    }
  }, this);

  var new_sugar = new SugarCrmWidget(new SugarCrmModel(null));
  new_sugar.render(this.root.querySelector('.new-sugar'));
};


/**
 * @param {Event} e
 */
Credentials.prototype.displayDetailLog = function(e) {
  e.preventDefault();
  ydn.msg.getChannel().send('server-audit-log', {'access_token_records': '1'}).addCallback(function(data) {
    console.log(data);
    var ul = this.root.querySelector('.audit-log ul.results');
    ul.innerHTML = '';
  }, this);
  return true;
};


/**
 * Display Last login info.
 */
Credentials.prototype.displayLastLogin = function() {
  ydn.msg.getChannel().send('server-audit-log', {'last_login': '1'}).addCallback(function(data) {
    // console.log(data);
    var div = this.root.querySelector('.audit-log span.last-login');
    var record = data.LastLoginRecord;
    if (record) {
      var comp = data.ip == record.ip ? 'this computer' : record.ip;
      div.textContent = 'Last login from ' + comp + ' ' + record.ago + ' ago.';
    }
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
  this.displayLastLogin();
};
