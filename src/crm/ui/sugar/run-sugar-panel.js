/**
 * @fileoverview About this file
 */


ydn.app.msg.Manager.addConsumer(new ydn.app.msg.ConsoleStatusBar());
ydn.msg.initPipe('dev');
ydn.debug.log('ydn.crm', 'finer');
ydn.debug.log('ydn.msg', 'finest');
var panel, sugar;
var user = ydn.crm.ui.UserSetting.getInstance();
var inj = document.querySelector('.inj');
inj.style.maxWidth = '20em';
var div = document.getElementById('sync-panel-root');
ydn.crm.shared.logger.info('starting sugar panel test')

ydn.crm.sugar.model.GDataSugar.list().addCallbacks(function(models) {
  for (var i = 0; i < models.length; i++) {
    sugar = /** @type {ydn.crm.sugar.model.GDataSugar} */ (models[i]);
    document.getElementById('gmail-account').textContent = sugar.getGDataAccount();
    panel = new ydn.crm.ui.sugar.SugarPanel(sugar);
    panel.render(div);
    break;
  }
}, function(e) {
  throw e;
});

var btn = document.getElementById('set');
btn.onclick = function(e) {
  var input = document.getElementById('email')
  sugar.update(input.value);
};


var btnNew = document.getElementById('create-new');
btnNew.onclick = function(e) {
  var email = document.getElementById('new-email').value;
  var first = document.getElementById('first').value;
  var last = document.getElementById('last').value;
  var type = document.getElementById('record-type').value;
  console.log(email, first, last, type);
  var new_msg = document.getElementById('new-msg');
  if (type == 'Gmail') {
    var data = {
      gd$name: {
        gd$givenName: {$t: first},
        gd$familyName: {$t: last},
        gd$fullName: {$t: first + ' ' + last}
      },
      gd$email: [{
        address: email,
        rel: "http://schemas.google.com/g/2005#other"
      }]
    }
    ydn.msg.getChannel().send('new-entry', data).addCallbacks(function(data) {
      console.log(data);
      new_msg.textContent = 'Created';
    }, function(e) {
      new_msg.textContent = 'Fail';
      throw e;
    });
  } else {
    var record = {
      email1: email,
      name: first + ' ' + last,
      first_name: first,
      last_name: last
    }
    sugar.send('new-record', {record: record, module: type}).addCallbacks(function(data) {
      console.log(data);
      new_msg.textContent = 'Created';
    }, function(e) {
      new_msg.textContent = 'Fail';
      throw e;
    });
  }
};

