/**
 * Created by kyawtun on 15/12/13.
 */


chrome.storage.local.get('ydn-crm-src', function(obj) {
  var fn = obj['ydn-crm-src'];
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
