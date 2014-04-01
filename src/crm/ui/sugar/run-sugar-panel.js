/**
 * @fileoverview About this file
 */

// ydn.msg.Pipe.DEBUG = true;
ydn.crm.ui.StatusBar.instance = new ydn.crm.ui.ConsoleStatusBar();
ydn.msg.initPipe('popup');
ydn.debug.log('ydn.crm', 'finer');
var panel;
var user = ydn.crm.inj.UserSetting.getInstance();
var inj = document.querySelector('.inj');
inj.style.maxWidth = '20em';
var div = document.getElementById('sync-panel-root');
ydn.crm.shared.logger.info('starting sugar panel test')

ydn.crm.sugar.model.Sugar.list().addCallbacks(function(models) {
  for (var i = 0; i < models.length; i++) {
    var sugar = /** @type {ydn.crm.sugar.model.Sugar} */ (models[i]);
    user.onReady().addCallback(function() {
      panel = new ydn.crm.ui.sugar.SugarPanel(user.getGmail(), sugar);
      panel.render(div);
    })
    break;
  }
}, function(e) {
  throw e;
});

var btn = document.getElementById('set');
btn.onclick = function(e) {
  var input = document.getElementById('email')
  panel.update(input.value);
};


