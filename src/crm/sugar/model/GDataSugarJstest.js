

GDataSugarModelJsTest = TestCase("GDataSugarModelJsTest");



GDataSugarModelJsTest.prototype.setUp = function() {
  ydn.crm.test.initPipe();
};


GDataSugarModelJsTest.prototype.test_context_data = function() {
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', []);
  ydn.crm.test.getMain().addMockSugarRespond('query', [{result: []}]);
  var email = 'test@example.com';
  var fn = 'Test User';
  var cm = new ydn.crm.inj.ContactModel('kyaw@email.com', email, fn);
  var gdata = cm.toContactEntry();
  assertEquals('context name', fn, gdata.getFullName());
  assertEquals('context email', [email], gdata.getEmails());
};


GDataSugarModelJsTest.prototype.test_no_match = function() {
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', []);
  ydn.crm.test.getMain().addMockSugarRespond('query', [{result: []}]);
  var sugar = ydn.crm.test.createGDataSugar();
  var email = 'test@example.com';
  var cm = new ydn.crm.inj.ContactModel('kyaw@email.com', email);
  var df = sugar.update(cm);
  assertNotNull('context', sugar.context_);
  assertNull('gdata', sugar.contact_);
  assertNull('record', sugar.record_);
};


GDataSugarModelJsTest.prototype.test_gdata_match = function() {
  var gdata = ydn.crm.test.createGDataContact();
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', [gdata]);
  ydn.crm.test.getMain().addMockSugarRespond('query', [{result: []}]);
  var sugar = ydn.crm.test.createGDataSugar();
  var email = 'test@example.com';
  var cm = new ydn.crm.inj.ContactModel('kyaw@email.com', email);
  var df = sugar.update(cm);
  assertNotNull('gdata', sugar.contact_);
  assertNull('record', sugar.record_);
};


GDataSugarModelJsTest.prototype.test_synced = function() {
  var sugar = ydn.crm.test.createGDataSugar();
  var gdata = ydn.crm.test.createGDataContact();
  var record = ydn.crm.test.createContactSugarCrmRecord();
  var ex_id = new ydn.gdata.m8.ExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      sugar.getDomain(), 'Contacts', record.id, NaN, 1379715000000);
  gdata.gContact$externalId = [ex_id.toExternalId()];
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', [gdata]);
  ydn.crm.test.getMain().addMockSugarRespond('query', [{
    store: 'Contacts',
    result: [record]
  }]);
  var email = 'test@example.com';
  var cm = new ydn.crm.inj.ContactModel('kyaw@email.com', email);
  var df = sugar.update(cm);
  assertNotNull('gdata', sugar.contact_);
  assertNotNull('record', sugar.record_);
};


GDataSugarModelJsTest.prototype.test_record_match = function() {
  var record = ydn.crm.test.createContactSugarCrmRecord();
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', []);
  ydn.crm.test.getMain().addMockSugarRespond('query', [{
    store: 'Contacts',
    result: [record]
  }]);
  var sugar = ydn.crm.test.createGDataSugar();
  var email = 'test@example.com';
  var cm = new ydn.crm.inj.ContactModel('kyaw@email.com', email);
  var df = sugar.update(cm);
  assertNull('gdata', sugar.contact_);
  assertNotNull('record', sugar.record_);
};
