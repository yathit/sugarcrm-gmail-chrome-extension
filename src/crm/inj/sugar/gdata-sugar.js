// Copyright 2014 YDN Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview SugarCRM model with context to GData.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.inj.sugar.model.GDataSugar');
goog.require('ydn.crm.inj.sugar.GDataModule');
goog.require('ydn.crm.sugar.model.Sugar');



/**
 * SugarCRM model with context to GData.
 * @param {SugarCrm.About} about setup for particular domain.
 * @param {Array.<SugarCrm.ModuleInfo>} modules_info
 * @constructor
 * @extends {ydn.crm.sugar.model.Sugar}
 * @struct
 */
ydn.crm.inj.sugar.model.GDataSugar = function(about, modules_info) {
  goog.base(this, about, modules_info);
  /**
   * @type {Object.<!ydn.crm.inj.sugar.GDataModule>}
   * @private
   */
  this.records_ = {};
  /**
   * @private
   * @type {ydn.crm.inj.ContactModel}
   */
  this.contact_model_ = null;
  /**
   * List of GData contact query with context email.
   * @type {Array.<ydn.gdata.m8.ContactEntry>}
   * @private
   */
  this.gdata_contacts_ = null;
};
goog.inherits(ydn.crm.inj.sugar.model.GDataSugar, ydn.crm.sugar.model.Sugar);


/**
 * Get GData contact for a given module or without.
 * @param {string?} module_name module of the contact. If not given, contact
 * entry without any link to module are given.
 * @return {{module_name: string?, contact: ydn.gdata.m8.ContactEntry}}
 */
ydn.crm.inj.sugar.model.GDataSugar.prototype.getGData = function(module_name) {

  var n = this.gdata_contacts_ ? this.gdata_contacts_.length : 0;
  for (var i = 0; i < n; i++) {
    var contact = this.gdata_contacts_[i];
    var xp = contact.getExternalId(ydn.gdata.m8.ExternalId.Scheme.SUGARCRM,
        this.getDomain(), module_name);
    if (module_name && xp) {
      return {
        module_name: module_name,
        contact: contact
      };
    } else if (!module_name && !xp) {
      return {
        module_name: null,
        contact: contact
      };
    }
  }

  return {
    module_name: module_name,
    contact: null
  };
};


/**
 * Update GData contact. This will dispatch GData change event.
 * @param {string} module_name
 * @param {ydn.gdata.m8.ContactEntry} contact
 * @return {boolean} true if appended, false if updated.
 */
ydn.crm.inj.sugar.model.GDataSugar.prototype.setGData = function(module_name, contact) {
  // module_name is not used, but asked for future expansion.
  for (var i = 0; i < this.gdata_contacts_.length; i++) {
    var ex = this.gdata_contacts_[i];
    if (ex.getId() == contact.getId()) {
      var old = this.gdata_contacts_[i];
      this.gdata_contacts_[i] = contact;
      var gc = new ydn.crm.sugar.model.events.GDataUpdatedEvent(old, contact, this);
      this.dispatchEvent(gc);
      return false;
    }
  }
  this.gdata_contacts_.push(contact);
  var ge = new ydn.crm.sugar.model.events.GDataChangedEvent(null, contact, this);
  this.dispatchEvent(ge);
  return true;
};


/**
 * Update contact data from inbox thread.
 * @param {ydn.crm.inj.ContactModel} m
 */
ydn.crm.inj.sugar.model.GDataSugar.prototype.setContactModel = function(m) {
  this.contact_model_ = m;
  this.gdata_contacts_ = null;
  var e = new ydn.crm.sugar.model.events.ContextDataChangeEvent(m, this);
  this.dispatchEvent(e);
  if (!this.contact_model_) {
    return;
  }

  var email = m ? m.getEmail() : null;
  if (email) {
    var df = ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_LIST_CONTACT_BY_EMAIL, email);
    df.addCallback(function(entries) {
      this.gdata_contacts_ = entries.map(function(data) {
        return new ydn.gdata.m8.ContactEntry(data);
      });
      if (ydn.crm.sugar.model.Sugar.DEBUG) {
        window.console.log(this + ' gdata contact query result ' + entries.length +
            ' entries for ' + email);
      }
      // sort contact by matching score.
      var scores = this.contact_model_.score(this.gdata_contacts_);
      if (this.gdata_contacts_.length > 0) {
        var ge = new ydn.crm.sugar.model.events.GDataChangedEvent(null, this.gdata_contacts_[0], this);
        this.dispatchEvent(ge);
      }
    }, this);
  }
};


/**
 * @return {ydn.crm.inj.ContactModel}
 */
ydn.crm.inj.sugar.model.GDataSugar.prototype.getContactModel = function() {
  return this.contact_model_;
};


/**
 * @param {Event} e any event to will re-dispatch by this.
 * @private
 */
ydn.crm.inj.sugar.model.GDataSugar.prototype.handleRecordChange_ = function(e) {
  this.dispatchEvent(e);
};


/**
 * Create a new field model if the field present in the record.
 * @param {ydn.crm.sugar.ModuleName} name
 * @return {!ydn.crm.inj.sugar.GDataModule}
 */
ydn.crm.inj.sugar.model.GDataSugar.prototype.getRecordModel = function(name) {
  if (!this.records_[name]) {
    goog.asserts.assertObject(this.module_info[name], 'module "' + name +
        '" not exists in ' + this);
    this.records_[name] = new ydn.crm.inj.sugar.GDataModule(this, name);
    this.handler.listen(this.records_[name], ydn.crm.sugar.model.events.Type.RECORD_CHANGE,
        this.handleRecordChange_);
  }
  return this.records_[name];
};


/**
 * @override
 * @protected
 */
ydn.crm.inj.sugar.model.GDataSugar.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  for (var name in this.records_) {
    this.records_[name].dispose();
  }
  this.records_ = null;
  this.contact_model_ = null;
  this.gdata_contacts_ = null;
};


if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.inj.sugar.model.GDataSugar.prototype.toString = function() {
    return 'ydn.crm.inj.sugar.model.GDataSugar:' + this.getDomain();
  };
}
