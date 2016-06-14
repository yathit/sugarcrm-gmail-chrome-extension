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
 * @fileoverview Simple popup display from chrome local variables.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */



/**
 * Simple popup.
 * @constructor
 */
SimplePopup = function() {
};


/**
 * Run the app.
 */
SimplePopup.prototype.run = function() {
  this.refresh();
};


/**
 * Refresh UI.
 */
SimplePopup.prototype.refresh = function() {

  var key = 'popup-content';
  chrome.storage.local.get(key, function(json) {
    // console.log(json);
    if (json[key]) {
      var content = json[key];
      var ul = document.createElement('ul');
      for (var i = 0; i < content.length; i++) {
        var el = SimplePopup.json2element(content[i]);
        var li = document.createElement('li');
        li.appendChild(el);
        ul.appendChild(li);
      }
      var root = document.getElementById('feed');
      root.appendChild(ul);
      ul.addEventListener('click', SimplePopup.onClick);
    }
  });
};


/**
 * @param {Event} e
 * @protected
 */
SimplePopup.onClick = function(e) {
  if (e.target.tagName == 'BUTTON') {
    var a = e.target;
    if (a.className == 'host-permission') {
      e.preventDefault();
      var domain = a.getAttribute('name');
      var permissions = {
        origins: ['http://' + domain + '/*', 'https://' + domain + '/*']
      };
      chrome.permissions.request(permissions, function(grant) {
        if (grant) {
          a.style.display = 'none';
          var div = document.createElement('div');
          div.textContent = 'Please refresh ' + domain;
          document.getElementById('main').appendChild(div);
        }
      });
    }
  }
};


/**
 * Convert JSON to Element.
 * @param {Object} json
 * @return {Element}
 */
SimplePopup.json2element = function(json) {
  if (!json || ['DIV', 'SPAN', 'A', 'BUTTON'].indexOf(json.tagName) == -1) {
    console.warn(json);
    return null;
  }
  var ele = document.createElement(json.tagName);
  var attrs = ['className', 'href', 'name', 'textContent', 'target'];
  for (var i = 0; i < attrs.length; i++) {
    if (json[attrs[i]]) {
      ele[attrs[i]] = json[attrs[i]];
    }
  }
  var n = json.children ? json.children.length : 0;
  for (var i = 0; i < n; i++) {
    var child = SimplePopup.json2element(json.children[i]);
    if (child) {
      ele.appendChild(child);
    }
  }
  return ele;
};


app = new SimplePopup();
app.run();
