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
 * @param {string} agent
 * @return {string}
 */
Credentials.sniffUA = function(agent) {
  var pf = '';
  var pd = 'Unknown';
  var ty = '';
  if (/Chrome/.test(agent)) {
    pd = 'Chrome';
  } else if (/Safari/.test(agent)) {
    pd = 'Safari';
  } else if (/IE/.test(agent)) {
    pd = 'IE';
  } else if (/Firefox/i.test(agent)) {
    pd = 'Firefox';
  } else if (/Opera/i.test(agent)) {
    pd = 'Firefox';
  }
  if (/mobile/i.test(agent)) {
    ty = 'Mobile';
  }
  if (/iOS/i.test(agent)) {
    pf = 'iOS ';
  } else if (/android/i.test(agent)) {
    pf = 'Android ';
  }
  return pf + pd + ' ' + ty;
};


/**
 * @param {Event} e
 */
Credentials.prototype.displayDetailLog = function(e) {
  e.preventDefault();
  var params = {'access_token_records': '1', 'logins': '1'};
  ydn.msg.getChannel().send('server-audit-log', params).addCallback(function(data) {
    // console.log(data);
    var result_list = this.root.querySelector('.audit-log .result-list');
    if (!result_list.style.display) {
      result_list.style.display = 'none';
      return; // hide
    }
    result_list.style.display = '';
    var tbody = this.root.querySelector('.audit-log tbody');
    tbody.innerHTML = '';
    var items = [];
    if (data.AccessTokenRecords) {
      items = data.AccessTokenRecords;
      items.map(function(x) {
        x.resource = 'GData Token';
        return x;
      });
    }
    if (data.LoginRecords) {
      items = items.concat(data.LoginRecords);
    }
    items.sort(function(a, b) {
      return a.timestamp > b.timestamp ? -1 : 1;
    });
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.textContent = item.resource || 'Login';
      tr.appendChild(td);
      /*
      td = document.createElement('td');
      td.textContent = Credentials.sniffUA(item.agent);
      td.setAttribute('title', item.agent);
      tr.appendChild(td);
      */
      td = document.createElement('td');
      var rg = item.region ? ' (' + item.region + ')' : '';
      var star = item.ip == data.ip ? '* ' : '';
      td.textContent = item.ip + star + rg;
      td.setAttribute('title', item.agent);
      tr.appendChild(td);
      td = document.createElement('td');
      td.textContent = new Date(item.timestamp).toLocaleString();
      tr.appendChild(td);
      tbody.appendChild(tr);
    }

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
