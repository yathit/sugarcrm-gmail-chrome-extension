/**
 * Created by kyawtun on 15/12/13.
 */


// Load sugarcrm UI file.
chrome.storage.local.get('front-end-src', function(obj) {
  var fn = obj['front-end-src'];
  // console.log('loading ' + fn);
  var node = document.createElement('script');
  node.type = 'text/javascript';
  node.onload = function() {
    // now run the app
    window.app = runOptionApp();
  };
  node.src = fn;
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(node);
});


