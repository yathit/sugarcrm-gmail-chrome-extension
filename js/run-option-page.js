/**
 * Load js file depending on selected track.
 */


(function() {
  var versions = window.YathitCrm.sugarcrm.Version;
  var channel = localStorage.getItem('version-track') ||
      localStorage.getItem('suggested-version-track') || 'release';
  var fn = 'jsc/crmininbox-' + versions[channel] + '.js';
  var node = document.createElement('script');
  node.type = 'text/javascript';
  node.onload = function() {
    // now run the app
    window.app = runOptionApp();
  };
  node.src = fn;
  document.getElementsByTagName('head')[0].appendChild(node);
})();



