(function(){/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function b(h){chrome.storage.local.get("ydn-crm-track",function(c){var a=c["ydn-crm-track"];c="jsc/ydn.crm-0.7.18.js";navigator.onLine&&"Edge"==a?c="https://ydn-src-1.storage.googleapis.com/jsc/ydn.crm-edge.js":"Beta"==a?c="jsc/ydn.crm-0.7.18.js":"RC"==a&&(c="jsc/ydn.crm-0.7.18.js");a=document.createElement("script");a.onload=h;a.type="text/javascript";var g={};g["ydn-crm-src"]=c;chrome.storage.local.set(g);a.src=c;document.getElementsByTagName("head")[0].appendChild(a)})}var d=["loadApp"],e=this;
d[0]in e||!e.execScript||e.execScript("var "+d[0]);for(var f;d.length&&(f=d.shift());)d.length||void 0===b?e=e[f]?e[f]:e[f]={}:e[f]=b;})();
