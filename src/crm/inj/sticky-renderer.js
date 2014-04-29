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
 * @fileoverview Sticky renderer render stick to right side.
 *
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.inj.StickyRenderer');
goog.require('goog.ui.Popup');
goog.require('ydn.crm.inj.AppRenderer');
goog.require('ydn.gmail.Utils');



/**
 * Sticky renderer;
 * @param {Element} ele
 * @constructor
 * @struct
 * @extends {ydn.crm.inj.AppRenderer}
 */
ydn.crm.inj.StickyRenderer = function(ele) {
  goog.base(this, ele);
  goog.style.setElementShown(this.ele_root, false);
  /**
   * @protected
   * @type {goog.ui.Popup}
   */
  this.popup = new goog.ui.Popup(this.ele_root);
  this.popup.setHideOnEscape(false);
  this.popup.setAutoHide(false);

  /**
   * @protected
   * @type {Element} the one stick on right side of the view port.
   */
  this.stick_panel = document.createElement('div');
  this.stick_panel.className = ydn.crm.inj.StickyRenderer.CSS_CLASS;
  /**
   * @protected
   * @type {Element}
   */
  this.displayBtn = document.createElement('div');
  this.displayBtn.className = 'disp-button';
  this.displayBtn.onclick = this.handleBtnClick.bind(this);
  this.stick_panel.appendChild(this.displayBtn);

};
goog.inherits(ydn.crm.inj.StickyRenderer, ydn.crm.inj.AppRenderer);


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.StickyRenderer.CSS_CLASS = 'sticker';


/**
 * Get button state from user setting.
 * @param {function(this:ydn.crm.inj.StickyRenderer, number)} cb
 * @private
 */
ydn.crm.inj.StickyRenderer.prototype.fetchBtnState_ = function(cb) {
  var me = this;
  chrome.storage.sync.get(ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_STICKY_BTN_STATE, function(x) {
    if (x && goog.isNumber(x[ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_STICKY_BTN_STATE])) {
      var n = goog.math.clamp(x[ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_STICKY_BTN_STATE], -4, 4);
      cb.call(me, n);
    } else {
      cb.call(me, 2);
    }
  });
};


/**
 * Store button state.
 * @param {number} n
 * @param {function(this: ydn.crm.inj.StickyRenderer)=}  opt_cb
 * @private
 */
ydn.crm.inj.StickyRenderer.prototype.putBtnState_ = function(n, opt_cb) {
  var obj = {};
  var me = this;
  obj[ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_STICKY_BTN_STATE] = n;
  chrome.storage.sync.set(obj, function() {
    if (opt_cb) {
      opt_cb.call(me);
    }
  });
};


/**
 * Update arrow and save the state. Change popup state before changing.
 * @param {number} n number of arrows.
 * @private
 */
ydn.crm.inj.StickyRenderer.prototype.updateUi_ = function(n) {

  if (n == 0) {
    n = 1;
  }
  var dir = n > 0 ? 1 : -1;
  if (dir == 1 && !this.popup.isVisible()) {
    this.popup.setVisible(true);
  } else if (dir == -1 && this.popup.isVisible()) {
    this.popup.setVisible(false);
  }
  var arrow = dir == 1 ? '&#10095;' : '&#10094;';
  var an = Math.abs(n);
  var sign = dir ? 1 : -1;
  var chars = '';
  for (var i = 0; i < an; i++) {
    chars += arrow;
  }
  this.displayBtn.innerHTML = chars;
  var obj = {};
  if (ydn.crm.inj.AppRenderer.DEBUG) {
    window.console.log(n);
  }
  obj[ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_STICKY_BTN_STATE] = n;
  chrome.storage.sync.set(obj);
};


/**
 * @return {number} number of arrows. negative number indicate to left <<
 * @private
 */
ydn.crm.inj.StickyRenderer.prototype.getBtnState_ = function() {
  var s = this.displayBtn.textContent;
  var dir = s.charCodeAt(0) == 10095 ? -1 : 1;
  return dir * s.length;
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.inj.StickyRenderer.prototype.handleBtnClick = function(e) {
  e.preventDefault();
  var showing_popup = this.popup.isVisible();
  var state = ydn.gmail.Utils.getState();
  var n_arr = this.getBtnState_();
  var an_arr = Math.abs(n_arr);
  if (state == ydn.gmail.Utils.GmailViewState.EMAIL) {
    if (showing_popup) {
      this.updateUi_(1);
    } else if (an_arr < 2) {
      this.updateUi_(-2);
    } else if (n_arr == -2) {
      this.updateUi_(-3);
    }
  } else {
    if (showing_popup) {
      this.updateUi_(an_arr >= 3 ? -2 : -1);
    } else {
      this.popup.setVisible(true);
      this.updateUi_(an_arr > 2 ? 4 : 3);
    }
  }

};


/**
 * Show popup.
 */
ydn.crm.inj.StickyRenderer.prototype.show = function() {
  var menuCorner = goog.positioning.Corner.TOP_RIGHT;
  var buttonCorner = goog.positioning.Corner.TOP_LEFT;
  var margin = new goog.math.Box(0, 0, 0, 0);

  this.popup.setVisible(false);
  this.popup.setPinnedCorner(menuCorner);
  this.popup.setMargin(margin);
  this.popup.setPosition(new goog.positioning.AnchoredViewportPosition(this.stick_panel,
      buttonCorner));

  this.fetchBtnState_(function(n) {
    this.updateUi_(n);
  });
};


/**
 * @inheritDoc
 */
ydn.crm.inj.StickyRenderer.prototype.attach = function() {
  goog.base(this, 'attach');

  if (this.ele_root.parentElement && this.ele_root.parentElement != document.body) {
    this.ele_root.parentElement.removeChild(this.ele_root);
    document.body.appendChild(this.ele_root);
  }
  if (!this.stick_panel.parentElement) {
    document.body.appendChild(this.stick_panel);
  }
  goog.style.setElementShown(this.ele_root, false);

  this.ele_root.className = ydn.crm.inj.AppRenderer.CSS_CLASS_STICKY_RIGHT + ' ' + ydn.crm.inj.AppRenderer.CSS_CLASS;
  goog.style.setElementShown(this.ele_root, true);
  this.show();
};


/**
 * @inheritDoc
 */
ydn.crm.inj.StickyRenderer.prototype.detach = function() {
  goog.base(this, 'detach');
  if (this.stick_panel.parentElement) {
    this.stick_panel.parentElement.removeChild(this.stick_panel);
  }
};


/**
 * @inheritDoc
 */
ydn.crm.inj.StickyRenderer.prototype.attachToGmailRightBar = function(table) {
  var n = this.getBtnState_();
  var an = Math.abs(n);
  if (!!table) {
    // in email view, popup up have to be show again
    if (!this.popup.isVisible() && an >= 2) {
      this.updateUi_(an == 2 ? 2 : 3);
    }
  } else {
    if (this.popup.isVisible()) {
      // check if necessary to hide
      if (an == 2) {
        this.updateUi_(-2);
      }
    }
  }
};
