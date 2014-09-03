// Copyright 2014 YDN Authors. All Rights Reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @fileoverview SugarCRM model with gmail context.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.sugar.model.GDataSugar');
goog.require('ydn.crm.inj.ContactModel');
goog.require('ydn.crm.sugar.model.Sugar');



/**
 * Sugar model with context to inbox.
 * @param {SugarCrm.About} about setup for particular domain.
 * @param {Array.<SugarCrm.ModuleInfo>} modules_info
 * @param {string} gdata_account Google account id, i.e., email address
 * @param {SugarCrm.ServerInfo=} opt_info
 * @constructor
 * @extends {ydn.crm.sugar.model.Sugar}
 * @struct
 */
ydn.crm.sugar.model.GDataSugar = function(about, modules_info, gdata_account, opt_info) {
  goog.base(this, about, modules_info, opt_info);
  /**
   * Gmail context contact data.
   * @type {ydn.crm.inj.ContactModel}
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
   * Record from matching context email.
   * @type {?ydn.crm.sugar.Record}
   * @private
   */
  this.record_ = null;
  /**
   * @final
   * @protected
   * @type {string}
   */
  this.gdata_account = gdata_account;

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
 * @return {?ydn.crm.sugar.Record} return sugarcrm record which has same email as
 * context email
 */
ydn.crm.sugar.model.GDataSugar.prototype.getRecord = function() {
  return this.record_;
};


/**
 * @return {ydn.crm.inj.ContactModel} return context contact from gmail panel
 * with any module.
 */
ydn.crm.sugar.model.GDataSugar.prototype.getContext = function() {
  return this.context_;
};


/**
 * @return {string} return a google account id, an email address.
 */
ydn.crm.sugar.model.GDataSugar.prototype.getGDataAccount = function() {
  return this.gdata_account;
};


/**
 * @return {?string}
 */
ydn.crm.sugar.model.GDataSugar.prototype.getContextGmail = function() {
  return this.context_ ? this.context_.getEmail() : null;
};


/**
 * Link GData Contact to sugar record
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GDataSugar.prototype.linkGDataToRecord = function() {
  if (!this.record_) {
    return goog.async.Deferred.fail('No SugarCRM Record to link with Gmail contact.');
  }
  var sugar_id = this.record_.getId();
  var module_name = this.record_.getModule();
  // window.console.log(record);
  goog.asserts.assertString(sugar_id, 'no Record ID'); // this will not happen.
  var gdata = this.contact_;
  if (!gdata) {
    return goog.async.Deferred.fail('Not Gmail contact data to link.');
  }
  var xp = gdata.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain(), module_name);
  if (xp) {
    // todo: should we be updating ?
    return goog.async.Deferred.fail('Contact ' + gdata.getSingleId() + ' already link to ' +
        xp.record_id + ' with the module ' + module_name);
  }

  var ex_id = new ydn.gdata.m8.ExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain(), module_name, this.record_.getId(),
      (+gdata.getUpdatedDate()), this.record_.getUpdated());
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
    this.contact_ = new ydn.gdata.m8.ContactEntry(entry);
    var ev = new ydn.crm.sugar.model.events.ContextChangeEvent(this.context_,
        this.contact_, this.record_);
    this.dispatchEvent(ev);
  }, this);

};


/**
 * Remove external id link GData Contact to sugar record.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GDataSugar.prototype.unlinkGDataToRecord = function() {
  if (!this.record_) {
    return goog.async.Deferred.fail('No SugarCRM Record to unlink with Gmail contact.');
  }
  var sugar_id = this.record_.getId();
  var module_name = this.record_.getModule();
  // window.console.log(record);
  goog.asserts.assertString(sugar_id, 'no Record ID'); // this will not happen.
  var gdata = this.contact_;
  if (!gdata) {
    return goog.async.Deferred.fail('Not Gmail contact data to link.');
  }
  var xp = gdata.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain(), module_name, sugar_id);
  if (!xp) {
    return goog.async.Deferred.fail('No link exists between SugarCRM ' + module_name +
        ' ' + sugar_id + ' and Gmail Contact ' + gdata.getSingleId());
  }

  var data = {
    'kind': gdata.getKind(),
    'gdata-id': gdata.getId(),
    'external-id': xp.getValue()
  };
  var df1 = this.getChannel().send(ydn.crm.Ch.SReq.UNLINK, data);
  return df1.addCallback(function(entry) {
    if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
      window.console.log('unlink', entry);
    }
    this.contact_ = new ydn.gdata.m8.ContactEntry(entry);
    var ev = new ydn.crm.sugar.model.events.ContextChangeEvent(this.context_,
        this.contact_, this.record_);
    this.dispatchEvent(ev);
  }, this);

};


/**
 * Remove all external id link on GData Contact for this SugarCRM instance.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GDataSugar.prototype.unlinkGData = function() {
  var sugar_id = this.record_.getId();
  var module_name = this.record_.getModule();
  // window.console.log(record);
  goog.asserts.assertString(sugar_id, 'no Record ID'); // this will not happen.
  var gdata = this.contact_;
  if (!gdata) {
    return goog.async.Deferred.fail('Not Gmail contact data to link.');
  }
  var xp = gdata.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain());
  if (!xp) {
    return goog.async.Deferred.fail('No link exists for SugarCRM ' + this.getDomain() +
        ' in Gmail Contact ' + gdata.getSingleId());
  }

  var data = {
    'kind': gdata.getKind(),
    'gdata-id': gdata.getId(),
    'external-id': xp.getValue()
  };
  var df1 = this.getChannel().send(ydn.crm.Ch.SReq.UNLINK, data);
  return df1.addCallback(function(entry) {
    if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
      window.console.log('unlink', entry);
    }
    this.contact_ = new ydn.gdata.m8.ContactEntry(entry);
    var ev = new ydn.crm.sugar.model.events.ContextChangeEvent(this.context_,
        this.contact_, this.record_);
    this.dispatchEvent(ev);
  }, this);

};


/**
 * Import from gdata to a new sugar entry.
 * @param {ydn.crm.sugar.ModuleName} m_name module name.
 * @return {!goog.async.Deferred} Return {ydn.crm.sugar.Record} on success.
 */
ydn.crm.sugar.model.GDataSugar.prototype.importToSugar = function(m_name) {
  if (this.record_) {
    return goog.async.Deferred.fail('already imported as ' + this.record_.getId() +
        ' in ' + this.record_.getModule());
  }
  var contact = this.getGData();
  if (!contact) {
    return goog.async.Deferred.fail('no contact gdata to import?');
  }
  var req = ydn.crm.Ch.SReq.IMPORT_GDATA;
  var data = {
    'module': m_name,
    'kind': contact.getKind(),
    'gdata-id': contact.getId()
  };
  if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
    window.console.info('sending ' + req + ' ' + JSON.stringify(data));
  }
  return this.getChannel().send(req, data).addCallback(function(data) {
    if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
      window.console.log(data);
    }
    this.record_ = new ydn.crm.sugar.Record(this.getDomain(), m_name, data);
    var ev = new ydn.crm.sugar.model.events.ContextChangeEvent(this.context_,
        this.contact_, this.record_);
    this.dispatchEvent(ev);
    return this.record_;
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
 * @param {?ydn.crm.inj.ContactModel} cm found in sniffing gmail thread.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GDataSugar.prototype.update = function(cm) {
  if (this.isLogin()) {
    return this.updateContext_(cm);
  } else {
    // background page dispatch login event, but glitchy.
    // remove this code if background page notify changes in login and host permission
    // status.
    return this.updateStatus().addBoth(function() {
      return this.updateContext_(cm);
    }, this);
  }
};


/**
 * Update gmail context.
 * @param {ydn.crm.inj.ContactModel} cm contact email found in sniffing gmail thread.
 * @param {ydn.gdata.m8.ContactEntry=} opt_contact
 * @return {!goog.async.Deferred}
 * @private
 */
ydn.crm.sugar.model.GDataSugar.prototype.processRecord_ = function(cm, opt_contact) {

  var email = cm.getEmail();
  var query = [];
  for (var i = 0; i < ydn.crm.sugar.PEOPLE_MODULES.length; i++) {
    query[i] = {
      'store': ydn.crm.sugar.PEOPLE_MODULES[i],
      'index': 'ydn$emails',
      'key': email
    };
  }

  return this.getChannel().send(ydn.crm.Ch.SReq.QUERY, query).addCallback(function(x) {
    var query_results = /** @type {Array.<SugarCrm.Query>} */ (x);
    for (var j = 0; j < query_results.length; j++) {
      var query_result = query_results[j];
      if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
        var n = query_result.result ? query_result.result.length : 0;
        window.console.log(this + ' receiving sugarcrm ' + n + ' query result for ' +
            email + ' to ' + query_result.store, query_result);
      }
      if (query_result.result[0]) {
        var m_name = /** @type {ydn.crm.sugar.ModuleName} */ (query_result.store);
        var r = new ydn.crm.sugar.Record(this.getDomain(), m_name,
            query_result.result[0]);
        return new ydn.crm.sugar.model.events.ContextChangeEvent(cm, opt_contact, r);
      }
    }
    return new ydn.crm.sugar.model.events.ContextChangeEvent(cm, opt_contact);
  }, this);
};


/**
 * Check gdata and record are in synced.
 * @return {boolean}
 */
ydn.crm.sugar.model.GDataSugar.prototype.isInSynced = function() {
  if (!this.contact_ || !this.record_) {
    return false;
  }
  var xp = this.contact_.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain(), this.record_.getModule(), this.record_.getId());
  return !!xp;
};


/**
 * Process given gdata contact if it has linked external id to SugarCRM record.
 * @param {ydn.crm.inj.ContactModel} cm contact email found in sniffing gmail thread.
 * @param {!ydn.gdata.m8.ContactEntry} contact
 * @return {!goog.async.Deferred}
 * @private
 */
ydn.crm.sugar.model.GDataSugar.prototype.processSync_ = function(cm, contact) {
  var xp = contact.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
      this.getDomain());
  if (xp) {
    var id_query = [{
      'store': xp.module,
      'index': 'id',
      'key': xp.record_id
    }];
    return this.getChannel().send(ydn.crm.Ch.SReq.QUERY, id_query).addCallback(function(x) {
      var result = /** @type {SugarCrm.Query} */ (x[0]);
      if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
        window.console.log(result);
      }
      if (result && result.result[0]) {
        var m_name = /** @type {ydn.crm.sugar.ModuleName} */ (result.store);
        var r = new ydn.crm.sugar.Record(this.getDomain(), m_name,
            result.result[0]);
        return new ydn.crm.sugar.model.events.ContextChangeEvent(cm, contact, r);
      } else {
        if (goog.DEBUG) {
          window.console.warn('link id: ' + xp.record_id + ' no longer available, deleting..');
          window.console.error('Removing external id not implemented');
        }
        this.processRecord_(cm, contact);
      }
    }, this);
  } else {
    return this.processRecord_(cm, contact);
  }
};


/**
 * Process for GData contact if target email is exist in GData contacts list.
 * @param {ydn.crm.inj.ContactModel} cm contact email found in sniffing gmail thread.
 * @return {!goog.async.Deferred}
 * @private
 */
ydn.crm.sugar.model.GDataSugar.prototype.processContact_ = function(cm) {

  if (cm) {
    var email = cm.getEmail();

    // query to gdata.
    return ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_LIST_CONTACT_BY_EMAIL, email).addCallback(function(x) {
      var results = /** @type {Array.<!ContactEntry>} */ (x);
      var contacts = results.map(function(x) {
        return new ydn.gdata.m8.ContactEntry(x);
      });
      var scores = cm.score(contacts);
      if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
        window.console.log(results, scores, contacts);
      }
      if (contacts[0]) {
        return this.processSync_(cm, contacts[0]);
      } else {
        return this.processRecord_(cm);
      }
    }, this);
  } else {
    var null_ev = new ydn.crm.sugar.model.events.ContextChangeEvent(null);
    return goog.async.Deferred.succeed(null_ev);
  }
};


/**
 * Update gmail context.
 * @param {ydn.crm.inj.ContactModel} cm contact email found in sniffing gmail thread.
 * @return {!goog.async.Deferred}
 * @private
 */
ydn.crm.sugar.model.GDataSugar.prototype.updateContext_ = function(cm) {
  if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
    window.console.log(this + ' update context for ' + cm);
  }
  return this.processContact_(cm).addCallbacks(function(ev) {
    var cce = /** @type {ydn.crm.sugar.model.events.ContextChangeEvent} */ (ev);
    this.contact_ = cce.gdata;
    this.context_ = cce.context;
    this.record_ = cce.record;
    this.dispatchEvent(ev);
  }, function(e) {
    window.console.error(e.stack || e);
  }, this);
};


/**
 * Update gmail context.
 * @param {ydn.crm.inj.ContactModel} cm found in sniffing gmail thread.
 * @private
 */
ydn.crm.sugar.model.GDataSugar.prototype.update_ = function(cm) {
  if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
    window.console.log(this + ' update for ' + cm);
  }
  var old_contact = this.contact_;

  this.context_ = cm;
  this.contact_ = null;
  if (cm) {
    var email = cm.getEmail();

    var context_gdata = this.context_.toContactEntry();
    // query to gdata.
    ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_LIST_CONTACT_BY_EMAIL, email).addCallbacks(function(x) {
      var results = /** @type {Array.<!ContactEntry>} */ (x);
      var contacts = results.map(function(x) {
        return new ydn.gdata.m8.ContactEntry(x);
      });
      var scores = this.context_.score(contacts);
      if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
        window.console.log(results, scores, contacts);
      }
      // Note: Module listener will pop out `contacts` if they are associated with the module
      var gc = new ydn.crm.sugar.model.events.ContextGDataChangeEvent(this.getDomain(),
          this.context_, contacts, this);
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
  }
};


/**
 * Get list of sugarcrm instance, of which login.
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugar.model.GDataSugar.list = function() {
  var user = ydn.crm.ui.UserSetting.getInstance();
  return user.onReady().branch().addCallback(function() {

    return ydn.msg.getChannel().send(ydn.crm.Ch.Req.LIST_SUGAR_DOMAIN).addCallback(
        function(sugars) {
          var dfs = [];
          for (var i = 0; i < sugars.length; i++) {
            var domain = /** @type {string} */ (sugars[i]);
            var ch = ydn.msg.getChannel(ydn.msg.Group.SUGAR, domain);
            var df = ch.send(ydn.crm.Ch.SReq.DETAILS).addCallback(function(x) {
              var details = /** @type {SugarCrm.Details} */ (x);
              for (var i = 0; i < details.modulesInfo.length; i++) {
                user.fixSugarCrmModuleMeta(details.modulesInfo[i]);
              }
              var ac = user.getLoginEmail();
              return new ydn.crm.sugar.model.GDataSugar(details.about,
                  details.modulesInfo, ac, details.serverInfo);
            }, this);
            dfs.push(df);
          }
          return goog.async.DeferredList.gatherResults(dfs);
        }, this);

  });

};


/**
 * Add context inbox contact to a new sugar entry.
 * @param {ydn.crm.sugar.ModuleName} m_name
 * @return {!goog.async.Deferred} Return {ydn.crm.sugar.Record} on success.
 */
ydn.crm.sugar.model.GDataSugar.prototype.addToSugar = function(m_name) {
  if (this.record_) {
    return goog.async.Deferred.fail('already exist as ' + this.record_.getId() +
        ' in ' + this.record_.getModule());
  }
  var email = this.context_.getEmail();
  if (!email) {
    return goog.async.Deferred.fail('No data to import.');
  }

  var df = new ydn.async.Deferred();

  var req = ydn.crm.Ch.SReq.PUT_RECORD;
  var fn = this.context_.getFullName();
  var new_record = {
    'email1': email,
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
  var data = {
    'module': m_name,
    'record': new_record
  };
  if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
    window.console.log('sending ' + req + ' ' + JSON.stringify(data));
  }

  return this.getChannel().send(req, data).addCallback(function(data) {
    if (ydn.crm.sugar.model.GDataSugar.DEBUG) {
      window.console.log(data);
    }
    this.record_ = new ydn.crm.sugar.Record(this.getDomain(), m_name, data);
    var ev = new ydn.crm.sugar.model.events.ContextChangeEvent(this.context_,
        this.contact_, this.record_);
    this.dispatchEvent(ev);
  }, this);
};

