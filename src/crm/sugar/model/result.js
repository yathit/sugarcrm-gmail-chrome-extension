/**
 * @fileoverview Search result model.
 */


goog.provide('ydn.crm.sugar.model.Result');
goog.require('goog.events.EventTarget');



/**
 * Represent a search result.
 * @param {ydn.crm.sugar.model.Sugar} parent
 * @constructor
 * @extends {goog.events.EventTarget}
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugar.model.Result = function(parent) {
  goog.base(this);
  /**
   * @protected
   * @type {ydn.crm.sugar.model.Sugar}
   */
  this.parent = parent;
  /**
   * @protected
   * @type {ydn.crm.sugar.model.Record}
   */
  this.record = null;
  /**
   * @protected
   * @type {DbFullTextSearchResult}
   */
  this.result = null;
};
goog.inherits(ydn.crm.sugar.model.Result, goog.events.EventTarget);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugar.model.Result.DEBUG = false;


/**
 * @return {ydn.crm.sugar.model.Record}
 */
ydn.crm.sugar.model.Result.prototype.getRecordModel = function() {
  return this.record;
};


/**
 * @return {ydn.crm.sugar.model.Sugar}
 */
ydn.crm.sugar.model.Result.prototype.getParent = function() {
  return this.parent;
};


/**
 * @return {ydn.crm.sugar.model.Record?}
 */
ydn.crm.sugar.model.Result.prototype.getRecord = function() {
  return this.record;
};


/**
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.sugar.model.Result.prototype.getModuleName = function() {
  if (this.record) {
    return this.record.getModuleName();
  } else if (this.result) {
    return /** @type {ydn.crm.sugar.ModuleName} */ (this.result.storeName);
  } else {
    throw new Error('No module name');
  }
};


/**
 * @return {string}
 */
ydn.crm.sugar.model.Result.prototype.getDomain = function() {
  return this.parent.getDomain();
};


/**
 * Set result.
 * @param {DbFullTextSearchResult} result
 */
ydn.crm.sugar.model.Result.prototype.setResult = function(result) {
  if (result.record) {
    goog.asserts.assertInstanceof(result.record, ydn.crm.sugar.model.Record);
    this.record = /** @type {ydn.crm.sugar.model.Record} */ (result.record);
  } else {
    this.record = null;
  }
  this.result = result;
  if (ydn.crm.sugar.model.Result.DEBUG) {
    goog.global.console.log(this.result);
  }
  this.dispatchEvent(new goog.events.Event(goog.events.EventType.CHANGE, this));
  if (!this.record) {
    goog.asserts.assertString(this.result.storeName);
    goog.asserts.assertString(this.result.primaryKey);
    var query = {
      'store': this.result.storeName,
      'index': 'id',
      'key': this.result.primaryKey
    };
    if (ydn.crm.sugar.model.Result.DEBUG) {
      goog.global.console.log(query);
    }
    this.parent.send(ydn.crm.Ch.SReq.LIST, [query])
        .addCallback(function(arr) {
          if (ydn.crm.sugar.model.Result.DEBUG) {
            goog.global.console.log(arr);
          }
          var result = arr[0].result;
          if (result[0]) {
            goog.asserts.assert(result[0]['id'], 'no record id? ' + result[0]);
            var module = ydn.crm.sugar.toModuleName(this.result.storeName);
            var r = new ydn.crm.sugar.Record(this.parent.getDomain(),
                module, result[0]);
            this.record = new ydn.crm.sugar.model.Record(this.parent, r);
            this.dispatchEvent(new goog.events.Event(goog.events.EventType.CHANGE, this));
          }
        }, this);
  }
};


/**
 * Clear result.
 */
ydn.crm.sugar.model.Result.prototype.clear = function() {
  if (this.record || this.result) {
    this.record = null;
    this.result = null;
    this.dispatchEvent(new goog.events.Event(goog.events.EventType.CHANGE, this));
  }
};

if (goog.DEBUG) {
  /**
   * @inheritDoc
   */
  ydn.crm.sugar.model.Result.prototype.toString = function() {
    return 'ydn.crm.sugar.model.Result:' + this.record;
  };
}


/**
 * @return {boolean}
 */
ydn.crm.sugar.model.Result.prototype.isEmpty = function() {
  return !this.record && !this.result;
};
