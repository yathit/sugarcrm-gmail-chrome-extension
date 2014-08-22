

ydn.crm.ui.sugar.record.RecordAsyncJsTest = AsyncTestCase("ydn.crm.ui.sugar.record.RecordAsyncJsTest");



ydn.crm.ui.sugar.record.RecordAsyncJsTest.prototype.setUp = function() {
  ydn.crm.test.init();
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', []);
  ydn.crm.test.getMain().addMockSugarRespond('query', [{result: []}]);
};


ydn.crm.ui.sugar.record.RecordAsyncJsTest.prototype.testRendering = function(queue) {

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


ydn.crm.ui.sugar.record.RecordAsyncJsTest.prototype.test_normally_hide_setting = function(queue) {
  var record = ydn.crm.test.createContactRecord();
  var panel = new ydn.crm.ui.sugar.record.Record(record);
  panel.render(document.body);
  var name_group = panel.body_panel.getChildByGroup('name');
  assertFalse('normally hide value of name group', name_group.isNormallyHide());
  var team_group = panel.body_panel.getChildByGroup('team_name');
  assertTrue('normally hide value of name group', team_group.isNormallyHide());
};






