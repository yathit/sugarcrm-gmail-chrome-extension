/**
 * @fileoverview Home section.
 */



/**
 * Home panel.
 * @constructor
 */
var HomePanel = function() {
  /**
   * @type {HTMLElement}
   */
  this.root = document.getElementById('home');
  this.feed = new FeedWidget();
  this.feed.render(this.root);
};


/**
 * Show SugarCRM instance info.
 */
HomePanel.prototype.displaySugarcrmInfo = function() {
  ydn.msg.getChannel().send('details').addCallback(function(info) {
    // window.console.log(info);
    var panel = this.root.querySelector('.sugarcrm');
    panel.querySelector('.domain').textContent = info.domain;
    panel.querySelector('.username').textContent = info.username;
    var name = panel.querySelector('.name');
    name.querySelector('.flavor').textContent = info.serverInfo.flavor;
    name.querySelector('.version').textContent = info.serverInfo.version;
    name.querySelector('.gmt_time').textContent = info.serverInfo.gmt_time;
  }, this);
};


/**
 * Change visibility.
 * @param {boolean} val
 */
HomePanel.prototype.setVisible = function(val) {
  if (!val) {
    this.root.style.display = 'none';
    return;
  }
  this.root.style.display = '';


};


