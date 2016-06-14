/**
 * Analytics page.
 */

ydn.debug.log('ydn.crm', 'info');


app = new ydn.crm.app.AnalyticAdmin();

var user_table;

var dispUsers = function(arr) {
  var data = [];
  for (var i = 0; i < arr.length; i++) {
    data[i] = [arr[i].userId, new Date(arr[i].modified)];
  }
  user_table = $('#user-list').DataTable({
    'data': data,
    'columns': [{title: 'User'}, {title: 'Time'}],
    'order': [[1, 'desc']],
    'pageLength': 25
  });
};


$('#user-list').on('click', 'TR', function(e) {
  var row = user_table.row(e.currentTarget);
  var id = row.data()[0];
  updateProfile(id);
  $('a[href="#profile"]').tab('show');
});

$('#profile').on('click', '.grid-row', function(ev) {
  var row = ev.currentTarget;
  var key = row.getAttribute('data-key');
  app.db.values('Record', ydn.db.KeyRange.starts([key])).addCallback(function(r) {
    console.log(r[0]);
    window.ans_record_ = r[0];
    try {
      window.ans_detail_ = JSON.parse(r[0].detail);
      if (window.ans_detail_.request) {
        window.ans_detail_.request = decodeURIComponent(window.ans_detail_.request);
      }
    } catch (e) {
      window.ans_detail_ = null;
    }
  });
});


$('.nav-tabs a').click(function(e) {
  e.preventDefault();
  $(this).tab('show');
});


$('#update').on('click', function() {
  app.Record.update();
});


var updateProfile = function(id) {
  $('#profile h3').text(id);
  app.db.values('Record', 'userId', ydn.db.KeyRange.only(id), 100, 0, true).addCallback(function(arr) {
    console.log(arr);
    var $ul = $('#profile .grid');
    $ul.empty();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].action == 'database-update' || arr[i].category == 'database') {
        continue;
      }
      var s = `<div class="grid-row" data-key="${arr[i].key}">
      <div>${arr[i].category}</div><div>${arr[i].action}</div><div>${arr[i].label}</div>
      <div>${new Date(arr[i].modified).toLocaleString()}</div>
      </div>`;
      $ul.append(s);
    }
  });
};

$('#profile-id').on('change', function(e) {
  updateProfile(e.target.value);
});


app.onReady(function(arr) {



  app.listUsers().addCallback(function(arr) {
    dispUsers(arr);
  });
});
