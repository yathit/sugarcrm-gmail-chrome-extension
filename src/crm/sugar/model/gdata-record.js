/**
 * @fileoverview SugarCRM module model.
 *
 * Encapsulate module info (or meta data) and its transient record entry data.
 * Record entry data can change during life time of the model dispatching
 * change (goog.events.EventType.CHANGE) event.
 */


goog.provide('ydn.crm.sugar.model.GDataRecord');
goog.require('ydn.crm.sugar.gdata');
goog.require('ydn.crm.sugar.model.Module');
goog.require('ydn.ds.gdata.Contact');



/**
 * SugarCRM module model.
 * @param {ydn.crm.sugar.model.GDataSugar} parent
 * @param {ydn.crm.sugar.ModuleName} module_name
 * @constructor
 * @extends {ydn.crm.sugar.model.Module}
 * @struct
 */
ydn.crm.sugar.model.GDataRecord = function(parent, module_name) {
  goog.base(this, parent, module_name);
  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);
  var cm = parent.getContactModel();
  if (cm) {
    this.invalidateContactModel_(cm);
  }
  this.handler.listen(this.getParent(), ydn.crm.sugar.model.events.Type.CONTEXT_DATA_CHANGE,
      this.handleContactModelChange_);
};
goog.inherits(ydn.crm.sugar.model.GDataRecord, ydn.crm.sugar.model.Module);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.GDataRecord.DEBUG = goog.DEBUG;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.sugar.model.GDataRecord.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.sugar.model.GDataRecord');


/**
 * @return {ydn.crm.sugar.model.GDataSugar}
 */
ydn.crm.sugar.model.GDataRecord.prototype.getParent = function() {
  return /** @type {ydn.crm.sugar.model.GDataSugar} */ (this.parent);
};


/**
 * Get context gdata contact.
 * @return {ydn.crm.inj.ContactModel}
 */
ydn.crm.sugar.model.GDataRecord.prototype.getContactModel = function() {
  return this.getParent().getContactModel();
};


/**
 * @return {ydn.gdata.m8.ContactEntry} return sugarcrm record entry.
 */
ydn.crm.sugar.model.GDataRecord.prototype.getGData = function() {
  return this.getParent().getGData(this.getModuleName()).contact;
};


/**
 * Get GData contact that is not link to any module.
 * @return {ydn.gdata.m8.ContactEntry}
 */
ydn.crm.sugar.model.GDataRecord.prototype.getUnboundGData = function() {
  return this.getParent().getGData(null).contact;
};


/**
 * Set sugarcrm record. This will dispatch ModuleRecordChangeEvent.
 * @param {ydn.gdata.m8.ContactEntry} record sugarcrm record entry.
 */
ydn.crm.sugar.model.GDataRecord.prototype.setGData = function(record) {
  // check valid record.
  this.getParent().setGData(this.getModuleName(), record);
};


/**
 * Check sugarcrm record and gdata contact are in synced.
 * @return {boolean}
 */
ydn.crm.sugar.model.GDataRecord.prototype.isSynced = function() {
  var contact = this.getGData();
  if (this.record && !!contact) {
    var xp = contact.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
        this.getDomain(), this.getModuleName());
    goog.asserts.assert(xp.record_id == this.record.getId(), 'expect link id to be ' +
        this.record.getId() + ' but ' + xp.record_id + ' found.');
    return true;
  }
  return false;
};


/**
 * @param {ydn.crm.sugar.model.events.ContextDataChangeEvent} e
 * @private
 */
ydn.crm.sugar.model.GDataRecord.prototype.handleContactModelChange_ = function(e) {
  this.invalidateContactModel_(e.contact);
};


/**
 * Target contact data has been change. Load data.
 * @param {ydn.crm.inj.ContactModel} contact_model
 * @private
 */
ydn.crm.sugar.model.GDataRecord.prototype.invalidateContactModel_ = function(contact_model) {
  this.setRecord(null);
  if (!contact_model) {
    return;
  }
  var email = contact_model.getEmail();
  if (!email) {
    return;
  }
  // query by email address
  var query = [{
    'store': this.getModuleName(),
    'index': 'ydn$emails',
    'key': email
  }];
  var contact = contact_model.getContact();
  if (contact) {
    var ids = contact.listExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM, this.getDomain(), this.getModuleName());
    if (ids.length > 0) {
      var xp = ids[0];
      var module_name = xp.module;
      var id = xp.record_id;
      goog.asserts.assert(module_name == this.getModuleName(), 'must have valid module name');
      goog.asserts.assert(id, 'must have valid id');
      query = [{
        'store': module_name,
        'index': 'id',
        'key': id
      }];
    }
  }

  this.getChannel().send(ydn.crm.Ch.SReq.LIST, query).addCallback(function(x) {
    var results = /** @type {Array.<SugarCrm.Query>} */ (x);

    var result = results[0];
    var n = result.result ? result.result.length : 0;
    this.logger.finer('query ' + JSON.stringify(query) + ' returns ' + n + ' results ');
    // for (var j = 0; j < n; j++) {
    // goog.asserts.assert(this.getModuleName() == result.store);
    if (ydn.crm.sugar.model.GDataRecord.DEBUG) {
      window.console.log(this + ' receiving sugarcrm ' + n + ' query result for ' + email, x);
    }
    if (result.result[0]) {
      var r = new ydn.crm.sugar.Record(this.getDomain(), this.getModuleName(), result.result[0]);
      this.setRecord(r);
    }
    // }
  }, this);
};


/**
 * Check sniffed
 * @return {boolean}
 */
ydn.crm.sugar.model.GDataRecord.prototype.canImportToSugar = function() {
  var cm = this.getParent().getContactModel();
  return !!cm && !!cm.getEmail() && !this.isSynced();
};


/**
 * Import from gdata to a new sugar entry.
 * @return {!goog.async.Deferred} Return {ydn.crm.sugar.Record} on success.
 */
ydn.crm.sugar.model.GDataRecord.prototype.importToSugar = function() {
  var record = this.getRecord();
  goog.asserts.assert(!record, 'already imported?');
  var df = new ydn.async.Deferred();
  var gdata = this.getUnboundGData();
  goog.asserts.assert(gdata, 'No unbound contact gdata');
  var req = ydn.crm.Ch.SReq.IMPORT_GDATA;
  var data = {
    'module': this.getModuleName(),
    'kind': gdata.getKind(),
    'gdata-id': gdata.getId()
  };
  this.logger.finer('sending ' + req + ' ' + JSON.stringify(data));
  return this.getChannel().send(req, data).addCallback(function(data) {
    if (ydn.crm.sugar.model.GDataRecord.DEBUG) {
      window.console.log(data);
    }
    var record = new ydn.crm.sugar.Record(this.getDomain(), this.getModuleName(), data);
    this.logger.finer(record + ' created.');
    this.setRecord(record);
  }, this);
};


/**
 * Add context inbox contact to a new sugar entry.
 * @return {!goog.async.Deferred} Return {ydn.crm.sugar.Record} on success.
 */
ydn.crm.sugar.model.GDataRecord.prototype.addToSugar = function() {
  var record = this.getRecord();
  goog.asserts.assert(!record, 'already imported?');
  var df = new ydn.async.Deferred();
  var contact = this.getParent().getContactModel();
  goog.asserts.assert(contact, 'no context contact');

  var req = ydn.crm.Ch.SReq.PUT_RECORD;
  var fn = contact.getFullName();
  var new_record = {
    'email1': contact.getEmail(),
    'full_name': fn
  };
  if (fn && fn.length > 0) {
    var fns = fn.split(/\s/);
    if (fns[0]) {
      new_record['first_name'] = fns[0];
    }
    if (fns[1]) {
      new_record['last_name'] = fns[fns.length - 1];
    }
  }
  var ph = contact.getPhone();
  if (ph) {
    new_record['phone_work'] = ph;
  }
  var data = {
    'module': this.getModuleName(),
    'record': new_record
  };

  this.logger.finer('sending ' + req + ' ' + JSON.stringify(data));
  return this.getChannel().send(req, data).addCallback(function(data) {
    if (ydn.crm.sugar.model.GDataRecord.DEBUG) {
      window.console.log(data);
    }
    var record = new ydn.crm.sugar.Record(this.getDomain(), this.getModuleName(), data);
    this.logger.finer(record + ' created.');
    this.setRecord(record);
  }, this);
};


/**
 * Whether linking make sense or not.
 * @return {boolean}
 */
ydn.crm.sugar.model.GDataRecord.prototype.canLink = function() {
  if (this.getGData()) {
    return false; // already has a link with this record
  }
  if (this.record) {
    return !!this.getUnboundGData(); // but there is a contact to link
  }
  return false;
};


/**
 * Link GData Contact to sugar record
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GDataRecord.prototype.link = function() {
  var record = this.getRecord();
  if (!record) {
    return goog.async.Deferred.fail('no Record to link.');
  }
  var sugar_id = record.getId();
  window.console.log(record);
  goog.asserts.assertString(sugar_id, 'no Record ID'); // this will not happen.
  var gdata = this.getGData();
  goog.asserts.assert(gdata + ' has already link to ' + record);
  gdata = this.getUnboundGData();
  if (!gdata) {
    return goog.async.Deferred.fail('Not contact data to link.');
  }

  var ex_id = new ydn.gdata.m8.ExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain(), this.getModuleName(), record.getId(), (+gdata.getUpdatedDate()));
  var data = {
    'kind': gdata.getKind(),
    'gdata-id': gdata.getId(),
    'external-id': ex_id.toExternalId()
  };
  var df1 = this.getChannel().send(ydn.crm.Ch.SReq.LINK, data);
  return df1.addCallback(function(entry) {
    if (ydn.crm.sugar.model.GDataRecord.DEBUG) {
      window.console.log('link', entry);
    }
    this.setGData(new ydn.gdata.m8.ContactEntry(entry));
  }, this);

};


/**
 * Update or create model.
 * @return {!ydn.async.Deferred}
 */
ydn.crm.sugar.model.GDataRecord.prototype.save = function() {
  var record = this.getRecord();
  goog.asserts.assertObject(record, 'no record save');
  if (ydn.crm.sugar.model.GDataRecord.DEBUG) {
    window.console.log(record);
  }
  var df = this.getChannel().send(ydn.crm.Ch.SReq.PUT_RECORD, record);
  df.addCallback(function(data) {
    goog.asserts.assert(data, this + ' receiving unexpected put record result ' + data);
    goog.asserts.assertString(data['id'], this + ' record id missing in ' + data);
    // cannot check module name
    if (ydn.crm.sugar.model.GDataRecord.DEBUG) {
      window.console.log(data);
    }
    record.setData(data);
  }, this);
  return df;
};


/**
 * @override
 * @protected
 */
ydn.crm.sugar.model.GDataRecord.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.handler.dispose();
  this.handler = null;
  this.record = null;
};


if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugar.model.GDataRecord.prototype.toString = function() {
    var s = '';
    if (this.record) {
      s += ':' + this.record;
    }
    var contact = this.getGData();
    if (contact) {
      s += ':' + contact;
    }
    return 'RecordModel:' + this.getModuleName() + s;
  };
}
