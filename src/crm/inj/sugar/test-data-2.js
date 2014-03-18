/**
 * @fileoverview MockProvider data having both GData contact and SugarCRM contact.
 */

var sniff_data = {
  email: 'stefano@digita.it'
};

var link_sf = JSON.parse(JSON.stringify(getGDataSf()));
link_sf.gContact$externalId =
    [{"rel":"customer","value":"sugarcrm://kyawtun.insightfulcrm.com/Contacts/9219c089-8b6d-b2fd-86b7-52c18b8c622d"}];


var main_pre = {
  'gdata-list-contact-by-email': {
    '"stefano@digita.it"': [getGDataSf()]
  },
  'list': {
    '[{"store":"Contacts","index":"ydn$emails","key":"stefano@digita.it"}]':
        [{store: 'Contacts', result: []}],
    '[{"store":"Accounts","index":"ydn$emails","key":"stefano@digita.it"}]':
        [{store: 'Accounts', result: []}],
    '[{"store":"Tasks","index":"ydn$emails","key":"stefano@digita.it"}]':
        [{store: 'Tasks', result: []}],
    '[{"store":"Leads","index":"ydn$emails","key":"stefano@digita.it"}]':
        [{store: 'Leads', result: []}]
  }, 'import-gdata': {
    '{"module":"Contacts","kind":"contact","gdata-id":"http://www.google.com/m8/feeds/contacts/kyawtun%40yathit.com/base/35e403850f8de642"}':
    {
        'id': '9219c089-8b6d-b2fd-86b7-52c18b8c622d',
        'full_name': 'Stefano Straus',
        'email1': 'stefano@digita.it'
    },
    '{"module":"Leads","kind":"contact","gdata-id":"http://www.google.com/m8/feeds/contacts/kyawtun%40yathit.com/base/35e403850f8de642"}': {
      'id': '9219c089-8b6d-b2fd-86b7-52c18b8c622d',
      'full_name': 'Stefano Straus',
      'email1': 'stefano@digita.it'
    }
  }, 'put-record': {
    '{"module":"Contacts","record":{"email1":"stefano@digita.it"}}':
    {
      'id': '9219c089-8b6d-b2fd-86b7-52c18b8c622d',
      'full_name': 'Stefano Straus',
      'email1': 'stefano@digita.it'
    }
  }, 'link': {
    '{"kind":"contact","gdata-id":"http://www.google.com/m8/feeds/contacts/kyawtun%40yathit.com/base/35e403850f8de642","external-id":{"label":"Contacts':
        link_sf,
    '{"kind":"contact","gdata-id":"http://www.google.com/m8/feeds/contacts/kyawtun%40yathit.com/base/35e403850f8de642","external-id":{"label":"Leads#1369014291915-NaN","value":"sugarcrm://kyawtun.insightfulcrm.com/Leads/9219c089-8b6d-b2fd-86b7-52c18b8c622d"}}':
        link_sf
  }

};

var queryGData = function(email) {
  var msg = new ydn.msg.Message(ydn.crm.Ch.Req.GDATA_LIST_CONTACT_BY_EMAIL, function(entries) {

    window.console.log(JSON.stringify(entries, null, 2));

  }, this);
  msg.setData(email);
  var main = new ydn.msg.Pipe(ydn.crm.Ch.ServiceName.MAIN);
  main.send(msg);
};


var getSugarData = function(email, domain) {
  var msg_sc = new ydn.msg.Message(ydn.crm.Ch.SReq.LIST, function(results) {
    console.log(results)
  });
  msg_sc.setData([
    {
      'store': 'Contacts',
      'index': 'ydn$emails',
      'key': email
    }
  ]);
  var main = new ydn.msg.Pipe(ydn.crm.Ch.ServiceName.MAIN);
  main.send(msg_sc);
};




function getGDataSf() {
  return {
      "gd$etag": "\"QHc6fTVSLyt7I2A9WhBaEEwORQ0.\"",
      "id": {
        "$t": "http://www.google.com/m8/feeds/contacts/kyawtun%40yathit.com/base/35e403850f8de642"
      },
      "updated": {
        "$t": "2013-05-20T01:44:51.915Z"
      },
      "app$edited": {
        "xmlns$app": "http://www.w3.org/2007/app",
        "$t": "2013-05-20T01:44:51.915Z"
      },
      "category": [
        {
          "scheme": "http://schemas.google.com/g/2005#kind",
          "term": "http://schemas.google.com/contact/2008#contact"
        }
      ],
      "title": {
        "$t": "Stefano Straus"
      },
      "link": [
        {
          "rel": "http://schemas.google.com/contacts/2008/rel#photo",
          "type": "image/*",
          "href": "https://www.google.com/m8/feeds/photos/media/kyawtun%40yathit.com/35e403850f8de642?v=3.0",
          "gd$etag": "\"SC58OXA-fCt7I2BOJxcEQTllAgMXeF0HbQg.\""
        },
        {
          "rel": "self",
          "type": "application/atom+xml",
          "href": "https://www.google.com/m8/feeds/contacts/kyawtun%40yathit.com/full/35e403850f8de642?v=3.0"
        },
        {
          "rel": "edit",
          "type": "application/atom+xml",
          "href": "https://www.google.com/m8/feeds/contacts/kyawtun%40yathit.com/full/35e403850f8de642?v=3.0"
        }
      ],
      "gd$name": {
        "gd$fullName": {
          "$t": "Stefano Straus"
        },
        "gd$givenName": {
          "$t": "Stefano"
        },
        "gd$familyName": {
          "$t": "Straus"
        }
      },
      "gd$email": [
        {
          "rel": "http://schemas.google.com/g/2005#other",
          "address": "stefano@digita.it",
          "primary": "true"
        }
      ],
      "gContact$website": [
        {
          "href": "http://www.google.com/profiles/110146198273700489739",
          "rel": "profile"
        }
      ],
      "ydn$emails": [
        "stefano@digita.it"
      ]
    };
}


