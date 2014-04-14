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
 * @fileoverview HUD for Activity panel.
 *
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.ActivityHud');



/**
 * HUD for Activity panel.
 * @param {Element} container
 * @param {number=} width
 * @param {number=} height
 * @constructor
 * @struct
 */
ydn.crm.ui.sugar.ActivityHud = function(container, width, height) {
  /**
   * @protected
   * @type {number}
   */
  this.width = width || 200;
  /**
   * @protected
   * @type {number}
   */
  this.height = height || 24;
  /**
   * @protected
   * @type {Kinetic.Stage}
   */
  this.stage = new Kinetic.Stage({
    container: container,
    width: this.width,
    height: this.height
  });
  var dx = 0;
  var span = this.getPanelWidth() + this.borderWidth * 2;
  var layers = {'Meetings': {
    color: 'red',
    dx: dx
  }, 'Calls': {
    color: 'green',
    dx: dx = dx - span
  }};
  /**
   * Represent layer for Meetings, Calls, Opportunities and Tasks
   * @protected
   * @type {Object.<ydn.crm.ui.sugar.ActivityLayer>}
   */
  this.activity_layer = {};
  for (var name in layers) {
    var lay = new ydn.crm.ui.sugar.ActivityLayer(this, name, layers[name]);
    this.activity_layer[name] = lay;
    this.stage.add(lay.layer);
  }

};


/**
 * @protected
 * @type {number}
 */
ydn.crm.ui.sugar.ActivityHud.prototype.borderWidth = 2;


/**
 * @protected
 * @return {number}
 */
ydn.crm.ui.sugar.ActivityHud.prototype.getPanelWidth = function() {
  return 20 - this.borderWidth * 2;
};


/**
 * Get an activity.
 * @param {string} name
 * @return {ydn.crm.ui.sugar.ActivityLayer}
 */
ydn.crm.ui.sugar.ActivityHud.prototype.getActivity = function(name) {
  return this.activity_layer[name];
};



/**
 * Activity layer.
 * @param {ydn.crm.ui.sugar.ActivityHud} parent
 * @param {string} name
 * @param {Object} obj offset y.
 * @constructor
 * @struct
 */
ydn.crm.ui.sugar.ActivityLayer = function(parent, name, obj) {
  /**
   * @final
   * @protected
   * @type {ydn.crm.ui.sugar.ActivityHud}
   */
  this.parent = parent;

  /**
   * @final
   * @protected
   * @type {string}
   */
  this.name = name;
  /**
   * @protected
   * @type {Kinetic.Layer}
   */
  this.layer = new Kinetic.Layer({offsetX: obj.dx});
  var w = this.parent.getPanelWidth();
  var box = new Kinetic.Rect({
    x: 1,
    y: 1,
    width: w,
    height: w,
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
    stroke: obj.color
  });
  /**
   * @type {Kinetic.Text}
   * @private
   */
  this.count_text_ = new Kinetic.Text({
    x: w / 2,
    y: 0,
    text: '?',
    fontSize: 10,
    fontFamily: 'Arial',
    fill: 'green'
  });
  this.count_text_.offsetX(this.count_text_.width() / 2);
  this.count_text_.offsetY(- this.count_text_.height() / 2);
  this.layer.add(box);
  this.layer.add(this.count_text_);
};


/**
 * @param {number} count
 */
ydn.crm.ui.sugar.ActivityLayer.prototype.setCount = function(count) {
  this.count_text_.text(count + '');
  this.count_text_.offsetX(this.count_text_.width() / 2);
  this.layer.draw();
};
