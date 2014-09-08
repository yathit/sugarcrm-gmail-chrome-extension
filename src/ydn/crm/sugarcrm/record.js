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
 * @fileoverview SugarCRM Record wrapper object.
 *
 */



goog.provide('ydn.crm.sugarcrm.Record');
goog.require('ydn.crm.sugarcrm');



/**
 * SugarCRM Record wrapper object.
 * @param {string} domain SugarCRM instance identifier as domain name,
 * eg: "fjochv4737.trial.sugarcrm.eu".
 * @param {ydn.crm.sugarcrm.ModuleName} module
 * @param {SugarCrm.Record=} opt_obj name SugarCRM record entry.
 * @constructor
 * @struct
 */
ydn.crm.sugarcrm.Record = function(domain, module, opt_obj) {
  /**
   * @final
   * @type {string}
   */
  this.domain = domain;
  /**
   * @final
   * @protected
   * @type {ydn.crm.sugarcrm.ModuleName}
   */
  this.module = module;

  /**
   * Name value pairs.
   * @protected
   * @type {!SugarCrm.Record}
   */
  this.obj = opt_obj || /** @type {!SugarCrm.Record} */ ({});
  // this.key_path = module == ydn.crm.sugarcrm.ModuleName.EMAIL_TEXT ? 'email_id' : 'id';
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugarcrm.Record.DEBUG = false;


/**
 * @protected
 * @final
 * @type {string}
 */
ydn.crm.sugarcrm.Record.prototype.key_path = 'id';


/**
 * @return {boolean}
 */
ydn.crm.sugarcrm.Record.prototype.hasRecord = function() {
  return goog.isDefAndNotNull(this.obj[this.key_path]);
};


/**
 * @return {string}
 */
ydn.crm.sugarcrm.Record.prototype.getDomain = function() {
  return this.domain;
};


/**
 * @return {ydn.crm.sugarcrm.ModuleName}
 */
ydn.crm.sugarcrm.Record.prototype.getModule = function() {
  return this.module;
};


/**
 * @return {?SugarCrm.Record}
 */
ydn.crm.sugarcrm.Record.prototype.getData = function() {
  return this.obj;
};


/**
 * Set record data.
 * @param {SugarCrm.Record?} obj
 */
ydn.crm.sugarcrm.Record.prototype.setData = function(obj) {
  if (obj) {
    if (ydn.crm.sugarcrm.Record.DEBUG && !obj[this.key_path]) {
      window.console.log(obj);
    }
    goog.asserts.assertString(obj[this.key_path], 'id missing in record');
  }
  this.obj = obj || /** @type {!SugarCrm.Record} */ ({});;
};


/**
 * Merge data.
 * @param {SugarCrm.Record} obj
 */
ydn.crm.sugarcrm.Record.prototype.updateData = function(obj) {
  if (obj) {
    if (!this.obj) {
      this.obj = /** @type {!SugarCrm.Record} */ (/** @type {Object} */ ({}));
    }
    for (var name in obj) {
      this.obj[name] = obj[name];
    }
  }
};


/**
 * @return {string}
 * @throws assertion if id not set.
 */
ydn.crm.sugarcrm.Record.prototype.getId = function() {
  var id = this.obj[this.key_path];
  if (ydn.crm.sugarcrm.Record.DEBUG && !id) {
    window.console.log(this.obj);
  }
  goog.asserts.assert(id, 'getting empty id of a record');
  return id;
};


/**
 * Get record modified date.
 * @return {number}
 */
ydn.crm.sugarcrm.Record.prototype.getUpdated = function() {
  if (this.obj) {
    return +ydn.crm.sugarcrm.utils.parseDate(this.obj['date_modified']);
  } else {
    return NaN;
  }
};


/**
 * Get deadline.
 * @return {Date}
 */
ydn.crm.sugarcrm.Record.prototype.getDeadline = function() {
  if (this.obj) {
    var field = ydn.crm.sugarcrm.Record.getFieldNameForDeadline(this.module);
    return ydn.crm.sugarcrm.utils.parseDate(this.obj[field]);
  } else {
    return new Date('NaN');
  }
};


/**
 * Return index name for determining deadline.
 * @param {ydn.crm.sugarcrm.ModuleName} m_name
 * @return {string}
 */
ydn.crm.sugarcrm.Record.getIndexForDeadline = function(m_name) {
  return 'assigned_user_id, ' + ydn.crm.sugarcrm.Record.getFieldNameForDeadline(m_name);
};


/**
 * Return field name for determining deadline.
 * @param {ydn.crm.sugarcrm.ModuleName} m_name
 * @return {string}
 */
ydn.crm.sugarcrm.Record.getFieldNameForDeadline = function(m_name) {
  if (m_name == ydn.crm.sugarcrm.ModuleName.TASKS) {
    return 'date_due';
  } else if (m_name == ydn.crm.sugarcrm.ModuleName.OPPORTUNITIES) {
    return 'date_closed';
  } else {
    return 'date_start';
  }
};


/**
 * Return noun form of the module.
 * Eg: `Contacts` return as `Contact`.
 * @param {ydn.crm.sugarcrm.ModuleName} name
 * @return {string}
 */
ydn.crm.sugarcrm.Record.moduleAsNoun = function(name) {
  return name.replace(/ies$/, 'y').replace(/s$/, '');
};


/**
 * Return verb form of the module.
 * Eg: `Meetings` return as `Meet`, `Opportinities` return 'Close'.
 * @param {ydn.crm.sugarcrm.ModuleName} name
 * @return {string}
 */
ydn.crm.sugarcrm.Record.moduleAsVerb = function(name) {
  if (name == ydn.crm.sugarcrm.ModuleName.CALLS) {
    return 'call';
  } else if (name == ydn.crm.sugarcrm.ModuleName.TASKS) {
    return 'finish';
  } else if (name == ydn.crm.sugarcrm.ModuleName.MEETINGS) {
    return 'meet';
  } else if (name == ydn.crm.sugarcrm.ModuleName.OPPORTUNITIES) {
    return 'close';
  } else {
    return 'do';
  }
};


/**
 * Get suitable title of this record.
 * @return {string}
 */
ydn.crm.sugarcrm.Record.prototype.getLabel = function() {
  if (!this.obj) {
    return '';
  }
  if (this.obj['name']) {
    return this.obj['name'];
  }
  var full_name = this.obj['full_name'] || this.obj['name'];
  if (full_name) {
    return full_name;
  } else if (this.obj['first_name'] || this.obj['last_name']) {
    var first_name = (this.obj['first_name'] || '').trim();
    var last_name = (this.obj['last_name'] || '').trim();
    return first_name + ' ' + last_name;
  } else {
    return this.obj[this.key_path];
  }
};


/**
 * List of keys.
 * @return {Array.<string>}
 */
ydn.crm.sugarcrm.Record.prototype.names = function() {
  return Object.keys(this.obj);
};


/**
 * @param {string} name
 * @return {?string}
 */
ydn.crm.sugarcrm.Record.prototype.value = function(name) {
  return this.obj[name];
};


/**
 * @param {string} name
 * @return {boolean}
 */
ydn.crm.sugarcrm.Record.prototype.hasField = function(name) {
  return goog.isDefAndNotNull(this.obj[name]);
};


/**
 * Set a field value. If record value is not exist, it will be initialize
 * with empty object.
 * @param {string} name
 * @param {*} value
 */
ydn.crm.sugarcrm.Record.prototype.setValue = function(name, value) {
  if (!this.obj) {
    this.obj = /** @type {!SugarCrm.Record} */ (/** @type {Object} */({}));
  }
  this.obj[name] = value;
};


/**
 * @inheritDoc
 */
ydn.crm.sugarcrm.Record.prototype.toJSON = function() {
  return {
    'domain': this.domain,
    'module': this.module,
    'obj': this.obj
  };
};


/**
 * Deserialize JSON object.
 * @param {!Object} json
 * @return {!ydn.crm.sugarcrm.Record}
 */
ydn.crm.sugarcrm.Record.fromJSON = function(json) {
  return new ydn.crm.sugarcrm.Record(json['domain'], json['module'], json['obj']);
};


if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugarcrm.Record.prototype.toString = function() {
    var id = this.obj ? this.obj[this.key_path] : undefined;
    return 'Record:' + this.module + ':' + id;
  };
}
