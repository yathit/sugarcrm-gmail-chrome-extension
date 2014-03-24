(function(){/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function a(g){chrome.storage.local.get("ydn-crm-track",function(c){var b=c["ydn-crm-track"];c=chrome.runtime.getURL("jsc/ydn.crm-0.7.3.js");navigator.onLine&&"Edge"==b?c="https://ydn-src-1.storage.googleapis.com/jsc/ydn.crm-edge.js":"Beta"==b?c=chrome.runtime.getURL("jsc/ydn.crm-0.7.3.js"):"RC"==b&&(c=chrome.runtime.getURL("jsc/ydn.crm-0.7.3.js"));b=document.createElement("script");b.onload=g;b.type="text/javascript";chrome.storage.local.set({"ydn-crm-src":c});b.src=c;document.getElementsByTagName("head")[0].appendChild(b)})}
var d=["loadApp"],e=this;d[0]in e||!e.execScript||e.execScript("var "+d[0]);for(var f;d.length&&(f=d.shift());)d.length||void 0===a?e[f]?e=e[f]:e=e[f]={}:e[f]=a;})();
