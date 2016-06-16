/**
 * Created by kyawtun on 9/10/14.
 */

(function() {
  /**
   * @see ydn.crm.base.ChromeLocalKey.TRACK
   */
  chrome.storage.local.get(['version-track', 'suggested-version-track'], function(obj) {
    var fn;
    var channel = obj['version-track'] || obj['suggested-version-track'] || 'alpha';
    if (channel == 'beta') {
      fn = 'jsc/ydn.crm-' + window.YathitCrm.Version.beta + '.js';
    } else if (channel == 'alpha') {
      if (navigator.onLine) {
        fn = 'https://www.yathit.com/source-code/edge/ydn.crm.js';
      } else {
        fn = 'jsc/ydn.crm-' + window.YathitCrm.Version.alpha + '.js';
      }
    } else {
      fn = 'jsc/ydn.crm-' + window.YathitCrm.Version.release + '.js';
      channel = 'release';
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.onload = function() {
      // now run the app
      window.app = runBackgroundApp(channel);
    };
    node.src = fn;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
  });

})();


