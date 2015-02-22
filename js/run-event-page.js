/**
 * Created by kyawtun on 9/10/14.
 */

(function() {
  var fn = 'jsc/ydn.crm-' + window.YathitCrm.Version.release + '.js';

  var node = document.createElement('script');
  node.type = 'text/javascript';
  node.onload = function() {
    // now run the app
    window.app = runBackgroundApp();
  };
  node.src = fn;
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(node);
})();


