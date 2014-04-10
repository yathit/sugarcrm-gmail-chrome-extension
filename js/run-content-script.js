/**
 * @fileoverview Request to load require scripts.
 */

(function () {
  var id = 'ij' + Math.random();
  var scriptLoaded = false;
  var i = 0;
  var loadScript = function () {
    // console.log('inj ' + id + ' send ' + i);
    chrome.runtime.sendMessage({
      'req': 'inject',
      'id': id,
      'i': ++i
    }, function (resp) {
      if (resp) {
        scriptLoaded = true;
      }
    });
    // we load two times, because background thread may not ready listening this
    // message. In this case the message drop. We send again after a timeout.
    setTimeout(function () {
      if (!scriptLoaded && i < 10) {
        loadScript();
      }
    }, 1000);
  };
  loadScript();

})();
