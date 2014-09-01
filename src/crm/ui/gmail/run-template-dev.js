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
var user = ydn.crm.ui.UserSetting.getInstance();
ydn.debug.log('ydn.crm', 'finer');

var sugar, template;
ydn.crm.sugar.model.Sugar.list().addCallbacks(function(sugars) {
  if (sugars[0]) {
    sugar = sugars[0];
    template = new ydn.crm.ui.gmail.Template(sugar);
    var cm = new ydn.crm.inj.ContactModel('sugar.im.vegan@example.tv');
    template.attach(cm);

    // list template names
    sugar.send(ydn.crm.Ch.SReq.QUERY, [{
      'store': ydn.crm.sugar.ModuleName.EMAIL_TEMPLATES
    }]).addCallbacks(function(q) {
      console.log(q);
      var arr = q[0].result;
      var list = document.getElementById('templates')
      for (var i = 0; i < arr.length; i++) {
        var option = document.createElement('option');
        option.value = arr[i]['name'];
        option.setAttribute('data', arr[i]['id']);
        list.appendChild(option);
      }
    }, function(e) {
      throw e;
    })
    window.console.log('Ready');
  } else {
    window.console.severe('no sugarcrm instance');
  }
}, function(e) {
  throw e;
});


var btnRender = document.getElementById('render');
btnRender.onclick = function(e) {
  e.preventDefault();
  var email = document.getElementById('email').value;
  var name = document.getElementById('template-name').value;
  var option = document.getElementById('templates').querySelector('option[value="' + name + '"]');
  var id = option.getAttribute('data');
  template.fillTemplate(id, email).addCallbacks(function(html) {
    document.getElementById('result').innerHTML = html;
  }, function(e) {
    throw e;
  })
};

var inputEmail = document.getElementById('email');
inputEmail.onblur = function(e) {
  var to_attrs = document.getElementById('to-addrs');
  var span = document.createElement('span');
  var email = inputEmail.value;
  span.textContent = email;
  span.setAttribute('email', email);
  to_attrs.appendChild(span);
}

