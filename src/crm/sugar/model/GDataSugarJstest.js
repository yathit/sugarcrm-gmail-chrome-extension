

ydn.crm.sugar.model.GDataSugarJsTest = TestCase("ydn.crm.sugar.model.GDataSugarJsTest");



ydn.crm.sugar.model.GDataSugarJsTest.prototype.setUp = function() {
  ydn.crm.test.initPipe();
};


ydn.crm.sugar.model.GDataSugarJsTest.prototype.testContextUpdate = function() {
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', []);
  var sugar = ydn.crm.test.createGDataSugar();
  var email = 'test@example.com';
  var fn = 'Test User';
  sugar.update(email, fn, '12345678');
  var gdata = sugar.getContextGData();
  assertEquals('context name', fn, gdata.getFullName());
  assertEquals('context email', [email], gdata.getEmails());
};

