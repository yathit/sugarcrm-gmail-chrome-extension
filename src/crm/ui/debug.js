/**
 * @fileoverview Debug page.
 *                                                 `
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.Debug');
goog.require('goog.log');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');
goog.require('templ.ydn.crm.inj');
goog.require('ydn.crm.data');
goog.require('ydn.crm.inj');
goog.require('ydn.db');
goog.require('ydn.msg');



/**
 * Debug panel.
 * @constructor
 * @struct
 */
ydn.crm.ui.Debug = function() {
  /**
   * @protected
   * @type {Element}
   */
  this.root = null;
  /**
   * @protected
   * @type {Element}
   */
  this.ele_status = null;

  this.sugar = ydn.msg.getChannel(ydn.msg.Group.SUGAR, 'test.example.com');
};


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.Debug.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.Debug');


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.Debug.DEBUG = goog.DEBUG;


/**
 * Show status
 * @param {*} msg
 */
ydn.crm.ui.Debug.prototype.status = function(msg) {

  if (!this.ele_status || ydn.crm.ui.Debug.DEBUG) {
    window.console.log(msg);
  }
  if (this.ele_status) {
    if (goog.isObject(msg)) {
      msg = JSON.stringify(msg, null, 2);
    } else if (goog.isString(msg) && msg.charAt(0) == '{') {
      msg = JSON.parse(msg);
      msg = JSON.stringify(msg, null, 2);
    }
    this.ele_status.textContent = msg;
  }
};


/**
 * Populate default REST parameters.
 * @param {string} option
 */
ydn.crm.ui.Debug.prototype.renderParams = function(option) {
  var rest_params;
  if (option == 'get_entry_list') {
    rest_params = {
      'query': '',
      'order_by': '',
      'offset': 0,
      'select_fields': [],
      'link_name_to_fields_array': [],
      'max_results': 2,
      'deleted': 0,
      'Favorites': false
    };
  } else if (option == 'get_available_modules') {
    rest_params = {
      'filter': ''
    };
  } else if (option == 'get_entries') {
    rest_params = {
      'ids': [],
      'select_fields': [],
      'link_name_to_fields_array': []
    };
  } else if (option == 'get_module_fields') {
    rest_params = {
      'fields': []
    };
  } else {
    throw new Error(option);
  }

  goog.dom.getElementByClass('sugar-rest-params', this.root).value =
      JSON.stringify(rest_params, null, 2);
};


/**
 * @param {Element} ele
 */
ydn.crm.ui.Debug.prototype.init = function(ele) {
  this.root = ele;
  if (!ele) {
    return;
  }
  goog.soy.renderElement(this.root, templ.ydn.crm.inj.debug);
  this.ele_status = document.getElementById('debug-status');
  var btn_greet = goog.dom.getElementByClass('debug-greet', this.root);

  goog.events.listen(goog.dom.getElementByClass('debug-sugar-nude', this.root),
      'click', function(e) {
        ydn.db.deleteDatabase(ydn.crm.data.db.getName(), ydn.crm.data.db.getType());
      }, true, this);

  goog.events.listen(goog.dom.getElementByClass('sugar-rest-method', this.root),
      goog.events.EventType.CHANGE, function(e) {
      this.renderParams(goog.dom.getElementByClass('sugar-rest-method', this.root).value);
      }, true, this);

  var btn_load = goog.dom.getElementByClass('sugar-rest-load', this.root);
  goog.events.listen(btn_load, 'click', function(e) {

    try {
      var params = JSON.parse(goog.dom.getElementByClass('sugar-rest-params', this.root).value);
      for (var key in params) {
        var val = params[key];
        if ((goog.isString(val) && goog.string.isEmpty(val)) ||
            (goog.isArray(val) && val.length == 0)) {
          delete params[key];
        }
      }
    } catch (je) {
      this.status('Invalid params values');
      throw je;
    }
    params['module_name'] = goog.dom.getElementByClass('sugar-rest-module', this.root).value;

    var df = this.sugar.send(ydn.crm.Ch.SReq.REST, {
      'method': goog.dom.getElementByClass('sugar-rest-method', this.root).value,
      'params': params
    });
    df.addCallback(function(data) {
      this.status(data);
    }, this);
  }, false, this);
  // set default value
  this.renderParams('get_entry_list');

  var ele_channel = document.getElementById('debug-channel');
  var btn = goog.dom.getElementsByTagNameAndClass(goog.dom.TagName.BUTTON, null, ele_channel)[0];
  var select = ele_channel.querySelector('select');
  var input = ele_channel.querySelector('textarea');
  goog.events.listen(select, goog.events.EventType.CHANGE, function(e) {
    if (select.value == ydn.crm.Ch.Req.GDATA_FETCH) {
      input.value = ydn.gdata.Kind.M8_CONTACT;
    } else if (select.value == ydn.crm.Ch.Req.GDATA_LIST_CONTACT_BY_EMAIL) {
      input.value = 'kyawtuns@gmail.com';
    } else if (select.value == ydn.crm.Ch.SReq.LIST_MODULE) {
      input.value = '';
    } else if (select.value == ydn.crm.Ch.SReq.INFO_MODULE) {
      input.value = 'Contacts';
    } else if (select.value == ydn.crm.Ch.SReq.LIST) {
      input.value = 'kyawtuns@gmail.com';
    }
  }, false, this);
  goog.events.listen(btn, 'click', function(e) {
    var ele_channel = e.target.parentElement;
    var req = select.value;

    var data = input.value;
    data = data.charAt(0) == '{' ? JSON.parse(data) : data;

    this.sugar.send(req, data).addBoth(function(data) {
      this.status(data);
    }, this);
  }, true, this);
};


/**
 * Test service with extension channel.
 */
ydn.crm.ui.Debug.prototype.testService = function() {
  this.logger.finest('testing service');
  var value = 'ok' + goog.now();

  ydn.msg.getChannel().send(ydn.crm.Ch.Req.ECHO, value).addCallbacks(function(result) {
    if (result == value) {
      var msg = 'inj.Main ' + ydn.crm.version + ' ready.';
      this.logger.info(msg);
      this.status(msg);
    } else {
      // this.logger.info('invalid service ' + ydn.json.toShortString(msg));
      this.status(result);
    }
  }, function(e) {
    this.status('test fail ' + e.message);
  }, this);
};
