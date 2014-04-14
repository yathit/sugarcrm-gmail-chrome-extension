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
 * @fileoverview HUD for Activity renderer.
 *
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.activity.IRenderer');



/**
 * HUD for Activity panel.
 * @param {Object.<ydn.crm.ui.sugar.activity.Config>} panels
 * @interface
 */
ydn.crm.ui.sugar.activity.IRenderer = function(panels) {};


/**
 * @param {ydn.crm.ui.sugar.activity.Panel} ctrl
 */
ydn.crm.ui.sugar.activity.IRenderer.prototype.createDom = function(ctrl) {};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.activity.IRenderer.CSS_CLASS_FEED = 'activity-feed';


/**
 * @typedef {{
 *   color: string
 * }}
 */
ydn.crm.ui.sugar.activity.Config;


/**
 * @param {string} name
 * @param {number} count
 */
ydn.crm.ui.sugar.activity.IRenderer.prototype.setCount = function(name, count) {

};


/**
 * @param {number} count
 * @param {Date} since
 */
ydn.crm.ui.sugar.activity.IRenderer.prototype.setActivityCount = function(count, since) {

};
