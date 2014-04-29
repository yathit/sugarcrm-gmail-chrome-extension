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
  this.render();
};


/**
 * Render ui.
 */
HomePanel.prototype.render = function() {
  var div = document.createElement('div');
  var btn = document.createElement('button');
  btn.textContent = 'Setting...';
  btn.onclick = function() {
    ydn.crm.ui.UserSetting.getInstance().show();
  };
  div.appendChild(btn);
  this.root.appendChild(div);
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


