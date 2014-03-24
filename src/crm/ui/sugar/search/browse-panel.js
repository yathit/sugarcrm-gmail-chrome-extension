/**
 * @fileoverview SugarCRM search panel for a module.
 */


goog.provide('ydn.crm.ui.sugar.BrowsePanel');
goog.require('goog.ui.Component');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarSelect');
goog.require('wgui.TextInput');
goog.require('ydn.crm.sugar.model.Sugar');
goog.require('ydn.crm.ui.sugar.SearchResult');
goog.require('ydn.crm.ui.sugar.SearchPanel');



/**
 * Panel to synchronize SugarCRM and GData Contact.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.sugar.model.Sugar} model
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.BrowsePanel = function(dom, model) {
  goog.base(this, dom);
  goog.asserts.assertInstanceof(model, ydn.crm.sugar.model.Sugar,
      'model must be ydn.crm.sugar.model.Sugar instance');
  this.setModel(model);
  /**
   * @protected
   * @type {goog.ui.Component}
   */
  this.result_panel = new goog.ui.Component(dom);
  /**
   * @protected
   * @type {goog.ui.Toolbar}
   */
  this.toolbar = null;
  /**
   * @type {Array.<ydn.crm.ui.sugar.BrowsePanel.SearchTask>}
   * @private
   */
  this.search_tasks_ = [];
  /**
   * Just to show progress of search task.
   * @type {number}
   * @private
   */
  this.total_tasks_ = 0;
};
goog.inherits(ydn.crm.ui.sugar.BrowsePanel, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.sugar.BrowsePanel.DEBUG = false;


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.dom_;
  var root = this.getElement();
  var header = dom.createDom('div', 'header');
  root.appendChild(header);
  this.toolbar = new goog.ui.Toolbar(null, null, dom);
  var record_types = new goog.ui.Menu(dom);
  for (var i = 0; i < ydn.crm.sugar.CacheModules.length; i++) {
    record_types.addChild(new goog.ui.MenuItem(ydn.crm.sugar.CacheModules[i]), true);
  }
  var tbn = new goog.ui.ToolbarSelect('Module', record_types, null, dom);
  this.toolbar.addChild(tbn, true);
  this.toolbar.addChild(new wgui.TextInput(''), true);
  this.toolbar.render(header);
  var content = dom.createDom('div', 'content');
  root.appendChild(content);
  this.addChild(this.result_panel, true);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var search_input = /** @type {wgui.TextInput} */ (this.toolbar.getChildAt(1));
  this.getHandler().listen(search_input, goog.ui.Component.EventType.ACTION, this.handleAction, true);
};


/**
 * @return {string?}
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.getRecordType = function() {
  var sel = /** @type {goog.ui.ToolbarSelect} */ (this.toolbar.getChildAt(0));
  var item = sel.getSelectedItem();
  return item ? item.getCaption() : null;
};


/**
 * Clear results.
 * @private
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.clearResult_ = function() {
  for (var i = this.result_panel.getChildCount() - 1; i >= 0; i--) {
    var child = /** @type {ydn.crm.ui.sugar.SearchResult} */ (this.result_panel.getChildAt(i));
    child.getModel().clear();
  }
  this.total_tasks_ = 0;
};


/**
 * @typedef {{
 *   module: string,
 *   q: string,
 *   taskNo: number
 * }}
 */
ydn.crm.ui.sugar.BrowsePanel.SearchTask;


/**
 * @const
 * @type {number}
 */
ydn.crm.ui.sugar.BrowsePanel.MAX_PANELS = 30;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.BrowsePanel.CSS_CLASS = 'browse-panel';


/** @return {string} */
ydn.crm.ui.sugar.BrowsePanel.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.BrowsePanel.CSS_CLASS;
};


/**
 * Add a new result.
 * @param {DbFullTextSearchResult} result
 * @private
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.addResult_ = function(result) {
  if (ydn.crm.ui.sugar.BrowsePanel.DEBUG) {
    goog.global.console.log(result);
  }
  if (!result) {
    return;
  }
  var n = this.result_panel.getChildCount();
  for (var i = 0; i < n; i++) {
    var child = /** @type {ydn.crm.ui.sugar.SearchResult} */ (this.result_panel.getChildAt(i));
    var model = child.getModel();
    if (model.isEmpty()) {
      model.setResult(result);
      return;
    }
  }
  if (n > ydn.crm.ui.sugar.BrowsePanel.MAX_PANELS) {
    var banney = /** @type {ydn.crm.ui.sugar.SearchResult} */ (this.result_panel.getChildAt(0));
    banney.getModel().setResult(result);
  } else {
    // create new result panel.
    var m = new ydn.crm.sugar.model.Result(this.getModel());
    m.setResult(result);
    var ch = new ydn.crm.ui.sugar.SearchResult(this.dom_, m, true);
    this.result_panel.addChild(ch, true);
  }

};


/**
 * Update for an module query. This will invoke updateSearch_().
 * @param {string} module
 * @param {string} index
 * @param {string} q
 * @private
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.updateSearchFor_ = function(module, index, q) {
  if (ydn.crm.ui.sugar.BrowsePanel.DEBUG) {
    window.console.log(module, index, q);
  }
  var model = this.getModel();
  model.listRecords(module, index, q, true).addCallbacks(function(arr) {
    if (ydn.crm.ui.sugar.BrowsePanel.DEBUG) {
      window.console.log(module, index, q, arr);
    }
    var result = arr[0];
    if (result['result'][0]) {
      var module_name = ydn.crm.sugar.toModuleName(result['store']);
      var record = new ydn.crm.sugar.model.Module(this.getModel(), module_name);
      var r = new ydn.crm.sugar.Record(this.getModel().getDomain(), module_name, result['result'][0]);
      record.setRecord(r);
      var key = r.getId();
      goog.asserts.assertString(key, 'key not found in ' + record);
      var search_result = {
        'storeName': module_name,
        'primaryKey': key,
        'record': record,
        'value': q,
        'tokens': [{
          'keyPath': index
        }]
      };
      this.addResult_(/** @type {DbFullTextSearchResult} */ (/** @type {Object} */ (search_result)));
    }
    this.updateSearch_();
  }, function(e) {
    if (ydn.crm.ui.sugar.BrowsePanel.DEBUG) {
      window.console.log(module, index, q, e);
    }
    this.updateSearch_();
    throw e;
  }, this);
};


/**
 * @param {number} pending_count
 * @private
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.showStartProgress_ = function(pending_count) {
  if (this.total_tasks_ == 0) {
    this.total_tasks_ = pending_count;
  }
  var progress = 100 * (this.total_tasks_ - pending_count) / this.total_tasks_;
  var el = this.getSearchInput().getElement();
  var input = goog.dom.getElementsByTagNameAndClass('input', null, el)[0];
  input.style.background = ydn.crm.ui.sugar.SearchPanel.computeBackground(progress);
};


/**
 * Update search progress. A given query is breakdown into task, represented
 * by taskNo, and then execute on each this function invocation. If a new search
 * is available, current result are clear.
 * @private
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.updateSearch_ = function() {
  var task = this.search_tasks_[0];
  if (!task) {
    return;
  }
  task.taskNo++; // update task no. it always starts with -1.
  /*
  if (ydn.crm.ui.sugar.BrowsePanel.DEBUG) {
    window.console.log('updateSearch_ ' + JSON.stringify(task));
  }
  */

  // update status
  var n_per_task = 3;
  var total = n_per_task * (this.search_tasks_.length - 1) + (n_per_task - task.taskNo);
  this.showStartProgress_(total);

  var model = this.getModel();
  if (task.taskNo == 0) {
    // Task 0. query email
    this.updateSearchFor_(task.module, 'ydn$emails', task.q);
  } else if (task.taskNo == 1) {
    // Task 1. query phone
    var m = task.q.match(/\d/g);
    var number_of_digits = m ? m.length : 0;
    if (number_of_digits < 3) {
      // skip phone no search.
      this.updateSearch_();
      return;
    }
    this.updateSearchFor_(task.module, 'ydn$phones', task.q);
  } else if (task.taskNo == 2) {
    // Task 2. full text search on name
    model.searchRecords(task.module, task.q).addCallbacks(function(arr) {
      var result = arr[0].result;
      var n = result.length || 0;
      for (var i = 0; i < n; i++) {
        this.addResult_(result[i]);
      }
      this.updateSearch_();
    }, function(e) {
      throw e;
    }, this);
  } else {
    // done.
    this.search_tasks_.shift();
    if (this.search_tasks_.length > 0) {
      this.updateSearch_();
    }
  }
};


/**
 * @protected
 * @returns {wgui.TextInput}
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.getSearchInput = function() {
  return /** @type {wgui.TextInput} */ (this.toolbar.getChildAt(1));
};


/**
 * @param {Event} e
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.handleAction = function(e) {
  var search_input = this.getSearchInput();
  var query = search_input.getContent();
  if (query) {
    query = query.trim();
    if (query.length >= 2) {
      var type = this.getRecordType();
      this.search_tasks_.length = 0;
      if (type) {
        this.search_tasks_[0] = {
          module: type,
          q: query,
          taskNo: -1
        };
      } else {
        for (var i = 0; i < ydn.crm.sugar.CacheModules.length; i++) {
          this.search_tasks_[i] = {
            module: ydn.crm.sugar.CacheModules[i],
            q: query,
            taskNo: -1
          };
        }
      }
      this.clearResult_();
      this.updateSearch_(); // if update search is already running this will
      // cause double run, but OK.
    }
  }
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.BrowsePanel.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(goog.getCssName('content'), this.getElement());
};


