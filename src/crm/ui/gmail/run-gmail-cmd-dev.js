/**
 * @fileoverview Test file for Gmail CMD.
 *
 */

/*
 * The data for this test is obtained by spitting out HTMl from a gmail with
 * document.querySelector('table[role=presentation]').outerHTML
 * and save to the file.
 */
var fn = 'test-data-1.html';


ydn.app.msg.Manager.addConsumer(new ydn.app.msg.ConsoleStatusBar());
ydn.msg.initPipe('dev');
ydn.debug.log('ydn.crm', 'finer');

var inj, sugar;
ydn.crm.sugar.model.Sugar.list().addCallback(function(sugars) {
  if (sugars[0]) {
    sugar = sugars[0];
    inj = new ydn.crm.ui.GmailCmdInjector(sugar);
    window.console.log('Ready');
  } else {
    window.console.severe('no sugarcrm instance');
  }
});


var btnArchive = document.getElementById('archive');
btnArchive.onclick = function() {
  var subject = document.getElementById('subject').value;
  var content = document.getElementById('content').textContent;
  var from_addr = document.getElementById('from-addr').value;
  var to_addrs = document.getElementById('to-addrs').value;
  btnArchive.setAttribute('disabled', '1');
  var info = {
    from_addr: from_addr,
    to_addrs: to_addrs,
    date_sent: new Date(),
    html: content,
    subject: subject
  };
  sugar.archiveEmail(info).addCallbacks(function(x) {
    console.log(x);
    btnArchive.removeAttribute('disabled');
    var rec = new ydn.crm.sugar.Record(sugar.getDomain(), ydn.crm.sugar.ModuleName.EMAILS, x);
    var a = document.createElement('a');
    a.textContent = 'view';
    a.target = sugar.getDomain();
    a.href = rec.getViewLink();
    document.getElementById('results').appendChild(a);
  }, function(e) {
    btnArchive.removeAttribute('disabled');
    throw e;
  });
};

var btnInject = document.getElementById('inj-gmail');
btnInject.onclick = function() {
  goog.net.XhrIo.send(fn, function(e) {
    var html = e.target.getResponseText();
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
  });
};

