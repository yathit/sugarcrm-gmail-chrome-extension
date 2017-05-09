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
 * @fileoverview Define CRMinInbox environment variables.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

(function(window) {


/**
 * base namespace for CRMinInbox app.
 */
window.YathitCrm = {};


/**
 * @enum {string} version number base on tracks.
 */
YathitCrm.Version = {
  release: '8.9.3',
  beta: '8.9.3',
  alpha: '8.9.3'
};


/**
 * @namespace base namespace for SugarCRM module.
 */
YathitCrm.sugarcrm = {};


/**
 * @enum {string} version number base on tracks.
 */
YathitCrm.sugarcrm.Version = {
  release: '8.9.7',
  beta: '8.9.7',
  alpha: '8.9.7'
};

})(typeof window == 'undefined' ? self : window);