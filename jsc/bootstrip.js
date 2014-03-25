(function(){/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function a(h){chrome.storage.local.get("ydn-crm-track",function(c){var b=c["ydn-crm-track"];c="jsc/ydn.crm-0.7.7.js";navigator.onLine&&"Edge"==b?c="https://ydn-src-1.storage.googleapis.com/jsc/ydn.crm-edge.js":"Beta"==b?c="jsc/ydn.crm-0.7.8.js":"RC"==b&&(c="jsc/ydn.crm-0.7.7.js");b=document.createElement("script");b.onload=h;b.type="text/javascript";var g={};g["ydn-crm-src"]=c;chrome.storage.local.set(g);b.src=c;document.getElementsByTagName("head")[0].appendChild(b)})}var d=["loadApp"],e=this;
d[0]in e||!e.execScript||e.execScript("var "+d[0]);for(var f;d.length&&(f=d.shift());)d.length||void 0===a?e[f]?e=e[f]:e=e[f]={}:e[f]=a;})();
