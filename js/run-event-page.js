/**
 * Created by kyawtun on 9/10/14.
 */

var fn = 'jsc/ydn.crm-' + window.CRMinInbox.Version.release + '.js';
console.log('loading ' + fn);
var node = document.createElement('script');
node.type = 'text/javascript';
node.onload = function() {
  // now run the app
  window.app = runBackgroundApp();
};
node.src = fn;
var head = document.getElementsByTagName('head')[0];
head.appendChild(node);

