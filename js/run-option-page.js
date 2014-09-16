/**
 * Created by kyawtun on 15/12/13.
 */


// Load sugarcrm UI file.
chrome.storage.local.get('sugarcrm-src', function(obj) {
  var fn = obj['sugarcrm-src'];
  console.log('loading ' + fn);
  var node = document.createElement('script');
  node.type = 'text/javascript';
  node.onload = function() {
    // now run the app
    ydn.msg.initPipe('options');
    window.app = new OptionPage();
    window.app.init();
  };
  node.src = fn;
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(node);
});
