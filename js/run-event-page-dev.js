/**
 * Created by kyawtun on 15/12/13.
 */


ydn.debug.log('ydn.crm', 'finer');
ydn.debug.log('ydn.ds', 'finer');
ydn.crm.shared.init();
var app = new ydn.crm.app.EventPage();
app.init();
app.run();

