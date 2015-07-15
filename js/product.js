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
 * @fileoverview Define product feature variables.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


/**
 * App name.
 * @type {string}
 */
YathitCrm.name = 'Yathit InboxCRM';


/**
 * These variable change default behaviour of the product.
 * All variables are optional and default behaviour is assume.
 * @enum {namespace} Yathit CRM product manifest.
 */
YathitCrm.Product = {
  GData: {
    Contacts: {

    },
    Calendar: {

    }
  },
  /**
   * By defining `SugarCRM`, SugarCRM feature and setup options are immediately
   *  available.
   */
  SugarCRM: {
    /**
     * Default authentication type, either '' or 'ldap'.
     */
    authentication: ''
  },
  /**
   * By defining `Tracking`, email tracking is available without setup.
   */
  Tracking: {

  },
  /**
   * By defining `Social`, social mediation is available without setup.
   */
  Social: {

  }
};


