/**
 * Created by kyawtun on 15/12/13.
 */


// so that gmail page can load
var obj = {};
obj[ydn.crm.base.LocalKey.APP_SRC] = '/crm-ex/jsc/ydn.crm-' + ydn.crm.Version.BETA + '.js';;
chrome.storage.local.set(obj);

ydn.debug.log('ydn.crm', 'finer');
ydn.debug.log('ydn.db', 'info');
ydn.debug.log('ydn.app', 'info');
ydn.debug.log('ydn.ds', 'finer');
app = ydn.crm.app.EventPage.runApp();



