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
 * @fileoverview Contact model sniff from gmail inbox content.
 */


goog.provide('ydn.crm.inj.Context');
goog.require('ydn.async.Deferred');
goog.require('ydn.gdata.m8.NewContactEntry');



/**
 * Sugar contact data model.
 * @param {string} gdata_account user gdata account.
 * @param {string} email sniffed email.
 * @param {string?} full_name sniffed full name.
 * @constructor
 * @struct
 */
ydn.crm.inj.Context = function(gdata_account, email, full_name) {
  /**
   * @final
   * @protected
   * @type {string}
   */
  this.gdata_account = gdata_account;
  /**
   * @final
   * @type {string}
   * @private
   */
  this.email_ = email;
  /**
   * @final
   * @type {?string}
   * @private
   */
  this.full_name_ = full_name;

};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.Context.DEBUG = false;


/**
 * @return {string}
 */
ydn.crm.inj.Context.prototype.getEmail = function() {
  return this.email_;
};


/**
 * @return {?string}
 */
ydn.crm.inj.Context.prototype.getFullName = function() {
  return this.full_name_;
};


/**
 * @return {ydn.gdata.m8.NewContactEntry} return newly created contact entry.
 */
ydn.crm.inj.Context.prototype.toContactEntry = function() {
  var gdata = /** @type {!ContactEntry} */ (/** @type {Object} */ ({
    'gd$email': [{
      'address': this.email_
    }]
  }));
  if (this.full_name_) {
    gdata.gd$name = /** @type {!GDataName} */ (/** @type {Object} */ ({
      'gd$fullName': {
        '$t': this.full_name_
      }
    }));
  }

  return new ydn.gdata.m8.NewContactEntry(this.gdata_account, gdata);
};


/**
 * Score contact entries against target for similarity.
 * @param {Array.<ydn.gdata.m8.ContactEntry>} contacts this will be sorted by
 * scores.
 * @return {Array.<number>} return respective score.
 */
ydn.crm.inj.Context.prototype.score = function(contacts) {

  var target = this.toContactEntry();

  var scores = [];
  for (var i = 0; i < contacts.length; i++) {
    scores[i] = target.scoreSimilarity(contacts[i]);
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


if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.inj.Context.prototype.toString = function() {
    return 'ContactModel:' + this.email_;
  };
}


