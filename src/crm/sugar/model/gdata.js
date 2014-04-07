/**
 * @fileoverview SugarCRM module model.
 *
 * Encapsulate module info (or meta data) and its transient record entry data.
 * Record entry data can change during life time of the model dispatching
 * change (goog.events.EventType.CHANGE) event.
 */


goog.provide('ydn.crm.sugar.model.GData');
goog.require('ydn.crm.sugar.gdata');
goog.require('ydn.crm.sugar.model.Record');
goog.require('ydn.ds.gdata.Contact');
goog.require('ydn.gdata.m8.NewContactEntry');



/**
 * SugarCRM module model.
 * @param {string} gdata_account Google account id, i.e., email address
 * @param {ydn.crm.sugar.model.Sugar} parent
 * @param {ydn.crm.sugar.ModuleName} module_name
 * @constructor
 * @extends {ydn.crm.sugar.model.Record}
 * @struct
 */
ydn.crm.sugar.model.GData = function(gdata_account, parent, module_name) {
  var r = new ydn.crm.sugar.Record(parent.getDomain(), module_name);
  goog.base(this, parent, r);
  /**
   * @type {ydn.gdata.m8.ContactEntry}
   * @private
   */
  this.contact_ = null;
  /**
   * @final
   * @protected
   * @type {string}
   */
  this.gdata_account = gdata_account;
};
goog.inherits(ydn.crm.sugar.model.GData, ydn.crm.sugar.model.Record);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.GData.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.sugar.model.GData.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.sugar.model.GData');


/**
 * @return {ydn.gdata.m8.ContactEntry} return sugarcrm record entry.
 */
ydn.crm.sugar.model.GData.prototype.getGData = function() {
  return this.contact_;
};


/**
 * @return {boolean} return true if contact has gdata entry.
 */
ydn.crm.sugar.model.GData.prototype.hasValidGData = function() {
  return !!this.contact_ && !(this.contact_ instanceof ydn.gdata.m8.NewContactEntry);
};


/**
 * Update sugarcrm record. This will dispatch ModuleRecordChangeEvent.
 * @param {string?} id sugarcrm record id.
 * @param {string?} email found in sniffing gmail thread.
 * @param {string?} full_name found in sniffing gmail thread.
 * @param {string?} phone found in sniffing gmail thread.
 * @private
 */
ydn.crm.sugar.model.GData.prototype.updateRecord_ = function(id, email, full_name, phone) {
  // query to sugarcrm module.
  if (ydn.crm.sugar.model.GData.DEBUG) {
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
      if (ydn.crm.sugar.model.GData.DEBUG) {
        window.console.log(result);
      }
      if (result && result.result[0]) {
        var r = new ydn.crm.sugar.Record(this.getDomain(), this.getModuleName(),
            result.result[0]);
        this.setRecord(r);
      } else {
        this.logger.warning('record id ' + id + ' not in ' + this.getModuleName());
        this.updateRecord_(null, email, full_name, phone);
      }
    }, function(e) {
      throw e;
    }, this);
  } else {
    var query = [{
      'store': this.getModuleName(),
      'index': 'ydn$emails',
      'key': email
    }];

    this.getChannel().send(ydn.crm.Ch.SReq.LIST, query).addCallback(function(x) {
      var result = /** @type {SugarCrm.Query} */ (x[0]);
      if (ydn.crm.sugar.model.GData.DEBUG) {
        var n = result.result ? result.result.length : 0;
        window.console.log(this + ' receiving sugarcrm ' + n + ' query result for ' + email, result);
      }

      if (result && result.result[0]) {
        var r = new ydn.crm.sugar.Record(this.getDomain(), this.getModuleName(), result.result[0]);
        this.setRecord(r);
      }
    }, this);
  }
};


/**
 * Score entries aginst target.
 * @param {Array.<ydn.gdata.m8.ContactEntry>} contacts this will be sorted by
 * scores.
 * @return {Array.<number>} return respective score.
 */
ydn.crm.sugar.model.GData.prototype.score = function(contacts) {

  var scores = [];
  for (var i = 0; i < contacts.length; i++) {
    scores[i] = this.contact_.scoreSimilarity(contacts[i]);
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
 * Update gmail context.
 * @param {string?} email found in sniffing gmail thread.
 * @param {string?} full_name found in sniffing gmail thread.
 * @param {string?} phone found in sniffing gmail thread.
 */
ydn.crm.sugar.model.GData.prototype.update = function(email, full_name, phone) {
  if (ydn.crm.sugar.model.GData.DEBUG) {
    window.console.log(this + ' update for ' + email);
  }
  var old = this.contact_;
  this.setRecord(null);
  if (!email) {
    this.contact_ = null;
    var gc = new ydn.crm.sugar.model.events.GDataEvent(this.getModuleName(),
        old, this.contact_, this);
    this.dispatchEvent(gc);
    return;
  }
  // query to gdata.

  var gdata = /** @type {!ContactEntry} */ (/** @type {Object} */ ({
    'gd$email': [{
      'address': email
    }]
  }));
  if (full_name) {
    var gd_name = /** @type {!GDataName} */ (/** @type {Object} */ ({
      'gd$fullName': {
        '$t': full_name
      }
    }));
    gdata.gd$name = gd_name;
  }
  if (phone) {
    gdata.gd$phoneNumber = [{
      '$t': phone
    }];
  }
  this.contact_ = new ydn.gdata.m8.NewContactEntry(this.gdata_account, gdata);
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_LIST_CONTACT_BY_EMAIL, email).addCallbacks(function(x) {
    var results = /** @type {Array.<!ContactEntry>} */ (x);
    if (ydn.crm.sugar.model.GData.DEBUG) {
      window.console.log(results);
    }

    var id = null;
    if (results && results.length >= 1) {
      var contacts = results.map(function(x) {
        return new ydn.gdata.m8.ContactEntry(x);
      });
      this.contact_ = contacts[0];
      var xp = this.contact_.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
          this.getDomain(), this.getModuleName());
      if (xp) {
        id = xp.record_id;
      }
    }
    this.updateRecord_(id, email, full_name, phone);
    var gc = new ydn.crm.sugar.model.events.GDataEvent(this.getModuleName(),
        old, this.contact_, this);
    this.dispatchEvent(gc);
  }, function(e) {
    this.updateRecord_(null, email, full_name, phone);
    throw e;
  }, this);
};


/**
 * Check sugarcrm record and gdata contact are in synced.
 * @return {boolean}
 */
ydn.crm.sugar.model.GData.prototype.isSynced = function() {
  var contact = this.getGData();
  if (this.hasRecord() && !(this.contact_ instanceof ydn.gdata.m8.NewContactEntry)) {
    var xp = contact.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
        this.getDomain(), this.getModuleName(), this.getId());
    return !!xp;
  }
  return false;
};


/**
 * Import from gdata to a new sugar entry.  This do not update extenal reference
 * id of the gdata record.
 * @return {!goog.async.Deferred} Return {ydn.crm.sugar.Record} on success.
 */
ydn.crm.sugar.model.GData.prototype.importToSugar = function() {
  goog.asserts.assert(!this.hasRecord(), 'already imported?');
  var df = new ydn.async.Deferred();
  goog.asserts.assertObject(this.contact_, 'no contact gdata to import?');
  goog.asserts.assertInstanceof(this.contact_, ydn.gdata.m8.ContactEntry,
      'not a contact gdata?');
  var req = ydn.crm.Ch.SReq.IMPORT_GDATA;
  var data = {
    'module': this.getModuleName(),
    'kind': this.contact_.getKind(),
    'gdata-id': this.contact_.getId()
  };
  this.logger.finer('sending ' + req + ' ' + JSON.stringify(data));
  return this.getChannel().send(req, data).addCallback(function(data) {
    if (ydn.crm.sugar.model.GData.DEBUG) {
      window.console.log(data);
    }
    var record = new ydn.crm.sugar.Record(this.getDomain(), this.getModuleName(), data);
    this.logger.finer(record + ' created.');
    this.setRecord(record);
  }, this);
};


/**
 * Get current email address sniffed from the gmail inbox.
 * @return {?string}
 */
ydn.crm.sugar.model.GData.prototype.getEmail = function() {
  return this.contact_ ? this.contact_.getEmails()[0] : null;
};


/**
 * Add context inbox contact to a new sugar entry.
 * @return {!goog.async.Deferred} Return {ydn.crm.sugar.Record} on success.
 */
ydn.crm.sugar.model.GData.prototype.addToSugar = function() {
  goog.asserts.assert(!this.hasRecord(), 'already imported?');
  goog.asserts.assertObject(this.contact_, 'no contact gdata to import?');
  /**
   * @type {ydn.crm.sugar.Record}
   */
  var record = this.getRecord();
  goog.asserts.assert(!this.hasRecord(), 'already imported as ' + record);
  var df = new ydn.async.Deferred();

  var req = ydn.crm.Ch.SReq.PUT_RECORD;
  var fn = this.contact_.getFullName();
  var new_record = {
    'email1': this.contact_.getEmails()[0],
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
  var ph = this.contact_.getPhoneNumbers();
  if (ph[0]) {
    new_record['phone_work'] = ph[0];
  }
  var data = {
    'module': this.getModuleName(),
    'record': new_record
  };

  this.logger.finer('sending ' + req + ' ' + JSON.stringify(data));
  return this.getChannel().send(req, data).addCallback(function(data) {
    if (ydn.crm.sugar.model.GData.DEBUG) {
      window.console.log(data);
    }
    var record = new ydn.crm.sugar.Record(this.getDomain(), this.getModuleName(), data);
    this.logger.finer(record + ' created.');
    this.setRecord(record);
  }, this);
};


/**
 * Update gdata from database.
 * @param {!ContactEntry} entry
 * @protected
 */
ydn.crm.sugar.model.GData.prototype.updateGData = function(entry) {
  var old = this.contact_;
  this.contact_ = new ydn.gdata.m8.ContactEntry(entry);
  var gc = new ydn.crm.sugar.model.events.GDataEvent(this.getModuleName(),
      old, this.contact_, this);
  this.dispatchEvent(gc);
};


/**
 * Link GData Contact to sugar record
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GData.prototype.link = function() {
  /**
   * @type {ydn.crm.sugar.Record}
   */
  var record = this.getRecord();
  if (!record) {
    return goog.async.Deferred.fail('no Record to link.');
  }
  var sugar_id = record.getId();
  // window.console.log(record);
  goog.asserts.assertString(sugar_id, 'no Record ID'); // this will not happen.
  var gdata = this.getGData();
  if (!gdata) {
    return goog.async.Deferred.fail('Not contact data to link.');
  }
  var xp = gdata.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain(), this.getModuleName(), record.getId());
  if (xp) {
    return goog.async.Deferred.fail('Contact ' + gdata.getSingleId() + ' already link to ' +
        xp.record_id);
  }

  var ex_id = new ydn.gdata.m8.ExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain(), this.getModuleName(), record.getId(),
      (+gdata.getUpdatedDate()), record.getUpdated());
  var data = {
    'kind': gdata.getKind(),
    'gdata-id': gdata.getId(),
    'external-id': ex_id.toExternalId()
  };
  var df1 = this.getChannel().send(ydn.crm.Ch.SReq.LINK, data);
  return df1.addCallback(function(entry) {
    if (ydn.crm.sugar.model.GData.DEBUG) {
      window.console.log('link', entry);
    }
    this.updateGData(entry);
  }, this);

};


/**
 * Update or create model.
 * @return {!ydn.async.Deferred}
 */
ydn.crm.sugar.model.GData.prototype.save = function() {
  var record = this.getRecord();
  goog.asserts.assertObject(record, 'no record save');
  if (ydn.crm.sugar.model.GData.DEBUG) {
    window.console.log(record);
  }
  var df = this.getChannel().send(ydn.crm.Ch.SReq.PUT_RECORD, record);
  df.addCallback(function(data) {
    goog.asserts.assert(data, this + ' receiving unexpected put record result ' + data);
    goog.asserts.assertString(data['id'], this + ' record id missing in ' + data);
    // cannot check module name
    if (ydn.crm.sugar.model.GData.DEBUG) {
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
  ydn.crm.sugar.model.GData.prototype.toString = function() {
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
