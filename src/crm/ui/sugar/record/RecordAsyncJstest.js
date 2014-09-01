

RecordAsyncJsTest = AsyncTestCase("RecordAsyncJsTest");



RecordAsyncJsTest.prototype.setUp = function() {
  // jstestdriver.plugins.async.CallbackPool.TIMEOUT = 2;
  ydn.crm.test.init();
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', []);
  ydn.crm.test.getMain().addMockSugarRespond('query', [{result: []}]);
};


RecordAsyncJsTest.prototype.test_rendering = function(queue) {

  var record = ydn.crm.test.createContactRecord();

  var obj = record.record.obj;
  var name = obj['full_name'];
  var phone_home = obj['phone_home'];
  var exp_email1 = obj['email'][0]['email_address'];
  var exp_email2 = obj['email'][1]['email_address'];

  var panel = new ydn.crm.ui.sugar.record.Record(record);
  panel.render(document.body);

  var name_group = document.querySelector('div.record-group[name="name"]');
  var name_el = name_group.querySelectorAll('input.value');
  assertEquals('name', name, name_el[0].value);

  var email_group = document.querySelector('div.record-group[name="email"]');
  var email_el = email_group.querySelectorAll('input.value');
  assertEquals('email1', exp_email1, email_el[0].value);
  assertEquals('email2', exp_email2, email_el[1].value);

  var phone_field = document.querySelector('div.field[name="phone_home"]');
  var phone_el = phone_field.querySelector('input.value');
  assertEquals('phone_home', phone_home, phone_el.value);

};



RecordAsyncJsTest.prototype.test_rendering_account_name = function(queue) {

  var obj = {
    "id": "14931041-0811-1232-7bfc-5402b6f6dd93",
    "name": "Chaw Su"
  };
  var sugar = ydn.crm.test.createSugar();
  var r = new ydn.crm.sugar.Record(sugar.getDomain(), ydn.crm.sugar.ModuleName.ACCOUNTS, obj);
  var record = new ydn.crm.sugar.model.Record(sugar, r);

  var panel = new ydn.crm.ui.sugar.record.Record(record);
  panel.render(document.body);

  var name_group = document.querySelector('div.record-group[name="name"]');
  var name_el = name_group.querySelector('input.value');
  assertEquals('name', obj.name, name_el.value);

};



RecordAsyncJsTest.prototype.test_normally_hide_setting = function(queue) {
  var record = ydn.crm.test.createContactRecord();
  var panel = new ydn.crm.ui.sugar.record.Record(record);
  panel.render(document.body);
  var name_group = panel.body_panel.getChildByGroup('name');
  assertFalse('normally hide value of name group', name_group.isNormallyHide());
  var team_group = panel.body_panel.getChildByGroup('team_name');
  assertTrue('normally hide value of name group', team_group.isNormallyHide());
};



RecordAsyncJsTest.prototype.test_edit_name = function(queue) {

  var record = ydn.crm.test.createContactRecord(null, {});
  var record_panel = new ydn.crm.ui.sugar.record.Record(record);

  var patch;
  queue.call('user edit', function(callbacks) {
    record_panel.patch = callbacks.add(function(x) {
      patch = x;
    });
    record_panel.simulateEdit({'full_name': 'Kyaw Tun'}, true);
  });

  queue.call('verify patch', function() {
    assertEquals('edited fields', ['salutation', 'full_name', 'first_name', 'last_name'], Object.keys(patch));
    assertTrue('salutation', !patch['salutation']);
    assertEquals('first name', 'Kyaw', patch['first_name']);
    assertEquals('last name', 'Tun', patch['last_name']);
    assertEquals('full name', 'Kyaw Tun', patch['full_name']);
  });

  record_panel.render(document.body);

};


RecordAsyncJsTest.prototype.test_edit_email = function(queue) {

  var record = ydn.crm.test.createContactRecord(null, {});
  var record_panel = new ydn.crm.ui.sugar.record.Record(record);

  var patch;
  queue.call('user edit', function(callbacks) {
    record_panel.patch = callbacks.add(function(x) {
      patch = x;
    });
    record_panel.simulateEdit({'email': 'foo@example.com'}, true);
  });

  queue.call('verify patch', function() {
    assertEquals('edited fields', ['email'], Object.keys(patch));
    assertEquals('email', 'foo@example.com', patch['email']);
  });

  record_panel.render(document.body);

};



