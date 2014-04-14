/**
 * @fileoverview SugarCRM module model pair with Gmail contact data.
 *
 * Unlike Record module, this module name cannot be change and parent sugar
 * module keep track of this instance. Only one type of instance can have
 * in a parent sugar model.
 */


goog.provide('ydn.crm.sugar.model.GDataRecord');
goog.require('ydn.crm.sugar.gdata');
goog.require('ydn.crm.sugar.model.Record');
goog.require('ydn.ds.gdata.Contact');
goog.require('ydn.gdata.m8.NewContactEntry');



/**
 * SugarCRM module model.
 * @param {ydn.crm.sugar.model.GDataSugar} parent
 * @param {ydn.crm.sugar.ModuleName} module_name
 * @constructor
 * @extends {ydn.crm.sugar.model.Record}
 * @struct
 */
ydn.crm.sugar.model.GDataRecord = function(parent, module_name) {
  var r = new ydn.crm.sugar.Record(parent.getDomain(), module_name);
  goog.base(this, parent, r);
  /**
   * Paired Gdata entry with SugarCRM record.
   * @type {ydn.gdata.m8.ContactEntry}
   * @private
   */
  this.synced_contact_ = null;
  /**
   * @final
   * @protected
   * @type {ydn.crm.sugar.ModuleName}
   */
  this.module_name = module_name;

  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);
  this.handler.listen(parent, [ydn.crm.sugar.model.events.Type.GDATA_CHANGE,
    ydn.crm.sugar.model.events.Type.GDATA_UPDATED,
    ydn.crm.sugar.model.events.Type.CONTEXT_GDATA_CHANGE], this.relayGDataEvent);

};
goog.inherits(ydn.crm.sugar.model.GDataRecord, ydn.crm.sugar.model.Record);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.GDataRecord.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.sugar.model.GDataRecord.prototype.logger =
    goog.log.getLogger('ydn.crm.sugar.model.GDataRecord');


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.GDataRecord.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.handler.dispose();
  this.handler = null;
};


/**
 * Dispatch event.
 * @param {ydn.crm.sugar.model.events.Event} e
 */
ydn.crm.sugar.model.GDataRecord.prototype.relayGDataEvent = function(e) {
  if (e instanceof ydn.crm.sugar.model.events.ContextGDataChangeEvent) {
    var ce = /** @type {ydn.crm.sugar.model.events.ContextGDataChangeEvent} */ (e);
    // the record is not longer valid.
    this.setRecord(null);
    this.synced_contact_ = ce.pop(this.getModuleName());
    if (this.synced_contact_) {
      var xp = this.synced_contact_.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
          this.getDomain(), this.getModuleName());
      var id = xp.record_id;
      this.updateRecord_(id);
    }
  } else if (e.type == ydn.crm.sugar.model.events.Type.GDATA_CHANGE) {
    // unpaired GData entry is available
    if (!this.hasRecord()) {
      // if we already have synced contact, we don't dispatch the event, since
      // unpaired record is not relevant to this module.
      var ge = /** @type {ydn.crm.sugar.model.events.GDataEvent} */ (e);
      var gmail = this.getParent().getContextGmail();
      if (gmail) {
        var query = [{
          'store': this.getModuleName(),
          'index': 'ydn$emails',
          'key': gmail
        }];

        this.getChannel().send(ydn.crm.Ch.SReq.LIST, query).addCallback(function(x) {
          var result = /** @type {SugarCrm.Query} */ (x[0]);
          if (ydn.crm.sugar.model.GDataRecord.DEBUG) {
            var n = result.result ? result.result.length : 0;
            window.console.log(this + ' receiving sugarcrm ' + n + ' query result for ' + gmail, result);
          }

          if (result && result.result[0]) {
            var r = new ydn.crm.sugar.Record(this.getDomain(), this.getModuleName(), result.result[0]);
            this.setRecord(r);
          } else {
            this.dispatchEvent(e);
          }
        }, this);
      } else {
        this.dispatchEvent(e);
      }
    }
  }             
};


/**
 * @return {ydn.crm.sugar.model.GDataSugar}
 */
ydn.crm.sugar.model.GDataRecord.prototype.getParent = function() {
  return /** @type {ydn.crm.sugar.model.GDataSugar} */ (this.parent);
};


/**
 * @return {ydn.gdata.m8.ContactEntry} return unbounded sugarcrm record entry.
 */
ydn.crm.sugar.model.GDataRecord.prototype.getGData = function() {
  return this.getParent().getGData();
};


/**
 * @return {ydn.gdata.m8.ContactEntry} return context contact from gmail panel
 */
ydn.crm.sugar.model.GDataRecord.prototype.getContextGData = function() {
  return this.getParent().getContextGData();
};


/**
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.sugar.model.GDataRecord.prototype.getModuleName = function() {
  return this.module_name;
};


/**
 * Set sugarcrm record. This will dispatch ModuleRecordChangeEvent.
 * @param {ydn.crm.sugar.Record} record sugarcrm record entry.
 */
ydn.crm.sugar.model.GDataRecord.prototype.setRecord = function(record) {
  // check valid record.
  if (record && record.getModule() != this.module_name) {
    throw new Error('Module name must be ' + this.module_name + ' but found ' +
        record.getModule());
  }
  goog.base(this, 'setRecord', record);
};


/**
 * @return {boolean} return true if contact has gdata entry.
 */
ydn.crm.sugar.model.GDataRecord.prototype.hasValidGData = function() {
  var gdata = this.getGData();
  return !!gdata && !(gdata instanceof ydn.gdata.m8.NewContactEntry);
};


/**
 * Update sugarcrm record. This will dispatch ModuleRecordChangeEvent.
 * @param {string?} id sugarcrm record id.
 * @private
 */
ydn.crm.sugar.model.GDataRecord.prototype.updateRecord_ = function(id) {
  // query to sugarcrm module.
  var contact = this.getGData();
  var email = contact ? contact.getEmails()[0] : undefined;
  if (ydn.crm.sugar.model.GDataRecord.DEBUG) {
    window.console.log(id, email);
  }
  if (id) {
    var id_query = [{
      'store': this.getModuleName(),
      'index': 'id',
      'key': id
    }];

    this.getChannel().send(ydn.crm.Ch.SReq.LIST, id_query).addCallbacks(function(x) {
      var result = /** @type {SugarCrm.Query} */ (x[0]);
      if (ydn.crm.sugar.model.GDataRecord.DEBUG) {
        window.console.log(result);
      }
      if (result && result.result[0]) {
        var r = new ydn.crm.sugar.Record(this.getDomain(), this.getModuleName(),
            result.result[0]);
        this.setRecord(r);
      } else {
        // should we delete this.synced_contact_ ?
        this.logger.warning('record id ' + id + ' not in ' + this.getModuleName());
      }
    }, function(e) {
      throw e;
    }, this);
  }
};


/**
 * Get current email address sniffed from the gmail inbox.
 * @return {?string}
 */
ydn.crm.sugar.model.GDataRecord.prototype.getEmail = function() {
  var contact = this.getGData();
  return contact ? contact.getEmails()[0] : null;
};


/**
 * Score entries aginst target.
 * @param {Array.<ydn.gdata.m8.ContactEntry>} contacts this will be sorted by
 * scores.
 * @return {Array.<number>} return respective score.
 */
ydn.crm.sugar.model.GDataRecord.prototype.score = function(contacts) {
  var gdata = this.getGData();
  var scores = [];
  for (var i = 0; i < contacts.length; i++) {
    scores[i] = gdata.scoreSimilarity(contacts[i]);
  }
  var sorted_scores = [];
  for (var i = 0; i < contacts.length; i++) {
    var index = goog.array.binarySearch(sorted_scores, scores[i]);
    if (index < 0) {
      goog.array.insertAt(sorted_scores, scores[i], -(index + 1));
      var c = contacts.splice(i, 1);
      goog.array.insertAt(contacts, c[0], -(index + 1));
    } else {
      goog.array.insertAt(sorted_scores, scores[i], index);
    }
  }
  return sorted_scores;
};


/**
 * Check sugarcrm record and gdata contact are in synced.
 * @return {boolean}
 */
ydn.crm.sugar.model.GDataRecord.prototype.isSynced = function() {
  if (!!this.synced_contact_ && !!this.hasRecord()) {
    var xp = this.synced_contact_.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
        this.getDomain(), this.getModuleName(), this.getId());
    return !!xp;
  }
  return false;
};


/**
 * Check gmail context contact exist.
 * @return {boolean}
 */
ydn.crm.sugar.model.GDataRecord.prototype.canSync = function() {
  if (!this.synced_contact_ && !!this.hasRecord()) {
    return !!this.getParent().getGData(); // if available, it can sync.
  }
  return false;
};


/**
 * Import from gdata to a new sugar entry.  This do not update extenal reference
 * id of the gdata record.
 * @return {!goog.async.Deferred} Return {ydn.crm.sugar.Record} on success.
 */
ydn.crm.sugar.model.GDataRecord.prototype.importToSugar = function() {
  goog.asserts.assert(!this.hasRecord(), 'already imported?');
  var contact = this.getGData();
  goog.asserts.assertObject(contact, 'no contact gdata to import?');
  var req = ydn.crm.Ch.SReq.IMPORT_GDATA;
  var data = {
    'module': this.getModuleName(),
    'kind': contact.getKind(),
    'gdata-id': contact.getId()
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
  goog.asserts.assert(!this.hasRecord(), 'already imported?');
  var contact = this.getContextGData();
  goog.asserts.assertObject(contact, 'no contact gdata to import?');
  /**
   * @type {ydn.crm.sugar.Record}
   */
  var record = this.getRecord();
  goog.asserts.assert(!this.hasRecord(), 'already imported as ' + record);
  var df = new ydn.async.Deferred();

  var req = ydn.crm.Ch.SReq.PUT_RECORD;
  var fn = contact.getFullName();
  var new_record = {
    'email1': contact.getEmails()[0],
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
  var ph = contact.getPhoneNumbers();
  if (ph[0]) {
    new_record['phone_work'] = ph[0];
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
 * Export SugarCRM record to Gmail contact
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GDataRecord.prototype.export2GData = function() {
  /**
   * @type {ydn.crm.sugar.Record}
   */
  var record = this.getRecord();
  if (!record) {
    return goog.async.Deferred.fail('no Record to link.');
  }
  return this.getParent().export2GData(record);
};


/**
 * Link GData Contact to sugar record
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GDataRecord.prototype.link = function() {
  /**
   * @type {ydn.crm.sugar.Record}
   */
  var record = this.getRecord();
  if (!record) {
    return goog.async.Deferred.fail('no Record to link.');
  }
  return this.getParent().link(record);
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
