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
 * @fileoverview SugarCRM client
 *                                                 `
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.app.Page');
goog.require('ydn.crm.Ch.Req');
goog.require('ydn.crm.app.App');
goog.require('ydn.crm.feed.Feed');
goog.require('ydn.crm.ui.Debug');
goog.require('ydn.msg.Pipe');



/**
 * Event page.
 * @constructor
 * @struct
 * @extends {ydn.crm.app.App}
 */
ydn.crm.app.Page = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.app.Page, ydn.crm.app.App);


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.app.Page.prototype.logger =
    goog.log.getLogger('ydn.crm.app.Page');


/**
 * @inheritDoc
 */
ydn.crm.app.Page.prototype.init = function() {
  goog.base(this, 'init');
  var body_data = {
    theme: this.setting.theme,
    editable: true
  };
  var ele = goog.soy.renderAsElement(templ.ydn.crm.app.body, body_data);
  document.body.appendChild(ele);

  var debug = new ydn.crm.ui.Debug();
  var db_ele = document.getElementById('section-debug');
  debug.init(db_ele);
};


/**
 * Create the app on global space.
 * @return {ydn.crm.app.Page}
 */
ydn.crm.app.Page.runApp = function() {
  ydn.crm.shared.log();
  var app = new ydn.crm.app.Page();

  return app;
};

