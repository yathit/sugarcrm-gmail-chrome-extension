/**
 * @fileoverview Credentials section.
 */



/**
 * Credentials section.
 * @constructor
 */
var SearchPanel = function(channel) {
  /**
   * @type {HTMLElement}
   */
  this.root = document.getElementById('search');
};


/**
 * Change visibility.
 * @param {boolean} val
 */
SearchPanel.prototype.setVisible = function(val) {
  if (!val) {
    this.root.style.display = 'none';
    return;
  }
  this.root.style.display = '';
};

