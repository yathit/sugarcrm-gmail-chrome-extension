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
 * @fileoverview Gmail command.
 *
 */


goog.provide('ydn.crm.ui.GmailCmd');
goog.require('goog.dom.TagName');
goog.require('goog.ui.Component');
goog.require('ydn.crm.sugar.model.Sugar');



/**
 * Gmail command panel.
 * @param {ydn.crm.sugar.model.Sugar} sugar
 * @param {ydn.crm.ui.sugar.SugarPanel=} opt_parent
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.GmailCmd = function(sugar, opt_parent) {
  goog.base(this);
  this.setModel(sugar);
  /**
   * @protected
   * @type {ydn.crm.ui.sugar.SugarPanel?}
   */
  this.parent = opt_parent || null;
  this.a_archive_ = new ydn.ui.Reportable();
};
goog.inherits(ydn.crm.ui.GmailCmd, goog.ui.Component);


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.GmailCmd.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.GmailCmd');


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.ui.GmailCmd.prototype.getModel;


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.GmailCmd.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.GmailCmd.CSS_CLASS = 'gmail-cmd-panel';


/** @return {string} */
ydn.crm.ui.GmailCmd.prototype.getCssClass = function() {
  return ydn.crm.ui.GmailCmd.CSS_CLASS;
};


/**
 * Check status.
 * @return {boolean} return true if this component is no longer attached to the
 * document.
 */
ydn.crm.ui.GmailCmd.prototype.isFree = function() {
  return !document.body.contains(this.getElement());
};


/**
 * @inheritDoc
 */
ydn.crm.ui.GmailCmd.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  root.classList.add(this.getCssClass());
  var a_archive = dom.createDom('a', {
    'class': 'archive'
  }, '.');
  this.a_archive_.attachElement(a_archive);
  root.appendChild(a_archive);
};


/**
 * Return Gmail link URL of given message id.
 * @param {string} gmail Google account id.
 * @param {string} id message id
 * @return {string} URL to read the message.
 */
ydn.crm.ui.GmailCmd.messageId2GmailLink = function(gmail, id) {
  return 'http://mail.google.com/mail?account_id=' + gmail + '&message_id=' +
      id + '&view=conv&extsrc=atom';
};


/**
 * Set archive as view link
 * @param {Object} obj Email module record
 */
ydn.crm.ui.GmailCmd.prototype.setViewLink = function(obj) {
  var link = ydn.crm.sugar.getViewLink(this.getModel().getDomain(),
      ydn.crm.sugar.ModuleName.EMAILS, obj['id']);
  /*
   var message_id = obj['message_id'];
  var gmail = ydn.crm.ui.UserSetting.getInstance().getLoginEmail();
   var mail_id = obj['mailbox_id'];
  if (mail_id == gmail) {
    link = ydn.crm.ui.GmailCmd.messageId2GmailLink(gmail, message_id);
  }
  */
  this.a_archive_.setLink('View', link);
  var ele = this.a_archive_.getElement();
  ele.setAttribute('target', 'gmail');
  ele.setAttribute('title', 'View archived email in SugarCRM');
};


/**
 * Set as archive link
 */
ydn.crm.ui.GmailCmd.prototype.setArhiveLink = function() {
  this.a_archive_.setLink('Archive', ydn.crm.ui.GmailCmd.HREF_ARCHIVE);
  var ele = this.a_archive_.getElement();
  ele.setAttribute('title', 'Archive this email message to SugarCRM');
};


/**
 * Scan the message to update labels.
 * @private
 */
ydn.crm.ui.GmailCmd.prototype.updateLabel_ = function() {
  // run in next thread.
  var me = this;
  me.a_archive_.setLink('.');
  setTimeout(function() {
    me.a_archive_.setLink('..');
    var info = ydn.crm.ui.GmailCmd.gatherEmailInfo(me.getElement());
    if (info.message_id) {
      me.a_archive_.setLink('...');
      var q = {
        'store': ydn.crm.sugar.ModuleName.EMAILS,
        'index': 'message_id',
        'key': info.message_id
      };
      me.getModel().send(ydn.crm.Ch.SReq.QUERY, [q]).addCallbacks(function(arr) {
        if (ydn.crm.ui.GmailCmd.DEBUG) {
          window.console.log(arr);
        }
        var record = arr[0] && arr[0]['result'] ? arr[0]['result'][0] : null;
        if (record) {
          me.setViewLink(record);
        } else {
          me.setArhiveLink();
        }
      }, function(e) {
        me.setArhiveLink();
        throw e;
      });
    } else if (info.html.length > 1) {
      me.setArhiveLink();
    } else {
      me.a_archive_.setError('gmail message cannot be parsed');
    }
  }, 100);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.GmailCmd.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  hd.listen(this.a_archive_, 'click', this.handleArchiveClick);
  this.updateLabel_();
};


/**
 * Gither email info for a given a starting element 'el'.
 * <pre>
 * el = document.querySelector('div[data-tooltip=Reply]')
 * ydn.crm.ui.GmailCmd.gatherEmailInfo(el)
 * </pre>
 * @param {Element} el An element under message heading node.
 * @return {ydn.crm.EmailInfo?}
 */
ydn.crm.ui.GmailCmd.gatherEmailInfo = function(el) {
  var from_addr = '';
  var to_addrs = '';
  var date_sent;
  var html = '';
  var mail_id = '';
  var subject = '';
  // email header title row
  var tr_heading = goog.dom.getAncestorByTagNameAndClass(el, goog.dom.TagName.TR);
  var td0 = tr_heading.children[0]; // sender email address node
  var sender_span = td0.querySelector('span[email]');
  if (sender_span) {
    from_addr = sender_span.getAttribute('email');
  } else {
    ydn.crm.shared.logger.warning('cannot sniff sender email');
    if (ydn.crm.ui.GmailCmd.DEBUG) {
      window.console.log(el, tr_heading, td0);
    }
    return null;
  }
  var td1 = tr_heading.children[1]; // sent date node
  var date_span = td1.querySelector('span[alt]');
  if (date_span) {
    var date_str = date_span.getAttribute('alt');
    // something like: "Wed, Apr 2, 2014 at 1:06 AM"
    date_sent = new Date(date_str.replace(' at', ''));
  } else {
    ydn.crm.shared.logger.warning('cannot sniff date sent');
    if (ydn.crm.ui.GmailCmd.DEBUG) {
      window.console.log(el, tr_heading, td1);
    }
    return null;
  }

  var tr_addrs = tr_heading.nextElementSibling;
  if (!tr_addrs || tr_addrs.tagName != goog.dom.TagName.TR) {
    ydn.crm.shared.logger.warning('to email address TR expect after title TR');
    if (ydn.crm.ui.GmailCmd.DEBUG) {
      window.console.log(el, tr_heading, tr_addrs);
    }
    return null;
  }
  var email_spans = tr_addrs.querySelectorAll('span[email]');
  for (var i = 0; i < email_spans.length; i++) {
    if (to_addrs) {
      to_addrs += ', ';
    }
    to_addrs += email_spans[i].getAttribute('email');
  }

  var heading_table = goog.dom.getAncestorByTagNameAndClass(tr_heading, goog.dom.TagName.TABLE);
  var email_content_div = heading_table.parentElement.nextElementSibling;

  for (var i = 0; !!email_content_div && i < 10; i++) {
    var content = email_content_div.querySelector('div[style]');
    if (content) {
      // sniff message Id. it is in longest class name prefix with 'm'
      // className is something like: ii gt m14525197eea77a76 adP adO
      // where message id is: 14525197eea77a76
      var content_title = content.parentElement;
      var cls = content_title.className.split(/\s/);
      var len = cls.map(function(x) {return x.length;});
      var max = len.indexOf(Math.max.apply(Math, len));
      if (cls[max].length > 10) {
        mail_id = cls[max].substring(1);
        if (cls[max].charAt(0) != 'm') {
          ydn.crm.shared.logger.finer('not start with m? ' + cls[max]);
        }
      }
      html = content.innerHTML;
      break;
    } else {
      email_content_div = email_content_div.nextElementSibling;
    }
  }

  var table_thread = goog.dom.getAncestorByTagNameAndClass(heading_table.parentElement,
      goog.dom.TagName.TABLE);
  for (var i = 0; !!table_thread && i < 10; i++) {
    if (table_thread.getAttribute('role') == 'presentation') {
      break;
    }
    table_thread = goog.dom.getAncestorByTagNameAndClass(table_thread, goog.dom.TagName.TABLE);
  }
  if (table_thread.getAttribute('role') == 'presentation') {
    var h2 = table_thread.querySelector('h2');
    if (h2) {
      subject = h2.textContent;
    } else {
      ydn.crm.shared.logger.warning('email subject cannot be sniff');
    }
  } else {
    ydn.crm.shared.logger.warning('expect a presentation role TABLE');
  }

  var gmail = ydn.crm.ui.UserSetting.getInstance().getLoginEmail();

  return {
    from_addr: from_addr,
    to_addrs: to_addrs,
    date_sent: date_sent,
    html: html,
    mailbox_id: gmail,
    message_id: mail_id,
    subject: subject
  };
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.GmailCmd.HREF_ARCHIVE = '#archive';


/**
 * @param {Event} e
 */
ydn.crm.ui.GmailCmd.prototype.handleArchiveClick = function(e) {
  if (goog.string.endsWith(e.target.href, ydn.crm.ui.GmailCmd.HREF_ARCHIVE)) {
    e.preventDefault();
    this.a_archive_.setLink('archiving...');
    var module_name = undefined;
    var record_id = undefined;
    var contexts = this.parent ? this.parent.getContexts() : [];
    if (contexts[0]) {
      module_name = contexts[0].module;
      record_id = contexts[0].id;
    }
    var info = ydn.crm.ui.GmailCmd.gatherEmailInfo(this.getElement());
    if (ydn.crm.ui.GmailCmd.DEBUG) {
      window.console.log(info);
    }
    if (info) {
      var sugar = this.getModel();
      sugar.archiveEmail(info, module_name, record_id).addCallbacks(function(record) {
        this.setViewLink(record);
      }, function(e) {
        this.a_archive_.setError(e);
      }, this);
    } else {
      this.a_archive_.setError('Cannot gather email message');
    }
  }
};
