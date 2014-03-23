/**
 * @fileoverview Load user preferred version of the app.
 */

(function(me) {

  /**
   * @enum {string}
   */
  var Track = {
    STABLE: 'Stable',
    RC: 'RC',
    BETA: 'Beta',
    EDGE: 'Edge'
  };

  /**
   * @enum {string}
   */
  var Version = {
    STABLE: '0.7.2',
    RC: '0.7.2',
    BETA: '0.7.2',
    EDGE: 'edge'
  };


  /**
   * Load user preferred version of the app.
   * @param {Function} callback listen onload event of the script.
   */
  me.loadApp = function(callback) {
    var key = 'ydn-crm-track';
    chrome.storage.local.get(key, function(data) {
      var ver = data[key];
      var fn = chrome.runtime.getURL('/jsc/ydn.crm-' + Version.STABLE + '.js');
      if (navigator.onLine && ver == Track.EDGE) {
        fn = 'https://ydn-src-1.storage.googleapis.com/jsc/ydn.crm-edge.js';
      } else if (ver == Track.BETA) {
        fn = chrome.runtime.getURL('/jsc/ydn.crm-' + Version.BETA + '.js');
      } else if (ver == Track.RC) {
        fn = chrome.runtime.getURL('/jsc/ydn.crm-' + Version.RC + '.js');
      }
      var node = document.createElement('script');
      node.onload = callback;
      node.type = 'text/javascript';
      chrome.storage.local.set({'ydn-crm-src': fn});
      node.src = fn;
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(node);
    });
  };

})(this);
