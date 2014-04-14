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
 * @fileoverview Gmail command injector.
 *
 * Inject context specific UI to gmail heading of an email.
 */


goog.provide('ydn.crm.ui.GmailCmdInjector');
goog.require('ydn.crm.ui.GmailCmd');



/**
 * Gmail command injector.
 * @param {ydn.crm.sugar.model.Sugar} sugar
 * @constructor
 */
ydn.crm.ui.GmailCmdInjector = function(sugar) {
  /**
   * @protected
   * @type {ydn.crm.sugar.model.Sugar}
   */
  this.sugar = sugar;

  /**
   * @type {Array.<!ydn.crm.ui.GmailCmd>}
   * @private
   */
  this.cmd_pools_ = [];

};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.GmailCmdInjector.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.GmailCmdInjector.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.GmailCmdInjector');


/**
 * Observe Gmail compose panel for template menu attachment.
 * <pre>
 *   var tm = new ydn.crm.ui.GmailCmdInjector(sugar);
 *   tm.observeEmailThreadToolbar(document.body);
 * </pre>
 * @param {Element} el
 * @return {MutationObserver}
 */
ydn.crm.ui.GmailCmdInjector.prototype.observeEmailThreadToolbar = function(el) {
  var config = /** @type {MutationObserverInit} */ (/** @type {Object} */ ({
    'childList': false,
    'attributes': true,
    'characterData': false,
    'subtree': true,
    'attributeOldValue': false,
    'characterDataOldValue': false,
    'attributeFilter': ['data-tooltip']
  }));

  var observer = new MutationObserver(this.observe.bind(this));

  observer.observe(el, config);
  return observer;
};


/**
 * Get a panel from the pool or create a new one if not exist.
 * @return {ydn.crm.ui.GmailCmd}
 */
ydn.crm.ui.GmailCmdInjector.prototype.popGmailCmd = function() {

  for (var i = 0; i < this.cmd_pools_.length; i++) {
    if (this.cmd_pools_[i].isFree()) {
      if (this.cmd_pools_[i].isInDocument()) { // it will be
        this.cmd_pools_[i].exitDocument();
      }
      if (ydn.crm.ui.GmailCmdInjector.DEBUG) {
        window.console.log(this.cmd_pools_.length + ' objects in pools using ' + i);
      }
      return this.cmd_pools_[i];
    }
  }
  if (ydn.crm.ui.GmailCmdInjector.DEBUG) {
    window.console.log(this.cmd_pools_.length + ' objects in pools, creating new one');
  }
  var cmd = new ydn.crm.ui.GmailCmd(this.sugar);
  this.cmd_pools_.push(cmd);
  return cmd;
};


/**
 * Mutation observer.
 * @param {Array.<MutationRecord>} mutations
 */
ydn.crm.ui.GmailCmdInjector.prototype.observe = function(mutations) {
  for (var i = 0; i < mutations.length; i++) {
    var mutation = mutations[i];
    /**
     * @type {Node}
     */
    var el = mutation.target;
    var exp_value = 'Reply';
    if (el.getAttribute('data-tooltip') == exp_value) {
      if (ydn.crm.ui.GmailCmdInjector.DEBUG) {
        window.console.log(el);
      }
      var cmd = this.popGmailCmd();
      var root = document.createElement('span');
      el.parentElement.insertBefore(root, el);
      cmd.render(root);
    }
  }
};
