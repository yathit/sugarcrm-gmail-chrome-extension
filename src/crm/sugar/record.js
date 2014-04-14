/**
 * Created by kyawtun on 29/12/13.
 */


goog.provide('ydn.crm.sugar.Record');
goog.require('ydn.crm.sugar');



/**
 * SugarCRM record.
 * @param {string} domain
 * @param {ydn.crm.sugar.ModuleName} module
 * @param {SugarCrm.Record=} opt_obj name value pairs
 * @constructor
 * @struct
 */
ydn.crm.sugar.Record = function(domain, module, opt_obj) {
  /**
   * @final
   * @type {string}
   */
  this.domain = domain;
  /**
   * @final
   * @protected
   * @type {ydn.crm.sugar.ModuleName}
   */
  this.module = module;

  /**
   * Name value pairs.
   * @protected
   * @type {SugarCrm.Record?}
   */
  this.obj = opt_obj || null;
  // this.key_path = module == ydn.crm.sugar.ModuleName.EMAIL_TEXT ? 'email_id' : 'id';
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.Record.DEBUG = false;


/**
 * @protected
 * @final
 * @type {string}
 */
ydn.crm.sugar.Record.prototype.key_path = 'id';


/**
 * @return {boolean}
 */
ydn.crm.sugar.Record.prototype.hasRecord = function() {
  return !!this.obj/* && goog.isDef(this.obj['id'])*/;
};


/**
 * Get sugar crm view link.
 * @return {string}
 */
ydn.crm.sugar.Record.prototype.getViewLink = function() {
  return ydn.crm.sugar.getViewLink(this.domain, this.module, this.getId());
};


/**
 * @return {string}
 */
ydn.crm.sugar.Record.prototype.getDomain = function() {
  return this.domain;
};


/**
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.sugar.Record.prototype.getModule = function() {
  return this.module;
};


/**
 * @return {SugarCrm.Record?}
 */
ydn.crm.sugar.Record.prototype.getData = function() {
  return this.obj;
};


/**
 * @param {SugarCrm.Record?} obj
 */
ydn.crm.sugar.Record.prototype.setData = function(obj) {
  if (obj) {
    if (ydn.crm.sugar.Record.DEBUG && !obj[this.key_path]) {
      window.console.log(obj);
    }
    goog.asserts.assertString(obj[this.key_path], 'id missing in record');
  }
  this.obj = obj;
};


/**
 * Merge data.
 * @param {SugarCrm.Record} obj
 */
ydn.crm.sugar.Record.prototype.updateData = function(obj) {
  if (obj) {
    if (!this.obj) {
      this.obj = /** @type {SugarCrm.Record} */ (/** @type {Object} */ ({}));
    }
    for (var name in obj) {
      this.obj[name] = obj[name];
    }
  }
};


/**
 * @return {string}
 */
ydn.crm.sugar.Record.prototype.getId = function() {
  var id = this.obj[this.key_path];
  if (ydn.crm.sugar.Record.DEBUG && !id) {
    window.console.log(this.obj);
  }
  goog.asserts.assert(id, 'empty id of ' + this.obj);
  return id;
};


/**
 * @return {number}
 */
ydn.crm.sugar.Record.prototype.getUpdated = function() {
  if (this.obj) {
    return +ydn.crm.sugar.utils.parseDate(this.obj['date_modified']);
  } else {
    return NaN;
  }
};


/**
 * Get deadline.
 * @return {Date}
 */
ydn.crm.sugar.Record.prototype.getDeadline = function() {
  if (this.obj) {
    var field = ydn.crm.sugar.Record.getFieldNameForDeadline(this.module);
    return ydn.crm.sugar.utils.parseDate(this.obj[field]);
  } else {
    return new Date('NaN');
  }
};


/**
 * Return index name for determining deadline.
 * @param {ydn.crm.sugar.ModuleName} m_name
 * @return {string}
 */
ydn.crm.sugar.Record.getIndexForDeadline = function(m_name) {
  return 'assigned_user_id, ' + ydn.crm.sugar.Record.getFieldNameForDeadline(m_name);
};


/**
 * Return field name for determining deadline.
 * @param {ydn.crm.sugar.ModuleName} m_name
 * @return {string}
 */
ydn.crm.sugar.Record.getFieldNameForDeadline = function(m_name) {
  if (m_name == ydn.crm.sugar.ModuleName.TASKS) {
    return 'date_due';
  } else if (m_name == ydn.crm.sugar.ModuleName.OPPORTUNITIES) {
    return 'date_closed';
  } else {
    return 'date_start';
  }
};


/**
 * Return noun form of the module.
 * Eg: `Contacts` return as `Contact`.
 * @param {ydn.crm.sugar.ModuleName} name
 * @return {string}
 */
ydn.crm.sugar.Record.moduleAsNoun = function(name) {
  return name.replace(/ies$/, 'y').replace(/s$/, '');
};


/**
 * Return verb form of the module.
 * Eg: `Meetings` return as `Meet`, `Opportinities` return 'Close'.
 * @param {ydn.crm.sugar.ModuleName} name
 * @return {string}
 */
ydn.crm.sugar.Record.moduleAsVerb = function(name) {
  if (name == ydn.crm.sugar.ModuleName.CALLS) {
    return 'call';
  } else if (name == ydn.crm.sugar.ModuleName.TASKS) {
    return 'finish';
  } else if (name == ydn.crm.sugar.ModuleName.MEETINGS) {
    return 'meet';
  } else if (name == ydn.crm.sugar.ModuleName.OPPORTUNITIES) {
    return 'close';
  } else {
    return 'do';
  }
};


/**
 * Get suitable title of this record.
 * @return {string}
 */
ydn.crm.sugar.Record.prototype.getTitle = function() {
  if (!this.obj) {
    return '';
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
ydn.crm.sugar.Record.prototype.names = function() {
  return this.obj ? Object.keys(this.obj) : [];
};


/**
 * @param {string} name
 * @return {string?}
 */
ydn.crm.sugar.Record.prototype.value = function(name) {
  return this.obj ? this.obj[name] : null;
};


/**
 * @param {string} name
 * @return {boolean}
 */
ydn.crm.sugar.Record.prototype.hasField = function(name) {
  return this.obj ? goog.isDef(this.obj[name]) : false;
};


/**
 * Set a field value. If record value is not exist, it will be initialize
 * with empty object.
 * @param {string} name
 * @param {*} value
 */
ydn.crm.sugar.Record.prototype.setValue = function(name, value) {
  if (!this.obj) {
    this.obj = /** @type {SugarCrm.Record} */ (/** @type {Object} */({}));
  }
  this.obj[name] = value;
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.Record.prototype.toJSON = function() {
  return {
    'domain': this.domain,
    'module': this.module,
    'obj': this.obj
  };
};


/**
 * Deserialize JSON object.
 * @param {Object} json
 * @return {!ydn.crm.sugar.Record}
 */
ydn.crm.sugar.Record.fromJSON = function(json) {
  return new ydn.crm.sugar.Record(json['domain'], json['module'], json['obj']);
};


if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugar.Record.prototype.toString = function() {
    var id = this.obj ? this.obj[this.key_path] : undefined;
    return 'Record:' + this.module + ':' + id;
  };
}
