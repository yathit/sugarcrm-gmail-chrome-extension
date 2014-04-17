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
 * @fileoverview Activity panel.
 *
 * Show recent activity, upcoming activity and system activity.
 *
 * Activity panel listen update from SugarCRM client for module updated events
 * and show in the panel.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.activity.Panel');
goog.require('goog.date.relative');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar');
goog.require('ydn.crm.ui.sugar.activity.DetailPanel');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.Sugar} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.activity.Panel = function(model, dom) {
  goog.base(this, dom);
  this.setModel(model);

  /**
   * @protected
   * @type {goog.ui.TabBar}
   */
  this.tabbar = new goog.ui.TabBar(goog.ui.TabBar.Location.TOP, undefined, dom);
  /**
   * @protected
   * @type {ydn.crm.ui.sugar.activity.DetailPanel}
   */
  this.detail_panel = new ydn.crm.ui.sugar.activity.DetailPanel(model, dom);
};
goog.inherits(ydn.crm.ui.sugar.activity.Panel, goog.ui.Component);


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.ui.sugar.activity.Panel.prototype.getModel;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.activity.Panel.CSS_CLASS = 'activity-panel';


/** @return {string} */
ydn.crm.ui.sugar.activity.Panel.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.activity.Panel.CSS_CLASS;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.activity.Panel.CSS_CLASS_FEED = 'activity-feed';


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.activity.Panel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.dom_;
  var root = this.getElement();
  goog.dom.classes.add(root, this.getCssClass());

  this.addChild(this.tabbar, true);
  var feed_ele = dom.createDom('div');
  var up = new goog.ui.Tab(feed_ele);
  up.setTooltip('Activity feed');
  this.tabbar.addChild(up, true);
  up.getContentElement().classList.add(ydn.crm.ui.sugar.activity.Panel.CSS_CLASS_FEED);
  for (var i = 0; i < ydn.crm.sugar.ACTIVITY_MODULES.length; i++) {
    var caption = ydn.crm.sugar.ACTIVITY_MODULES[i].substr(0, 2);
    var ele = dom.createDom('div', null, caption);
    var tab = new goog.ui.Tab(ele);
    tab.setTooltip(ydn.crm.sugar.ACTIVITY_MODULES[i]);
    this.tabbar.addChild(tab, true);
    tab.getContentElement().classList.add(ydn.crm.sugar.ACTIVITY_MODULES[i]);
    tab.setVisible(false);
  }

  this.addChild(this.detail_panel, true);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.activity.Panel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var sugar = this.getModel();
  // Listen events
  var hd = this.getHandler();
  hd.listen(sugar, ydn.crm.sugar.model.Sugar.Event.LOGIN, this.updaterLater_);
  hd.listen(this.tabbar, goog.ui.Component.EventType.SELECT, this.handleTabSelect_);
  hd.listen(this.tabbar, goog.ui.Component.EventType.UNSELECT, this.handleTabUnSelect_);
  hd.listen(this.detail_panel.getElement(), 'click', this.handleDetailPanelClick_);
  goog.style.setElementShown(this.getElement(), false);
  // if already login, update at the beginning.
  if (sugar.isLogin()) {
    this.updaterLater_();
  }
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.ui.sugar.activity.Panel.prototype.handleDetailPanelClick_ = function(e) {
  var name = e.target.getAttribute('name');
  if (name == 'close') {
    this.tabbar.setSelectedTabIndex(-1);
  }
};


/**
 * @param {goog.events.Event} e
 * @private
 */
ydn.crm.ui.sugar.activity.Panel.prototype.handleTabUnSelect_ = function(e) {
  this.detail_panel.clear();
};


/**
 * @param {goog.events.Event} e
 * @private
 */
ydn.crm.ui.sugar.activity.Panel.prototype.handleTabSelect_ = function(e) {
  var idx = this.tabbar.getSelectedTabIndex();
  if (idx == 0) {
    this.detail_panel.renderActivity();
  } else {
    this.detail_panel.renderUpcoming(idx - 1);
  }
};


/**
 * Call updateActivity_ after a while.
 * @private
 */
ydn.crm.ui.sugar.activity.Panel.prototype.updaterLater_ = function() {
  var me = this;
  setTimeout(function() {
    me.updateActivity_();
  }, 2000);
  setTimeout(function() {
    me.updateUpcomingActivity_(true);
  }, 3000);
};


/**
 * Update activity display.
 * 0 and continue to next after a time out. If over all activity modules, this stop.
 * @private
 */
ydn.crm.ui.sugar.activity.Panel.prototype.updateActivity_ = function() {

  this.getModel().send(ydn.crm.Ch.SReq.ACTIVITY_STREAM).addCallbacks(function(ans) {
    if (ans.length > 0) {
      // Note: result are sorted by date_modified in descending ordering.
      var since = ydn.crm.sugar.utils.parseDate(ans[ans.length - 1]['date_modified']);
      goog.style.setElementShown(this.getElement(), true);
      this.setActivityCount(ans.length, since);
    }
  }, function(e) {
    throw e;
  }, this);
};


/**
 * Update upcoming activity display.
 * @param {boolean=} opt_continue whether continue next.
 * @param {number=} opt_idx current activity to update. If not given, start with
 * 0 and continue to next after a time out. If over all activity modules, this stop.
 * @private
 */
ydn.crm.ui.sugar.activity.Panel.prototype.updateUpcomingActivity_ = function(
    opt_continue, opt_idx) {
  var index = opt_idx || 0;
  if (index >= ydn.crm.sugar.ACTIVITY_MODULES.length) {
    return;
  }
  var query = this.detail_panel.queryUpcoming(index);
  this.getModel().send(ydn.crm.Ch.SReq.KEYS, query).addCallbacks(function(ans) {
    var query_result = /** @type {Array.<string>} */ (ans);
    var next = index + 1;
    if (opt_continue) {
      // let next update do first before updating UI
      // so that event if renderer fail, updating continue.
      this.updateUpcomingActivity_(true, next);
    }
    goog.style.setElementShown(this.getElement(), true);
    this.setCount(ydn.crm.sugar.ACTIVITY_MODULES[index], query_result.length);
  }, function(e) {
    throw e;
  }, this);
};


/**
 * @param {number} cnt
 * @param {Date} since
 */
ydn.crm.ui.sugar.activity.Panel.prototype.setActivityCount = function(cnt, since) {
  var tab = /** @type {goog.ui.Tab} */ (this.tabbar.getChildAt(0));
  var ele = tab.getContentElement().firstElementChild;
  if (cnt > 0) {
    ele.textContent = cnt;
    var t = goog.date.relative.format(since.getTime()) || since.toLocaleDateString();
    tab.setTooltip(cnt + ' records updated since ' + t);
  } else {
    ele.textContent = 'Fe';
    tab.setTooltip('');
  }
};


/**
 * @param {string} name
 * @param {number} cnt
 */
ydn.crm.ui.sugar.activity.Panel.prototype.setCount = function(name, cnt) {
  var idx = ydn.crm.sugar.ACTIVITY_MODULES.indexOf(name);
  var tab = /** @type {goog.ui.Tab} */ (this.tabbar.getChildAt(idx + 1));
  var ele = tab.getContentElement().firstElementChild;
  if (cnt) {
    ele.textContent = cnt;
    tab.setTooltip(cnt + ' upcoming ' + name);
    tab.setVisible(true);
  } else {
    ele.textContent = name.substr(0, 2);
    tab.setTooltip('');
    tab.setVisible(false);
  }

};
