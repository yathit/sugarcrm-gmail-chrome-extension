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
 * @fileoverview HUD for Activity renderer using goog.ui.Tabbar.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.ui.sugar.activity.TabRenderer');
goog.require('goog.date.relative');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar');
goog.require('ydn.crm.ui.sugar.activity.IRenderer');



/**
 * HUD for Activity renderer using goog.ui.Tabbar.
 * @constructor
 * @implements {ydn.crm.ui.sugar.activity.IRenderer}
 * @struct
 */
ydn.crm.ui.sugar.activity.TabRenderer = function() {

  /**
   * @type {goog.ui.TabBar}
   * @private
   */
  this.tabbar_ = null;
};


/**
 * @param {ydn.crm.ui.sugar.activity.Panel} ctrl
 */
ydn.crm.ui.sugar.activity.TabRenderer.prototype.createDom = function(ctrl) {
  var dom = ctrl.getDomHelper();
  this.tabbar_ = new goog.ui.TabBar(goog.ui.TabBar.Location.TOP, undefined, dom);
  ctrl.addChild(this.tabbar_, true);
  var feed_ele = dom.createDom('div', ydn.crm.ui.sugar.activity.IRenderer.CSS_CLASS_FEED, 'Fe');
  var up = new goog.ui.Tab(feed_ele);
  up.setTooltip('Activity feed');
  this.tabbar_.addChild(up, true);
  for (var i = 0; i < ydn.crm.sugar.ACTIVITY_MODULES.length; i++) {
    var caption = ydn.crm.sugar.ACTIVITY_MODULES[i].substr(0, 2);
    var ele = dom.createDom('div', ydn.crm.sugar.ACTIVITY_MODULES[i], caption);
    var tab = new goog.ui.Tab(ele);
    tab.setTooltip(ydn.crm.sugar.ACTIVITY_MODULES[i]);
    this.tabbar_.addChild(tab, true);
    tab.setVisible(false);
  }

};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.activity.TabRenderer.prototype.setActivityCount = function(cnt, since) {
  var tab = /** @type {goog.ui.Tab} */ (this.tabbar_.getChildAt(0));
  var ele = tab.getContentElement();
  if (cnt > 0) {
    ele.textContent = cnt;
    var t = goog.date.relative.format(since.getTime()) || since.toLocaleDateString();
    console.log(t);
    tab.setTooltip(cnt + ' records updated since ' + t);
  } else {
    ele.textContent = 'Fe';
    tab.setTooltip('');
  }
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.activity.TabRenderer.prototype.setCount = function(name, cnt) {
  var idx = ydn.crm.sugar.ACTIVITY_MODULES.indexOf(name);
  var tab = /** @type {goog.ui.Tab} */ (this.tabbar_.getChildAt(idx + 1));
  if (cnt) {
    tab.getContentElement().textContent = cnt;
    tab.setTooltip(cnt + ' upcoming ' + name);
    tab.setVisible(true);
  } else {
    tab.getContentElement().textContent = name.substr(0, 2);
    tab.setTooltip('');
    tab.setVisible(false);
  }

};

