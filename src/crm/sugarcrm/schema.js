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
 * @fileoverview SugarCRM database schema generator base on user setting.
 */


goog.provide('ydn.crm.sugarcrm.Schema');
goog.require('ydn.crm.sugarcrm.History');
goog.require('ydn.db.Storage');
goog.require('ydn.db.crud.Storage.text');
goog.require('ydn.string');



/**
 * SugarCRM database schema.
 * @param {string} name domain name
 * @param {SugarCrm.ServerInfo} info Server info.
 * @param {Object} user_data user setting data.
 * @constructor
 */
ydn.crm.sugarcrm.Schema = function(name, info, user_data) {
  /**
   * @protected
   * @final
   * @type {string}
   */
  this.name = name;
  /**
   * @protected
   * @final
   * @type {SugarCrm.ServerInfo}
   */
  this.info = null;
  /**
   * @protected
   * @type {Object}
   */
  this.setting_data = user_data || {};

  /**
   * @protected
   * @type {DatabaseSchema}
   */
  this.schema = null;

};


/**
 * @const
 * @type {Object}
 */
ydn.crm.sugarcrm.Schema.DEFAULT_SETTING = {
  'Accounts': {
    'GeneratorIndex': {
      'ydn$emails': ['email', 'email1', 'email_addresses_non_primary'],
      'ydn$phones': ['phone_office', 'phone_alternate', 'phone_fax']
    }
  },
  'Calls': {
    'FullTextIndex': {
      'name': ['name', 'description'],
      'content': ['name', 'description']
    }, 'indexes': [
      {
        'name': 'parent',
        'keyPath': ['parent_type', 'parent_id', 'date_modified']
      }, {
        'name': 'assigned_user_id, date_start',
        'keyPath': ['assigned_user_id', 'date_start']
      }]
  },
  'Contacts': {
    'FullTextIndex': {
      'name': ['name', 'first_name', 'last_name', 'full_name']
    },
    'GeneratorIndex': {
      'ydn$emails': ['email', 'email1', 'email2'],
      'ydn$phones': ['phone_home', 'phone_mobile', 'phone_work', 'phone_other', 'phone_fax']
    }
  },
  'Documents': {
    'FullTextIndex': {
      'name': ['name', 'document_name', 'filename'],
      'content': ['description']
    }, 'indexes': [
      {
        'name': 'parent',
        'keyPath': ['doc_type', 'doc_id']
      }]
  },
  'Emails': {
    'FullTextIndex': {
      'name': ['name'],
      'content': ['content', /*'raw_source',*/ 'description']
    }, 'GeneratorIndex': {
      // keyPath ends with addrs is assumed to be comma separated email list.
      'ydn$emails': ['bcc_addrs', 'cc_addrs', 'from_addr', 'to_addrs', 'reply_to_addr']
    }, 'indexes': [
      {
        'name': 'parent',
        'keyPath': ['parent_type', 'parent_id', 'date_modified']
      }, {
        'name': 'message_id'
      }]
  },
  'Leads': {
    'FullTextIndex': {
      'name': ['name', 'first_name', 'last_name', 'full_name']
    },
    'GeneratorIndex': {
      'ydn$emails': ['email', 'email1', 'email2'],
      'ydn$phones': ['phone_home', 'phone_mobile', 'phone_work', 'phone_other', 'phone_fax']
    }
  },
  'Meetings': {
    'FullTextIndex': {
      'name': ['name'],
      'content': ['description']
    }, 'indexes': [
      {
        'name': 'date_start'
      }, {
        'name': 'parent',
        'keyPath': ['parent_type', 'parent_id', 'date_modified']
      }, {
        'name': 'assigned_user_id, date_start',
        'keyPath': ['assigned_user_id', 'date_start']
      }]
  },
  'Notes': {
    'FullTextIndex': {
      'name': ['name'],
      'content': ['description']
    }, 'indexes': [
      {
        'name': 'parent',
        'keyPath': ['parent_type', 'parent_id', 'date_modified']
      }]
  },
  'Opportunities': {
    'FullTextIndex': {
      'name': ['name'],
      'content': ['description']
    }, 'indexes': {
      'name': 'assigned_user_id, date_closed',
      'keyPath': ['assigned_user_id', 'date_closed']
    }
  },
  'Tasks': {
    'FullTextIndex': {
      'name': ['name'],
      'content': ['description']
    }, 'indexes': [
      {
        'name': 'parent',
        'keyPath': ['parent_type', 'parent_id', 'date_modified']
      }, {
        'name': 'assigned_user_id, date_due',
        'keyPath': ['assigned_user_id', 'date_due']
      }]
  }
};


/**
 * Get setting for a given module.
 * @param {string} name
 * @return {Object}
 */
ydn.crm.sugarcrm.Schema.prototype.getSetting = function(name) {
  return this.setting_data[name] || ydn.crm.sugarcrm.Schema.DEFAULT_SETTING[name] || {};
};


/**
 * Get list of generator index.
 * @param {string} name module name
 * @return {Object}
 * @protected
 */
ydn.crm.sugarcrm.Schema.prototype.getGeneratorIndex = function(name) {
  var setting = this.getSetting(name);
  return setting['GeneratorIndex'] || {};
};


/**
 * Create index generator.
 * @param {Array.<string>} fields
 * @param {string} index index name
 * @return {IndexSchema?}
 * @protected
 */
ydn.crm.sugarcrm.Schema.prototype.buildGeneratorIndex = function(fields, index) {
  if (index == 'ydn$emails') {
    return /** @type {IndexSchema} */ (/** @type {Object} */ ({
      name: index,
      multiEntry: true,
      generator: function(obj) {
        var emails = [];
        for (var key in obj) {
          if (fields.indexOf(key) >= 0) {
            if (goog.isString(obj[key])) {
              if (/addrs$/.test(key)) {
                var addrs = obj[key].split(',');
                for (var i = 0; i < addrs.length; i++) {
                  var email = ydn.string.normalizeEmail(addrs[i]);
                  if (email) {
                    emails.push(email);
                  }
                }
              } else {
                var email = ydn.string.normalizeEmail(obj[key]);
                if (email) {
                  emails.push(email);
                }
              }

            } else if (goog.isArrayLike(obj[key]) && obj[key][0] && obj[key][0]['email_address']) {
              // bean format.
              var arr = /** @type {Array.<SugarCrm.EmailField>} */ (obj[key]);
              // console.log(arr, arr.length, arr[0]);
              for (var i = 0; i < arr.length; i++) {
                if (arr[i] && goog.isString(arr[i].email_address)) {
                var email = ydn.string.normalizeEmail(arr[i].email_address);
                  if (email) {
                    emails.push(email);
                  }
                }
              }
            }
          }
        }
        return emails;
      }
    }));
  } else if (index == 'ydn$phones') {
    return /** @type {IndexSchema} */ (/** @type {Object} */ ({
      name: index,
      multiEntry: true,
      generator: function(obj) {
        var emails = [];
        for (var key in obj) {
          if (fields.indexOf(key) >= 0) {
            var email = ydn.string.normalizePhone(obj[key]);
            if (email) {
              emails.push(email);
            }
          }
        }
        return emails;
      }
    }));
  }
  return null;
};


/**
 * Get store schema for specific module.
 * @param {string} module_name
 * @return {StoreSchema}
 */
ydn.crm.sugarcrm.Schema.prototype.getStoreSchema = function(module_name) {
  if (this.schema) {
    for (var i = 0; i < this.schema.stores.length; i++) {
      if (this.schema.stores[i].name == module_name) {
        return this.schema.stores[i];
      }
    }
  }
  var setting = this.getSetting(module_name);
  var schema = /** @type {StoreSchema} */ (/** @type {Object} */ ({
    name: module_name,
    keyPath: setting['keyPath'] || 'id',
    indexes: [
      {
        name: 'name'
      }, {
        name: 'date_modified'
      }
    ]
  }));

  var gen_index_names = ['ydn$emails', 'ydn$phones', 'ydn$names'];
  if (setting['indexes']) {
    schema.indexes = schema.indexes.concat(setting['indexes']);
  }
  var setting_gen_index = setting['GeneratorIndex'] || {};

  for (var i = 0; i < gen_index_names.length; i++) {
    var index_name = gen_index_names[i];
    var fields = setting_gen_index[index_name];
    if (!fields || (goog.isArray(fields) && fields.length == 0)) {
      continue;
    }
    var index = this.buildGeneratorIndex(fields, index_name);
    schema.indexes.push(index);
  }

  return schema;
};


/**
 * Return full text catalog name.
 * @param {string} module_name
 * @param {string} ft_name
 * @return {string}
 */
ydn.crm.sugarcrm.Schema.makeFullTextStoreName = function(module_name, ft_name) {
  return 'ft-' + module_name + '-' + ft_name;
};


/**
 * Get YDN-DB database schema.
 * @return {DatabaseSchema}
 */
ydn.crm.sugarcrm.Schema.prototype.getSchema = function() {
  if (this.schema) {
    return this.schema;
  }

  var schema = {
    fullTextCatalogs: [],
    stores: [ydn.crm.sugarcrm.History.getSchema(), {
      name: 'Meta'
    }]
  };
  var stores = ydn.crm.sugarcrm.CacheModules;
  for (var i = 0; i < stores.length; i++) {
    var module_name = stores[i];
    schema.stores.push(this.getStoreSchema(module_name));

    var ss = this.getSetting(module_name);
    if (ss['FullTextIndex']) {
      for (var ft_name in ss['FullTextIndex']) {
        var ft_sources = ss['FullTextIndex'][ft_name];
        if (ft_sources.length > 0) {
          var ft_store_name = ydn.crm.sugarcrm.Schema.makeFullTextStoreName(module_name, ft_name);
          var fullTextCatalog = /** @type {FullTextCatalog} */ (/** @type {Object} */ ({
            name: ft_store_name,
            lang: 'en',
            sources: []
          }));
          for (var j = 0; j < ft_sources.length; j++) {
            fullTextCatalog.sources.push({
              storeName: module_name,
              keyPath: ft_sources[j]
            });
          }
          schema.fullTextCatalogs.push(fullTextCatalog);
        }
      }
    }
  }
  this.schema = /** @type {DatabaseSchema} */ (/** @type {Object} */ (schema));
  Object.freeze(this.schema);
  return this.schema;
};

