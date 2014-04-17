/**
 * @fileoverview MockProvider data having both GData contact and SugarCRM contact.
 */

var sniff_data = {
  email: 'kyawtuns@gmail.com'
};

var main_pre = {
  'about': {
    'null': {
      'isLogin': true
    }
  },
  'gdata-list-contact-by-email': {
    '"kyawtuns@gmail.com"': getTestDataKt()
  },
  'list': {
    '[{"store":"Accounts","index":"ydn$emails","key":"kyawtuns@gmail.com"}]':
        [{store: 'Accounts', result: []}],
    '[{"store":"Tasks","index":"ydn$emails","key":"kyawtuns@gmail.com"}]':
        [{store: 'Tasks', result: []}],
    '[{"store":"Leads","index":"ydn$emails","key":"kyawtuns@gmail.com"}]':
        [{store: 'Leads', result: []}],
    '[{"store":"Contacts","index":"ydn$emails","key":"kyawtuns@gmail.com"}]':
        [{store: 'Contacts', result: getListDataKt()}]
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
  var msg_sc = new ydn.msg.Message(ydn.crm.Ch.SReq.QUERY, function(results) {
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


function getTestDataKt() {
  return [
    {
      "gd$etag": "\"QHk6cTBVLSt7I2A9Wh5UGEsOQww.\"",
      "id": {
        "$t": "http://www.google.com/m8/feeds/contacts/kyawtun%40yathit.com/base/7c7718b40e55a0fc"
      },
      "updated": {
        "$t": "2013-12-24T05:54:41.719Z"
      },
      "app$edited": {
        "xmlns$app": "http://www.w3.org/2007/app",
        "$t": "2013-12-24T05:54:41.719Z"
      },
      "category": [
        {
          "scheme": "http://schemas.google.com/g/2005#kind",
          "term": "http://schemas.google.com/contact/2008#contact"
        }
      ],
      "title": {
        "$t": "Kyaw Tun"
      },
      "link": [
        {
          "rel": "http://schemas.google.com/contacts/2008/rel#photo",
          "type": "image/*",
          "href": "https://www.google.com/m8/feeds/photos/media/kyawtun%40yathit.com/7c7718b40e55a0fc?v=3.0",
          "gd$etag": "\"dQh9NENEfCt7I2BoX3wrVhl7FVAmdyYnXAw.\""
        },
        {
          "rel": "self",
          "type": "application/atom+xml",
          "href": "https://www.google.com/m8/feeds/contacts/kyawtun%40yathit.com/full/7c7718b40e55a0fc?v=3.0"
        },
        {
          "rel": "edit",
          "type": "application/atom+xml",
          "href": "https://www.google.com/m8/feeds/contacts/kyawtun%40yathit.com/full/7c7718b40e55a0fc?v=3.0"
        }
      ],
      "gd$name": {
        "gd$fullName": {
          "$t": "Kyaw Tun"
        },
        "gd$givenName": {
          "$t": "Kyaw"
        },
        "gd$familyName": {
          "$t": "Tun"
        }
      },
      "gContact$nickname": {
        "$t": "Kyaw"
      },
      "gd$email": [
        {
          "rel": "http://schemas.google.com/g/2005#other",
          "address": "kyawtuns@gmail.com",
          "primary": "true"
        },
        {
          "rel": "http://schemas.google.com/g/2005#other",
          "address": "ulwin86@gmail.com"
        },
        {
          "rel": "http://schemas.google.com/g/2005#other",
          "address": "kyawtun@alumni.nus.edu.sg"
        },
        {
          "rel": "http://schemas.google.com/g/2005#other",
          "address": "kokyawtun@gmail.com"
        },
        {
          "rel": "http://schemas.google.com/g/2005#work",
          "address": "tun.bio@tmd.ac.jp"
        }
      ],
      "gd$phoneNumber": [
        {
          "rel": "http://schemas.google.com/g/2005#work",
          "$t": "6478 8277"
        },
        {
          "rel": "http://schemas.google.com/g/2005#mobile",
          "$t": "9296 3588"
        }
      ],
      "gd$structuredPostalAddress": [
        {
          "rel": "http://schemas.google.com/g/2005#home",
          "gd$formattedAddress": {
            "$t": "683A #09-118\nJurong West Central 1\n641683\nSingapore"
          },
          "gd$street": {
            "$t": "683A #09-118\nJurong West Central 1"
          },
          "gd$postcode": {
            "$t": "641683"
          },
          "gd$country": {
            "$t": "Singapore"
          }
        }
      ],
      "gContact$groupMembershipInfo": [
        {
          "deleted": "false",
          "href": "http://www.google.com/m8/feeds/groups/kyawtun%40yathit.com/base/7ca80d57890af1ad"
        },
        {
          "deleted": "false",
          "href": "http://www.google.com/m8/feeds/groups/kyawtun%40yathit.com/base/a5c9013084b96e2"
        },
        {
          "deleted": "false",
          "href": "http://www.google.com/m8/feeds/groups/kyawtun%40yathit.com/base/58271a960e6b0e7a"
        },
        {
          "deleted": "false",
          "href": "http://www.google.com/m8/feeds/groups/kyawtun%40yathit.com/base/6"
        }
      ],
      "ydn$emails": [
        "kyawtuns@gmail.com",
        "ulwin86@gmail.com",
        "kyawtun@alumni.nus.edu.sg",
        "kokyawtun@gmail.com",
        "tun.bio@tmd.ac.jp"
      ]
    }
  ]
}



function getListDataKt() {
  return [
    {
      "assigned_user_name": "Kyaw Administrator",
      "modified_by_name": "Kyaw Administrator",
      "created_by_name": "Kyaw Administrator",
      "id": "88b9f9cb-6e04-e2e8-e8b3-5299bec9bbac",
      "name": "Jonas Sicking",
      "date_entered": "2013-11-30 10:31:54",
      "date_modified": "2013-11-30 10:31:54",
      "modified_user_id": "1",
      "created_by": "1",
      "description": "",
      "deleted": "0",
      "assigned_user_id": "1",
      "team_id": "1",
      "team_set_id": "1",
      "team_count": "1",
      "team_name": "Global",
      "salutation": "",
      "first_name": "Kyaw",
      "last_name": "Tun",
      "full_name": "Kyaw Tun",
      "title": "",
      "department": "",
      "do_not_call": "0",
      "phone_home": "",
      "email": "",
      "phone_mobile": "",
      "phone_work": "",
      "phone_other": "",
      "phone_fax": "",
      "email1": "kyawtuns@gmail.com",
      "email2": "",
      "invalid_email": "0",
      "email_opt_out": "0",
      "primary_address_street": "",
      "primary_address_street_2": "",
      "primary_address_street_3": "",
      "primary_address_city": "",
      "primary_address_state": "",
      "primary_address_postalcode": "",
      "primary_address_country": "",
      "alt_address_street": "",
      "alt_address_street_2": "",
      "alt_address_street_3": "",
      "alt_address_city": "",
      "alt_address_state": "",
      "alt_address_postalcode": "",
      "alt_address_country": "",
      "assistant": "",
      "assistant_phone": "",
      "email_addresses_non_primary": "",
      "picture": "",
      "email_and_name1": "Kyaw Tun &lt;&gt;",
      "lead_source": "",
      "account_name": "Sicking",
      "account_id": "e0716a09-1a1d-7c16-90b3-5299bea600ee",
      "opportunity_role_fields": "                                                                                                                                                                                                                                                              ",
      "opportunity_role_id": "",
      "opportunity_role": "",
      "reports_to_id": "",
      "report_to_name": "",
      "birthdate": false,
      "campaign_id": "",
      "campaign_name": "",
      "c_accept_status_fields": "                                                                                                                                                                                                                                                              ",
      "m_accept_status_fields": "                                                                                                                                                                                                                                                              ",
      "accept_status_id": "",
      "accept_status_name": "",
      "sync_contact": "",
      "modified_user_name": "Kyaw Administrator"
    }
  ];
}

