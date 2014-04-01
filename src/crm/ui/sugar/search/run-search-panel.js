/**
 * @fileoverview About this file
 */

// ydn.msg.Pipe.DEBUG = true;
ydn.crm.ui.StatusBar.instance = new ydn.crm.ui.ConsoleStatusBar();
ydn.msg.initPipe('popup');
ydn.debug.log('ydn.crm', 'finer');
var panel;

SugarCrmModel.list(function(models) {
  for (var i = 0; i < models.length; i++) {
    if (models[i].isLogin()) {
      var model = models[i];
      ydn.crm.inj.UserSetting.getInstance().getModuleInfo(model.getDomain())
          .addCallback(function(info) {
            var m = new ydn.crm.sugar.model.Sugar(model.getDetails(), info);
            panel = new ydn.crm.ui.sugar.SearchPanel(null, m);
            var root = document.getElementById('sync-panel-root');
            panel.render(root);
          }, this);
      return;
    }
  }
});


