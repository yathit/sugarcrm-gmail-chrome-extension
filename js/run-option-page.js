/**
 * Load js file depending on selected track.
 */

(function() {
  /**
   * @see ydn.crm.base.ChromeLocalKey.TRACK
   */
  chrome.storage.local.get(['version-track', 'suggested-version-track'], function(obj) {
    var fn;
    var channel = obj['version-track'] || obj['suggested-version-track'] || 'release';
    if (channel == 'beta') {
      fn = 'jsc/crmininbox-' + window.YathitCrm.sugarcrm.Version.beta + '.js';
    } else if (channel == 'alpha') {
      fn = 'jsc/crmininbox-' + window.YathitCrm.sugarcrm.Version.alpha + '.js';
    } else {
      fn = 'jsc/crmininbox-' + window.YathitCrm.sugarcrm.Version.release + '.js';
      channel = 'release';
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.onload = function() {
      // now run the app
      window.app = runOptionApp(channel);
    };
    node.src = fn;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
  });

})();

