/**
 * Created by kyawtun on 28/12/13.
 */


ydn.msg.Pipe.DEBUG = true;
ydn.debug.log('ydn.crm', 'finer');
var domain = 'kyawtun.insightfulcrm.com';
var about = {
  'domain': domain,
  'userName': 'kere@some.com',
  'isLogin': true,
  'hostPermission': true
};
var mod_infos = {};
for (var i = 0; i < sugarCrmModuleInfos.length; i++) {
  mod_infos[sugarCrmModuleInfos[i].module_name] = sugarCrmModuleInfos[i];
}
var panel = new ydn.crm.inj.SugarPanel(null, about, mod_infos);

ydn.msg.main_ = new ydn.msg.MockPipe('main', main_pre);
var ch_name = 'sugar-' + domain;

var ele_sidebar = document.getElementById('sidebar');
panel.render(ele_sidebar);
var model = new ydn.crm.inj.ContactModel(sniff_data.email);
panel.setModel(model);





