// Copyright 2014 YDN Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Main application for injecting content script to gmail.
 *
 * As soon as the app run, this connect with background script, create stable
 * connection channel and check login status and load of the user
 * setting. Finally this will load Gmail content panel and listen gmail histry
 * changes. These changes are regularily updated back to Gmail content panel.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.inj.App');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.history.Html5History');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar');
goog.require('templ.ydn.crm.inj');
goog.require('ydn.crm.base');
goog.require('ydn.crm.inj');
goog.require('ydn.crm.inj.InlineRenderer');
goog.require('ydn.crm.inj.StickyRenderer');
goog.require('ydn.crm.inj.WidgetRenderer');
goog.require('ydn.crm.shared');
goog.require('ydn.crm.ui.SidebarPanel');
goog.require('ydn.debug');
goog.require('ydn.gmail.Utils.GmailViewState');
goog.require('ydn.msg.Pipe');



/**
 * Main Gmail content script app.
 * @constructor
 * @struct
 */
ydn.crm.inj.App = function() {


  // connection channel with background page.
  ydn.msg.initPipe(ydn.msg.ChannelName.GMAIL);

  /**
   * @protected
   * @type {ydn.crm.inj.AppRenderer}
   */
  this.renderer = new ydn.crm.inj.AppRenderer();

  /**
   * @type {Element}
   */
  this.root_ele = this.renderer.getElement();

  /**
   * @protected
   * @type {ydn.crm.ui.SidebarPanel}
   */
  this.sidebar = new ydn.crm.ui.SidebarPanel();
  this.sidebar.render(this.renderer.getContentElement());

  this.sniff_timer_ = new goog.Timer(400);
  goog.events.listen(this.sniff_timer_, goog.Timer.TICK, this.handleTimerTick_, true, this);
  this.sniff_count_ = 0;
  /**
   * @type {string}
   * @private
   */
  this.current_href_ = '';

  this.history = new goog.history.Html5History();
  this.history.setPathPrefix(new goog.Uri(document.location.href).getPath() + '/');
  goog.events.listen(this.history, goog.history.EventType.NAVIGATE,
      this.handleHistory, false, this);
  this.prev_token_ = null;
  /**
   * @type {ydn.crm.ui.UserSetting}
   * @final
   */
  this.user_setting = ydn.crm.ui.UserSetting.getInstance();

  /**
   * To get consistent value, we need to cache this. // better idea?
   * @protected
   * @type {ydn.crm.ui.ContextPanelPosition}
   */
  this.context_panel_position = this.user_setting.getContextPanelPosition();

};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.App.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.App.prototype.logger = goog.log.getLogger('ydn.crm.inj.App');


/**
 * Sniff contact and suitable element to inject ui.
 * @param {boolean=} opt_log_detail
 * @return {HTMLTableElement}
 */
ydn.crm.inj.App.prototype.getRightBarTable = function(opt_log_detail) {

  // sniff position
  var main = document.querySelector('table[role="presentation"]');
  // the main layout table has one row and three column.
  // take the last column
  if (!main) {
    if (opt_log_detail) {
      this.logger.warning('Could not find main view');
    }
    return null;
  }
  if (opt_log_detail && main.childElementCount != 1) {
    this.logger.warning('Probably our assumption about layout is wrong');
  }
  var tr = main.querySelector('tr');
  if (opt_log_detail && tr.childElementCount != 3) {
    this.logger.warning('Probably our assumption about layout is very wrong');
    return null;
  }
  var td_sidebar = tr.children[2];
  if (opt_log_detail && !td_sidebar.style.height) {
    this.logger.warning('Probably our assumption about layout is wrong');
  }

  return /** @type {HTMLTableElement} */ (td_sidebar.querySelector('table'));
};


/**
 * Sniff contact and set to model.
 * @param e
 * @private
 */
ydn.crm.inj.App.prototype.handleTimerTick_ = function(e) {
  this.sniff_count_++;
  if (this.current_href_ != location.href) {
    // url already changed.
    this.logger.warning('url already changed');
    this.sniff_timer_.stop();
  }
  if (this.sniff_count_ > ydn.crm.inj.App.MAX_SNIFF_COUNT) {
    this.logger.warning('sniff give up after ' + this.sniff_count_);
    this.sniff_timer_.stop();
  }
  var contact_table = this.getRightBarTable();
  if (contact_table) {
    if (this.renderer) {
      this.renderer.attachToGmailRightBar(contact_table);
    }
  }

  var is_advanced_stage = this.sniff_count_ > 5;
  var model = ydn.crm.inj.App.sniffEmail(contact_table, is_advanced_stage);

  if (ydn.crm.inj.App.DEBUG) {
    window.console.log('rendering for ' + model);
  }
  if (model) {
    this.sniff_timer_.stop();
    this.sidebar.updateForNewContact(model);
  }

};


/**
 * @const
 * @type {number}
 */
ydn.crm.inj.App.MAX_SNIFF_COUNT = 40;


/**
 * Sniff email from contact table.
 * @param {Element} contact_table
 * @param {boolean} adv
 * @return {ydn.crm.inj.ContactModel}
 */
ydn.crm.inj.App.sniffEmail = function(contact_table, adv) {
  // span element with email address.
  // var span_emails = td_main.querySelectorAll('span[email]');
  // it is quite hard to get valid identifier of the contact on the sidebar
  if (!contact_table) {
    return null;
  }
  var img_identifier = contact_table.querySelector('img[jid]');
  if (!img_identifier) {
    // use advanced method
    if (adv) {
      // sniff name only, without email
      var name_span = contact_table.querySelector('span[title]');
      if (name_span) {
        var name = name_span.getAttribute('title').trim();
        if (name.length > 0) {
          var email_span = document.querySelector('span[name="' + name + '"][email]');
          if (email_span) {
            var email = email_span.getAttribute('email');
            return new ydn.crm.inj.ContactModel(email, name);
          }
        }
      }
      return null;
    } else {
      return null;
    }
  }
  var email = img_identifier.getAttribute('jid');
  var td_1 = img_identifier;
  while (td_1 && td_1.tagName != 'TD') {
    td_1 = td_1.parentElement;
  }
  var span_title = td_1.nextElementSibling.querySelector('span[title]');
  var contact_name = span_title.getAttribute('title');
  return new ydn.crm.inj.ContactModel(email, contact_name);
};


/**
 * Handle history changes.
 * @param {goog.history.Event} e
 */
ydn.crm.inj.App.prototype.handleHistory = function(e) {
  if (e.token == this.prev_token_) {
    // fixme: to fix repeat call.
    return;
  }
  this.prev_token_ = e.token;
  if (ydn.crm.inj.App.DEBUG) {
    window.console.log(e.token);
  }
  var state = ydn.gmail.Utils.getState(e.token);
  if (state == ydn.gmail.Utils.GmailViewState.COMPOSE) { // compose new
    this.updateForCompose();
  } else if (state == ydn.gmail.Utils.GmailViewState.EMAIL) {
    this.updateForNewThread();
  } else {
    if (this.renderer) {
      this.renderer.attachToGmailRightBar(null);
    }
  }
};


/**
 * Compose panel appear.
 */
ydn.crm.inj.App.prototype.updateForCompose = function() {
  var val = this.sidebar.injectTemplateMenu();
  this.logger.finest('inject compose ' + (val ? 'ok' : 'fail'));
};


/**
 * When a new email thread is display on Gmail, we have to update sidebar
 * for changes in context contact.
 */
ydn.crm.inj.App.prototype.updateForNewThread = function() {
  this.logger.finest('updating sidebar');
  this.sniff_count_ = 0;
  this.current_href_ = location.href;
  if (this.renderer) {
    this.renderer.attachToGmailRightBar(null);
  }
  this.sidebar.updateForNewContact(null); // let know, new context is coming.
  this.sniff_timer_.start();
};


/**
 * @const
 * @type {boolean}
 */
ydn.crm.inj.App.SHOW_TABPANE = true;


/**
 * Attach context panel as in user setting.
 * @private
 */
ydn.crm.inj.App.prototype.redraw_ = function() {
  // update positioning
  this.context_panel_position = this.user_setting.getContextPanelPosition();
  if (this.context_panel_position == ydn.crm.ui.ContextPanelPosition.INLINE) {
    if (!this.renderer || !(this.renderer instanceof ydn.crm.inj.InlineRenderer)) {
      this.renderer = new ydn.crm.inj.InlineRenderer(this.root_ele);
      this.renderer.attach();
    }
  } else if (this.context_panel_position == ydn.crm.ui.ContextPanelPosition.WIDGET) {
    if (!this.renderer || !(this.renderer instanceof ydn.crm.inj.WidgetRenderer)) {
      this.renderer = new ydn.crm.inj.WidgetRenderer(this.root_ele);
      this.renderer.attach();
    }
  } else {
    // default ydn.crm.ui.ContextPanelPosition.STICKY
    if (!this.renderer || !(this.renderer instanceof ydn.crm.inj.StickyRenderer)) {
      this.renderer = new ydn.crm.inj.StickyRenderer(this.root_ele);
      this.renderer.attach();
    }
  }
};


/**
 * Init UI.
 */
ydn.crm.inj.App.prototype.init = function() {
  this.logger.finer('init ' + this);
  this.user_setting.onReady().addCallbacks(function() {
    this.logger.finest('initiating UI');
    if (this.user_setting.isLogin()) {
      this.sidebar.init();
      this.history.setEnabled(true);
      this.redraw_();
    } else {
      // we are not showing any UI if user is not login.
      // user should use browser bandage to login and refresh the page.
      this.logger.warning('user not login');
      this.history.setEnabled(false);
    }
  }, function(e) {
    throw e;
  }, this);

};


/**
 * @inheritDoc
 */
ydn.crm.inj.App.prototype.toString = function() {
  return 'inj.Main:' + ydn.crm.version;
};


/**
 * Initialize Google data after login.
 * @param {YdnApiUser} user_info
 * @protected
 */
ydn.crm.inj.App.prototype.initData = function(user_info) {

};


/**
 * @param {YdnApiUser} user_info
 * @protected
 */
ydn.crm.inj.App.prototype.handleLogin = function(user_info) {
  if (user_info && user_info.email) {
    this.logger.finest('user ' + user_info.email + ' login');
    this.sidebar.init();
    this.history.setEnabled(true);
  } else {
    this.history.setEnabled(false);
  }
};


/**
 * Main entry script to run the app.
 * @return {ydn.crm.inj.App}
 */
ydn.crm.inj.App.runApp = function() {
  ydn.crm.shared.init();

  var app = new ydn.crm.inj.App();
  // wait a bit while gmail loading other gadgets so that we are not slowing
  // down gmail buildin.
  /*
  var tid1 = window.setInterval(function() {
    // this footer is loaded very lately.
    var ele = document.querySelector('a[href="http://mail.google.com/mail/help/terms.html"]');
    if (ele) {
      window.clearTimeout(tid1);
      window.clearTimeout(tid2);
      app.init();
    }
  }, 500);
  */
  var tid2 = window.setTimeout(function() {
    // after 15 sec, we will load anyways
    app.init();
  }, 500);

  return app;
};


