/**
 * @fileoverview Display log and feed info.
 */



/**
 * Home panel.
 * @constructor
 */
var FeedWidget = function() {
  this.root = null;
};


/**
 * @param {Element} e
 */
FeedWidget.prototype.render = function(e) {
  var div = document.createElement('div');
  e.appendChild(div);
  var shadow = div.webkitCreateShadowRoot ? div.webkitCreateShadowRoot() : div.createShadowRoot();
  var template = document.querySelector('#feed-widget-template');
  shadow.appendChild(template.content);
  template.remove();
  var details = shadow.querySelector('details');
  details.addEventListener('click', this.displayFeed.bind(this));
  var inp = shadow.querySelector('#show-log');
  inp.addEventListener('click', this.displayFeed.bind(this));
  this.root = shadow;
};


/**
 * Display feed.
 * @param {DOMEvent} e
 */
FeedWidget.prototype.displayFeed = function(e) {
  if (e.currentTarget.hasAttribute('open')) {
    return;
  }
  var ul = this.root.querySelector('ul');
  var me = this;
  var show_log = this.root.querySelector('#show-log').checked;
  var cmd = show_log ? 'feed-log' : 'feed-log-info';
  ydn.msg.getChannel().send(cmd).addCallback(function(data) {
    ul.innerHTML = '';
    for (var i = 0; i < data.length; i++) {
      var li = document.createElement('li');
      var date = '[' + new Date(data[i].time).toLocaleString() + '] ';
      if (show_log) {
        date += '[' + data[i].logger + '] ';
      }
      li.textContent = date + data[i].message;
      ul.appendChild(li);
    }

  });

};


