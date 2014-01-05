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
  if (!ydn.crm.Ch.sugar) {
    return;
  }
  var root = this.root;
  setTimeout(function() { // wait if page move quickly.
    var msg = new ydn.channel.Message('details', function(info) {
      // window.console.log(info);
      if (!info) {
        return;
      }
      var panel = root.querySelector('.sugarcrm');
      panel.querySelector('.domain').textContent = info.domain;
      panel.querySelector('.username').textContent = info.username;
      var name = panel.querySelector('.name');
      name.querySelector('.flavor').textContent = info.serverInfo.flavor;
      name.querySelector('.version').textContent = info.serverInfo.version;
      name.querySelector('.gmt_time').textContent = info.serverInfo.gmt_time;
    }, this);
    ydn.crm.Ch.sugar.send(msg);
  }, 400);

};


