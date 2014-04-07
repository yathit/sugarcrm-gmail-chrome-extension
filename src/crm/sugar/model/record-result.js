/**
 * @fileoverview Search result model.
 */


goog.provide('ydn.crm.sugar.model.ResultRecord');
goog.require('ydn.crm.sugar.model.Record');



/**
 * Represent a search result.
 * @param {ydn.crm.sugar.model.Sugar} parent
 * @param {DbFullTextSearchResult} result
 * @constructor
 * @extends {ydn.crm.sugar.model.Record}
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugar.model.ResultRecord = function(parent, result) {
  goog.asserts.assert(result, 'empty result');
  goog.asserts.assert(result.storeName, 'result must have a store name');
  goog.asserts.assert(result.primaryKey, 'result must have a key');

  /**
   * @protected
   * @type {DbFullTextSearchResult}
   */
  this.result = result;
  var r = new ydn.crm.sugar.Record(parent.getDomain(),
      /** @type {ydn.crm.sugar.ModuleName} */ (result.storeName),
      /** @type {SugarCrm.Record} */ (result.record));

  goog.base(this, parent, r);

  if (!this.record.hasRecord()) {
    this.queryRecord_();
  }
};
goog.inherits(ydn.crm.sugar.model.ResultRecord, ydn.crm.sugar.model.Record);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.ResultRecord.DEBUG = false;


/**
 *
 * @private
 */
ydn.crm.sugar.model.ResultRecord.prototype.queryRecord_ = function() {
  goog.asserts.assertString(this.result.storeName, 'store name must not empty');
  goog.asserts.assert(goog.isDef(this.result.primaryKey), 'primary key must not empty');
  var query = {
    'store': this.result.storeName,
    'index': 'id',
    'key': this.result.primaryKey
  };
  if (ydn.crm.sugar.model.ResultRecord.DEBUG) {
    goog.global.console.log(query);
  }
  this.parent.send(ydn.crm.Ch.SReq.LIST, [query])
      .addCallback(function(arr) {
        var result = arr[0].result;
        if (ydn.crm.sugar.model.ResultRecord.DEBUG) {
          goog.global.console.log(arr, result);
        }
        if (result[0]) {
          goog.asserts.assert(result[0]['id'], 'no record id? ' + result[0]);
          var module = ydn.crm.sugar.toModuleName(this.result.storeName);
          var r = new ydn.crm.sugar.Record(this.parent.getDomain(),
              module, result[0]);
          this.setRecord(r);
        }
      }, this);
};


/**
 * Set result.
 * @param {DbFullTextSearchResult} result
 */
ydn.crm.sugar.model.ResultRecord.prototype.setResult = function(result) {
  if (ydn.crm.sugar.model.ResultRecord.DEBUG) {
    goog.global.console.log(result);
    goog.global.console.log(this.result);
  }
  if (!result) {
    return;
  }
  this.result = result;
  if (result.record) {
    this.setRecord(new ydn.crm.sugar.Record(this.getDomain(),
        /** @type {ydn.crm.sugar.ModuleName} */ (result.storeName),
        /** @type {SugarCrm.Record} */ (result.record)));
  } else if (result.storeName && goog.isDef(result.primaryKey)) {
    this.queryRecord_();
  }
};


/**
 * Clear result.
 */
ydn.crm.sugar.model.ResultRecord.prototype.clear = function() {
  if (!this.isEmpty()) {
    this.setRecord(null);
    this.result = null;
  }
};

if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugar.model.ResultRecord.prototype.toString = function() {
    return 'ydn.crm.sugar.model.ResultRecord:' + this.record;
  };
}


/**
 * @return {boolean}
 */
ydn.crm.sugar.model.ResultRecord.prototype.isEmpty = function() {
  return !this.hasRecord() && !this.result;
};
