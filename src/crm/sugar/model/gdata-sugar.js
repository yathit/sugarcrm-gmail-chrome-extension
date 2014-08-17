
goog.provide('ydn.crm.sugar.model.GDataSugar');
goog.require('ydn.crm.sugar.model.GDataRecord');
goog.require('ydn.crm.sugar.model.Sugar');



/**
 * Sugar model with context to inbox.
 * @param {SugarCrm.About} about setup for particular domain.
 * @param {Array.<SugarCrm.ModuleInfo>} modules_info
 * @param {string} gdata_account Google account id, i.e., email address
 * @constructor
 * @extends {ydn.crm.sugar.model.Sugar}
 * @struct
 */
ydn.crm.sugar.model.GDataSugar = function(about, modules_info, gdata_account) {
  goog.base(this, about, modules_info);
  /**
   * Gmail context contact data.
   * @type {ydn.gdata.m8.NewContactEntry}
   * @private
   */
  this.context_ = null;
  /**
   * Contact entry from the database that match with context, that is not associate
   * with GData record.
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
  /**
   * List of modules available.
   * @type {Object.<!ydn.crm.sugar.model.GDataRecord>}
   * @private
   */
  this.modules_ = {};
};
goog.inherits(ydn.crm.sugar.model.GDataSugar, ydn.crm.sugar.model.Sugar);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.GDataSugar.DEBUG = false;


/**
 * @return {ydn.gdata.m8.ContactEntry} return GData contact that is not associate
 * with any module.
 */
ydn.crm.sugar.model.GDataSugar.prototype.getGData = function() {
  return this.contact_;
};


/**
 * @return {ydn.gdata.m8.NewContactEntry} return context contact from gmail panel
 * with any module.
 */
ydn.crm.sugar.model.GDataSugar.prototype.getContextGData = function() {
  return this.context_;
};


/**
 * @return {string} return a google account id, an email address.
 */
ydn.crm.sugar.model.GDataSugar.prototype.getGDataAccount = function() {
  return this.gdata_account;
};


/**
 * Create or get module.
 * @param {ydn.crm.sugar.ModuleName} name
 * @return {!ydn.crm.sugar.model.GDataRecord}
 */
ydn.crm.sugar.model.GDataSugar.prototype.getModuleModel = function(name) {

  if (!this.modules_[name]) {
    this.modules_[name] = new ydn.crm.sugar.model.GDataRecord(this, name);
    this.handler.listen(this.modules_[name], [
      ydn.crm.sugar.model.events.Type.RECORD_CHANGE,
      ydn.crm.sugar.model.events.Type.GDATA_CHANGE], this.handleModuleChanges);
  }
  return this.modules_[name];
};


/**
 * Handle changes in module record and gdata.
 * @param {ydn.crm.sugar.model.events.Event} e
 */
ydn.crm.sugar.model.GDataSugar.prototype.handleModuleChanges = function(e) {

};


/**
 * @return {?string}
 */
ydn.crm.sugar.model.GDataSugar.prototype.getContextGmail = function() {
  return this.context_ ? this.context_.getEmails()[0] || null : null;
};


/**
 * Score entries aginst target.
 * @param {Array.<ydn.gdata.m8.ContactEntry>} contacts this will be sorted by
 * scores.
 * @return {Array.<number>} return respective score.
 */
ydn.crm.sugar.model.GDataSugar.prototype.score = function(contacts) {

  var scores = [];
  for (var i = 0; i < contacts.length; i++) {
    scores[i] = this.context_.scoreSimilarity(contacts[i]);
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
 * Link GData Contact to sugar record
 * @param {!ydn.crm.sugar.Record} record The SugarCRM record to link with.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GDataSugar.prototype.link = function(record) {
  var sugar_id = record.getId();
  var module_name = record.getModule();
  // window.console.log(record);
  goog.asserts.assertString(sugar_id, 'no Record ID'); // this will not happen.
  var gdata = this.contact_;
  if (!gdata) {
    return goog.async.Deferred.fail('Not contact data to link.');
  }
  var xp = gdata.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain(), module_name);
  if (xp) {
    // todo: should we be updating ?
    return goog.async.Deferred.fail('Contact ' + gdata.getSingleId() + ' already link to ' +
        xp.record_id + ' with the module ' + module_name);
  }

  var ex_id = new ydn.gdata.m8.ExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain(), module_name, record.getId(),
      (+gdata.getUpdatedDate()), record.getUpdated());
  var data = {
    'kind': gdata.getKind(),
    'gdata-id': gdata.getId(),
    'external-id': ex_id.toExternalId()
  };
  var df1 = this.getChannel().send(ydn.crm.Ch.SReq.LINK, data);
  return df1.addCallback(function(entry) {
    if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
      window.console.log('link', entry);
    }
    var old = this.contact_;
    this.contact_ = null; // since contact is already assigned to a module
    var gc = new ydn.crm.sugar.model.events.GDataChangedEvent(old, this.contact_, this);
    this.dispatchEvent(gc);
  }, this);

};


/**
 * Export SugarCRM record to Gmail contact
 * @param {!ydn.crm.sugar.Record} record The SugarCRM record to export.
 * @return {!goog.async.Deferred} ContactEntry
 */
ydn.crm.sugar.model.GDataSugar.prototype.export2GData = function(record) {
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.EXPORT_RECORD, record.toJSON())
      .addCallback(function(entry) {
        var old_contact = this.contact_;
        this.contact_ = new ydn.gdata.m8.ContactEntry(entry);
        var ev = new ydn.crm.sugar.model.events.GDataUpdatedEvent(old_contact, this.contact_, this);
        this.dispatchEvent(ev);
      }, this);
};


/**
 * Update gmail context.
 * @param {string?} email found in sniffing gmail thread.
 * @param {string?} full_name found in sniffing gmail thread.
 * @param {string?} phone found in sniffing gmail thread.
 */
ydn.crm.sugar.model.GDataSugar.prototype.update = function(email, full_name, phone) {
  if (this.isLogin()) {
    this.update_(email, full_name, phone);
  } else {
    // background page dispatch login event, but glitchy.
    // remove this code if background page notify changes in login and host permission
    // status.
    this.updateStatus().addBoth(function() {
      this.update_(email, full_name, phone);
    }, this);
  }
};


/**
 * Update gmail context.
 * @param {string?} email found in sniffing gmail thread.
 * @param {string?} full_name found in sniffing gmail thread.
 * @param {string?} phone found in sniffing gmail thread.
 * @private
 */
ydn.crm.sugar.model.GDataSugar.prototype.update_ = function(email, full_name, phone) {
  if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
    window.console.log(this + ' update for ' + email);
  }
  var old_context = this.context_;
  var old_contact = this.contact_;

  this.context_ = null;
  this.contact_ = null;
  if (email) {
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
    this.context_ = new ydn.gdata.m8.NewContactEntry(this.gdata_account, gdata);
    // query to gdata.
    ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_LIST_CONTACT_BY_EMAIL, email).addCallbacks(function(x) {
      var results = /** @type {Array.<!ContactEntry>} */ (x);
      var contacts = results.map(function(x) {
        return new ydn.gdata.m8.ContactEntry(x);
      });
      var scores = this.score(contacts);
      if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
        window.console.log(results, scores, contacts);
      }
      // Note: Module listener will pop out `contacts` if they are associated with the module
      var gc = new ydn.crm.sugar.model.events.ContextGDataChangeEvent(this.getDomain(), this.context_, contacts, this);
      this.dispatchEvent(gc);
      // a contact entry not associated with GData record.
      this.contact_ = gc.contacts[0] || null;
      var ev = new ydn.crm.sugar.model.events.GDataChangedEvent(old_contact, this.contact_, this);
      this.dispatchEvent(ev);
    }, function(e) {
      throw e;
    }, this);
  } else {
    var gc = new ydn.crm.sugar.model.events.ContextGDataChangeEvent(this.getDomain(), null, [], this);
    this.dispatchEvent(gc);
    var ev = new ydn.crm.sugar.model.events.GDataChangedEvent(old_contact, this.contact_, this);
    this.dispatchEvent(ev);
    return;
  }
};


/**
 * Get list of sugarcrm instance, of which login.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GDataSugar.list = function() {
  var user = ydn.crm.ui.UserSetting.getInstance();
  return user.onReady().branch().addCallback(function() {
    return ydn.msg.getChannel().send('list-sugarcrm').addCallback(function(abouts) {
      var models = [];
      var dfs = [];
      for (var i = 0; i < abouts.length; i++) {
        var about = /** @type {SugarCrm.About} */ (abouts[i]);
        if (about.isLogin) {
          dfs.push(user.getModuleInfo(about.domain).addCallback(function(info) {
            return new ydn.crm.sugar.model.GDataSugar(this, info, user.getGmail());
          }, about));
        }
      }
      return goog.async.DeferredList.gatherResults(dfs);
    });
  });

};
