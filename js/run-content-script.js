/**
 * Created by kyawtun on 15/12/13.
 */

console.log('sending script')
chrome.runtime.sendMessage({
  'req': 'inject',
  'href': location.href
}, function(msg) {
  console.log('receiving')
  window.console.log(msg);
});
