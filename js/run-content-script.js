/**
 * Created by kyawtun on 15/12/13.
 */

chrome.storage.local.get('ydn-crm-src', function(obj) {
  var fn = obj['ydn-crm-src'];
  var node = document.createElement('script');
  node.onload = function() {
    window.app = runInjApp();
  };
  node.type = 'text/javascript';
  node.src = fn;
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(node);
});
