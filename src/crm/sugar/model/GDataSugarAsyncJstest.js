

GDataSugarAsyncJsTest = AsyncTestCase("GDataSugarAsyncJsTest");



GDataSugarAsyncJsTest.prototype.setUp = function() {
  ydn.crm.test.initPipe();
};


GDataSugarAsyncJsTest.prototype.testContextGDataChangeEvent = function(queue) {
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', []);
  ydn.crm.test.getMain().addMockSugarRespond('query', [{result: []}]);
  var sugar = ydn.crm.test.createGDataSugar();

  var type, context;
  var email = 'test@example.com';
  var fn = 'Test User';
  queue.call('update context', function(callbacks) {
    var listener = callbacks.add(function(e) {
      type = e.type;
      context = e.context;
    });
    goog.events.listen(sugar, ydn.crm.sugar.model.events.Type.CONTEXT_GDATA_CHANGE, listener);
    sugar.update(email, fn, '12345678');

  });

  queue.call('update event', function(callbacks) {
    assertEquals('update event type', ydn.crm.sugar.model.events.Type.CONTEXT_GDATA_CHANGE, type);
    assertEquals('context name', fn, context.getFullName());
    assertEquals('context email', [email], context.getEmails());
    type = null; context = null;
  });

};


GDataSugarAsyncJsTest.prototype.test_record_gdata_change_event_no_pair = function(queue) {
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', []);
  ydn.crm.test.getMain().addMockSugarRespond('query', [{result: []}]);
  var sugar = ydn.crm.test.createGDataSugar();
  var record = new ydn.crm.sugar.model.GDataRecord(sugar,
      ydn.crm.sugar.ModuleName.CONTACTS);
  var type, context;

  var email = 'test@example.com';
  var fn = 'Test User';
  queue.call('update context', function(callbacks) {
    var listener = callbacks.add(function(e) {
      type = e.type;
    });
    goog.events.listen(record, ydn.crm.sugar.model.events.Type.GDATA_CHANGE, listener);
    sugar.update(email, fn, '12345678');

    /*
    setTimeout(function() {
      listener({type: 'Timeout'});
    }, 5000);
    */
  });

  queue.call('after event', function(callbacks) {
    assertEquals('after event type', ydn.crm.sugar.model.events.Type.GDATA_CHANGE, type);
    assertFalse('no record', record.hasRecord());
  });

};


GDataSugarAsyncJsTest.prototype.test_record_gdata_change_event_no_pair_has_sugar_record =
    function(queue) {
  var obj = ydn.crm.test.createContactSugarCrmRecord();
  var email = obj.email1;
  var fn = obj.full_name;
  ydn.crm.test.getMain().addMockRespond('gdata-list-contact-by-email', []);
  ydn.crm.test.getMain().addMockSugarRespond('query', [{result: [obj]}]);
  var sugar = ydn.crm.test.createGDataSugar();
  var record = new ydn.crm.sugar.model.GDataRecord(sugar,
      ydn.crm.sugar.ModuleName.CONTACTS);
  var type, context;

  queue.call('update context', function(callbacks) {
    var listener = callbacks.add(function(e) {
      type = e.type;
    });
    goog.events.listen(record, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, listener);
    sugar.update(email, fn, '12345678');

  });

  queue.call('after event', function(callbacks) {
    assertEquals('after event type', ydn.crm.sugar.model.events.Type.RECORD_CHANGE, type);
    assertTrue('has record', record.hasRecord());
    assertEquals('correct record', obj.id, record.getId());
  });

};

