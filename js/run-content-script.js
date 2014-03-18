/**
 * Created by kyawtun on 15/12/13.
 */



(function() {
  // Inject main javascript depending on app setting.
  var ch = ydn.msg.getChannel();
  var load = function(app_setting) {
    ch.send('close');
    var src = chrome.extension.getURL('crm-ex/jsc/ydn.crm.inj.js'); // default file
    if (app_setting) {
      if (navigator.onLine && app.crm.VERSIONS[app_setting.track]) {
        src = app.crm.VERSIONS[app_setting.track];
      }
    }

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.src = src;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
    load = null;
  };
  ch.send('app-setting').addBoth(load);
})();
