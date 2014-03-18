/**
 * @fileoverview Home page.
 *                                                 `
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.Home');
goog.require('goog.dom');
goog.require('goog.style');



/**
 * Home panel.
 * @constructor
 */
ydn.crm.ui.Home = function() {

  /**
   * @protected
   * @type {Element}
   */
  this.root = null;
  /**
   * @type {boolean}
   * @private
   */
  this.init_login_ui_ = false;
  /**
   * Google user info.
   * @type {Object}
   * @private
   */
  this.user_info_google_ = null;
  /**
   * Google user info.
   * @type {Object}
   * @private
   */
  this.user_info_sugar_ = null;
};


/**
 * Initialize ui.
 * @param {Element} e
 */
ydn.crm.ui.Home.prototype.init = function(e) {
  this.root = e;
  this.showOnly_('home-panel-greeting');
};


/**
 * @param {string} name class name of the child node of the root to show.
 * @private
 */
ydn.crm.ui.Home.prototype.showOnly_ = function(name) {
  // last always show.
  for (var i = this.root.childElementCount - 2; i >= 0; i--) {
    var show = goog.dom.classes.has(this.root.children[i], name);
    goog.style.setElementShown(this.root.children[i], show);
  }
};


/**
 * @param {string} msg
 * @private
 */
ydn.crm.ui.Home.prototype.showMessage_ = function(msg) {
  var ele = goog.dom.getElementByClass('home-panel-message', this.root);
  ele.textContent = msg;
  goog.style.setElementShown(ele, true);
};



