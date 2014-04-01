/**
 * @fileoverview Status bar.
 *
 * It is assume that an app has a status bar and available on singleton instance.
 */


goog.provide('ydn.crm.ui.SimpleStatusBar');
goog.provide('ydn.crm.ui.StatusBar');



/**
 * Abstract status bar.
 * @constructor
 */
ydn.crm.ui.StatusBar = function() {
  this.count_ = 0;
};


/**
 * Singlaton instance of status bar. This should be override by the app.
 * @type {ydn.crm.ui.StatusBar}
 */
ydn.crm.ui.StatusBar.instance = new ydn.crm.ui.StatusBar();


/**
 * Render status bar.
 * @param {Element} el
 */
ydn.crm.ui.StatusBar.prototype.render = function(el) {

};


/**
 * Set message.
 * @param {string} s
 * @param {boolean=} opt_is_error
 * @return {number} message id
 */
ydn.crm.ui.StatusBar.prototype.setMessage = function(s, opt_is_error) {
  return ++this.count_;
};


/**
 * Clear message.
 * @param {number} cnt message id
 */
ydn.crm.ui.StatusBar.prototype.clearMessage = function(cnt) {

};


/**
 * @return {number} get current message count.
 */
ydn.crm.ui.StatusBar.prototype.getCount = function() {
  return this.count_;
};



/**
 * Status bar, print on console log.
 * @constructor
 * @extends {ydn.crm.ui.StatusBar}
 */
ydn.crm.ui.ConsoleStatusBar = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.ui.ConsoleStatusBar, ydn.crm.ui.StatusBar);


/**
 * @inheritDoc
 */
ydn.crm.ui.ConsoleStatusBar.prototype.setMessage = function(s, err) {
  var out = goog.base(this, 'setMessage', s, err);
  if (err) {
    goog.global.console.warn(s);
  } else {
    goog.global.console.info(s);
  }
  return out;
};



/**
 * Simple status bar.
 * @constructor
 * @extends {ydn.crm.ui.StatusBar}
 */
ydn.crm.ui.SimpleStatusBar = function() {
  goog.base(this);
  /**
   * @type {Element}
   * @private
   */
  this.el_msg_ = document.createElement('div');
  var root = document.createElement('div');
  root.className = 'statusbar';
  this.el_msg_.className = 'message';
  root.appendChild(this.el_msg_);
};
goog.inherits(ydn.crm.ui.SimpleStatusBar, ydn.crm.ui.StatusBar);


/**
 * @inheritDoc
 */
ydn.crm.ui.SimpleStatusBar.prototype.render = function(el) {
  el.appendChild(this.el_msg_.parentElement);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.SimpleStatusBar.prototype.setMessage = function(s, err) {
  var out = goog.base(this, 'setMessage', s, err);
  this.el_msg_.textMessage = s;
  if (err) {
    this.el_msg_.classList.add('error');
  } else {
    this.el_msg_.classList.remove('error');
  }
  return out;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.SimpleStatusBar.prototype.clearMessage = function(idx) {
  if (idx == this.getCount()) {
    this.el_msg_.textContent = '';
    this.el_msg_.classList.remove('error');
  }
};
