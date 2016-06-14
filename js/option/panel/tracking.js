/**
 * @fileoverview Tracking panel.
 */



/**
 * Tracking panel.
 * @constructor
 */
var TrackingPanel = function() {
  /**
   * @type {HTMLElement}
   */
  this.root = document.getElementById('tracking');
  this.root.innerHTML = '';
  /**
   * @protected
   * @type {ydn.crm.tracking.Panel}
   */
  this.panel = null;
};


/**
 * Change visibility.
 * @param {boolean} val
 */
TrackingPanel.prototype.setVisible = function(val) {
  if (val) {
    this.root.style.display = '';
    if (!this.panel) {
      this.panel = new ydn.crm.tracking.Panel();
      this.panel.render(this.root);
    }
  } else {
    this.root.style.display = 'none';
  }
};

