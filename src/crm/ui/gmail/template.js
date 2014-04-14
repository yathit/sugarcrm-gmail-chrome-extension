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
 * @fileoverview Email template.
 *
 */


goog.provide('ydn.crm.ui.gmail.Template');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');
goog.require('goog.ui.Prompt');
goog.require('goog.ui.SubMenu');
goog.require('ydn.crm.shared');
goog.require('ydn.crm.sugar.model.GDataSugar');



/**
 *
 * @param {ydn.crm.sugar.model.GDataSugar} sugar
 * @constructor
 * @struct
 */
ydn.crm.ui.gmail.Template = function(sugar) {
  /**
   * @type {ydn.crm.sugar.model.GDataSugar}
   * @private
   */
  this.model_ = sugar;
  /**
   * Root element.
   * @type {Element}
   * @private
   */
  this.root_ = null;
};


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.gmail.Template.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.gmail.Template');


/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   type: string,
 *   contactRequired: boolean
 * }}
 */
ydn.crm.ui.gmail.Template.Info;


/**
 * @return {ydn.crm.sugar.model.GDataSugar}
 */
ydn.crm.ui.gmail.Template.prototype.getModel = function() {
  return this.model_;
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.gmail.Template.DEBUG = false;


/**
 * Given that FORM element, find Gmail compose body table.
 * @param {Element} form
 * @return {Element} Table element.
 */
ydn.crm.ui.gmail.Template.form2BodyTable = function(form) {
  if (form.tagName != goog.dom.TagName.FORM) {
    if (ydn.crm.ui.gmail.Template.DEBUG) {
      window.console.warn('FORM element require');
    }
    return null;
  }
  // find table element that hold email content and toolbar
  var body_table = form.nextElementSibling;
  while (body_table) {
    if (body_table.tagName == goog.dom.TagName.TABLE) {
      break;
    }
    body_table = body_table.nextElementSibling;
  }
  return body_table;
};


/**
 * Given that FORM element, find last td element, which is candidate for
 * root element.
 * <pre>
 *   var form = document.querySelector('form[enctype="multipart/form-data"]');
 *   var last_td = ydn.crm.ui.gmail.Template.form2TDLastChild(form);
 *   var email = ydn.crm.ui.gmail.Template.extractRecipientEmail(last_td);
 * </pre>
 * @param {Element} form
 * @return {HTMLTableColElement?}
 */
ydn.crm.ui.gmail.Template.form2TDLastChild = function(form) {
  var body_table = ydn.crm.ui.gmail.Template.form2BodyTable(form);
  if (!body_table) {
    if (ydn.crm.ui.gmail.Template.DEBUG) {
      window.console.warn('Compose panel table not found');
    }
    return null;
  }
  // toolbar table element
  var last_tr = body_table.querySelector('tbody').lastElementChild;
  var toolbar_div = last_tr.firstElementChild.firstElementChild.firstElementChild;
  var last_div = toolbar_div.lastElementChild;
  var toolbar_table = last_div.querySelector('table');
  if (!toolbar_table) {
    if (ydn.crm.ui.gmail.Template.DEBUG) {
      window.console.warn('Compose toolbar table not found');
    }
    return null;
  }
  return /** @type {HTMLTableColElement} */ (toolbar_table.querySelector('td:last-child'));
};


/**
 * Observe Gmail compose panel for template menu attachment.
 * <pre>
 *   var tm = new ydn.crm.ui.gmail.Template(sugar);
 *   tm.observeComposePanel(document.body);
 * </pre>
 * @param {Element} el
 * @return {MutationObserver}
 * @deprecated no good way to detect element mutation for new compose panel
 * appearance, use url token changes instead.
 */
ydn.crm.ui.gmail.Template.prototype.observeComposePanel = function(el) {
  var config = /** @type {MutationObserverInit} */ (/** @type {Object} */ ({
    'childList': true,
    'attributes': false,
    'characterData': false,
    'subtree': true,
    'attributeOldValue': false,
    'characterDataOldValue': false
  }));

  /*
  new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      if (m.target.tagName == 'FORM') {
        console.log(mutations);
      }
    })
  }).observe(document.body, config);
  */

  var observer = new MutationObserver(this.observerAndAttach.bind(this));

  observer.observe(el, config);
  return observer;
};


/**
 * Tranverse command element to last TD element.
 * @param {Element} el
 * @return {Element}
 */
ydn.crm.ui.gmail.Template.cmdElement2LastTd = function(el) {
  var tr = goog.dom.getAncestorByTagNameAndClass(el, goog.dom.TagName.TR);
  var el_format = tr.querySelector('div[aria-label="Formatting options"]');
  if (!el_format) {
    if (ydn.crm.ui.gmail.Template.DEBUG) {
      window.console.log('Not a compose command', el);
    }
    return null;
  }
  return tr.lastElementChild;
};


/**
 * Mutation observer for gmail compose panel. If right FORM mutation is observerd,
 * it is attached and show template menu.
 * @param {Array.<MutationRecord>} mutations
 */
ydn.crm.ui.gmail.Template.prototype.observerAndAttach = function(mutations) {
  for (var i = 0; i < mutations.length; i++) {
    var mutation = mutations[i];
    /**
     * @type {Element}
     */
    var el = /** @type {Element} */ (mutation.target);

    var last_td = ydn.crm.ui.gmail.Template.form2TDLastChild(el);
    if (ydn.crm.ui.gmail.Template.DEBUG) {
      window.console.log(el, last_td);
    }
    if (last_td) {
      this.renderMenu(last_td);
    } else {
      this.logger.finer('Not a compose form?');
    }
  }
};


/**
 * Render menu with template info.
 * @param {goog.ui.Menu} menu
 * @param {Array.<ydn.crm.ui.gmail.Template.Info>} templates
 * @private
 */
ydn.crm.ui.gmail.Template.prototype.renderMenu_ = function(menu, templates) {
  if (ydn.crm.ui.gmail.Template.DEBUG) {
    window.console.log(templates);
  }
  var types = [];
  for (var i = 0; i < templates.length; i++) {
    if (types.indexOf(templates[i].type) == -1) {
      types.push(templates[i].type);
    }
  }
  for (var i = 0; i < types.length; i++) {
    if (!types[i]) {
      continue;
    }
    var submenu = new goog.ui.SubMenu(types[i], null, menu.getDomHelper());
    for (var j = 0; j < templates.length; j++) {
      if (templates[j].type == types[i]) {
        var item = new goog.ui.MenuItem(templates[j].name, templates[j]);
        submenu.addItem(item);
      }
    }
    menu.addChild(submenu, true);
  }
  // template without type
  for (var j = 0; j < templates.length; j++) {
    if (!templates[j].type) {
      var item = new goog.ui.MenuItem(templates[j].name, templates[j]);
      menu.addChild(item, true);
    }
  }

  // finally add a link for new menu
  menu.addChild(new goog.ui.MenuSeparator(), true);
  menu.addChild(new goog.ui.MenuItem('New template...', null), true);

};


/**
 * Navigate last TD element to gmail header FORM.
 * @param {Element} last_td the root element, the last HTMLTableColElement in gmail compose
 * panel.
 * @return {Element}
 */
ydn.crm.ui.gmail.Template.lastTD2Form = function(last_td) {
  var toolbar_table = goog.dom.getAncestorByTagNameAndClass(last_td, 'table');
  var content_table = goog.dom.getAncestorByTagNameAndClass(toolbar_table.parentElement, 'table');
  var panel_table = goog.dom.getAncestorByTagNameAndClass(content_table.parentElement, 'table');
  return panel_table.querySelector('form');
};


/**
 * Navigate FORM element to gmail to TEXTAREA element.
 * @param {Element} form
 * @return {Element}
 */
ydn.crm.ui.gmail.Template.form2ToElement = function(form) {
  return form.querySelector('textarea[name="to"]');
};


/**
 * Navigate FORM element to gmail subject DIV element.
 * @param {Element} form
 * @return {Element}
 */
ydn.crm.ui.gmail.Template.form2SubjectElement = function(form) {
  return form.querySelector('input[name="subjectbox"]');
};


/**
 * Navigate FORM element to gmail compose body DIV element.
 * @param {Element} form
 * @return {Element}
 */
ydn.crm.ui.gmail.Template.form2ComposeElement = function(form) {
  var body_table = ydn.crm.ui.gmail.Template.form2BodyTable(form);
  // get compose body DIV element
  // here we have many option to query the DIV
  // <div id=":p8" class="Am Al editable LW-avf" hidefocus="true" aria-label="Message Body"
  // g_editable="true" role="textbox" contenteditable="true";"></div>
  var compose_div = body_table.querySelector('div[aria-label="Message Body"]');
  return compose_div;
};


/**
 * Extract recipient email from the gmail compose panel.
 * @param {Element} last_td the root element, the last HTMLTableColElement in gmail compose
 * panel.
 * @param {goog.debug.Logger=} opt_logger
 * @return {string?}
 */
ydn.crm.ui.gmail.Template.extractRecipientEmail = function(last_td, opt_logger) {
  if (!last_td) {
    return null;
  }
  var logger = opt_logger || ydn.crm.shared.logger;
  var form = ydn.crm.ui.gmail.Template.lastTD2Form(last_td);
  if (!form) {
    logger.warning('Gmail header FORM not found');
    return null;
  }
  var to_input = form.querySelector('textarea[name=to]');
  if (!to_input) {
    logger.warning('To textarea not found.');
    return null;
  }
  var to_head = to_input.parentElement;
  var email_span = to_head.querySelector('span[email]');
  if (!email_span) {
    logger.warning('email span not found in TO element');
    return null;
  }
  if (email_span) {
    return email_span.getAttribute('email');
  } else {
    return null;
  }
};


/**
 * Extract recipient email from the gmail compose panel.
 * @return {string?}
 * @protected
 */
ydn.crm.ui.gmail.Template.prototype.extractRecipientEmail = function() {
  return ydn.crm.ui.gmail.Template.extractRecipientEmail(this.root_, this.logger);
};


/**
 * Handle menu click.
 * @param {Event} e
 */
ydn.crm.ui.gmail.Template.prototype.handleMenuAction = function(e) {
  if (e.target instanceof goog.ui.MenuItem) {
    var item = e.target;
    var info = /** @type {ydn.crm.ui.gmail.Template.Info} */ (item.getModel());
    if (ydn.crm.ui.gmail.Template.DEBUG) {
      window.console.log(info);
    }
    var sugar = this.getModel();
    if (!info) {
      // New template...
      var url = sugar.getNewEmailTemplateUrl();
      // console.log(url);
      window.open(url, sugar.getDomain());
      return;
    }
    var email = this.extractRecipientEmail();
    if (ydn.crm.ui.gmail.Template.DEBUG) {
      window.console.log(email);
    }
    var used_target_contact = false;
    if (!email) {
      email = sugar.getContextGmail();
      used_target_contact = !!email;
      if (ydn.crm.ui.gmail.Template.DEBUG) {
        window.console.log('Using target email ' + email);
      }
    }
    if (email) {
      this.fillTemplate(info.id, email).addCallbacks(function(html) {
        if (ydn.crm.ui.gmail.Template.DEBUG) {
          window.console.log(html);
        }
        var form = ydn.crm.ui.gmail.Template.lastTD2Form(this.root_);
        var subject_ele = ydn.crm.ui.gmail.Template.form2SubjectElement(form);
        var compose_ele = ydn.crm.ui.gmail.Template.form2ComposeElement(form);

        // fill email address if target contact is used
        if (used_target_contact) {
          var to_ele = ydn.crm.ui.gmail.Template.form2ToElement(form);
          to_ele.value = email;
        }

        // fill message subject
        subject_ele.value = info.name;

        // fill message content
        var sel = window.getSelection();
        var fg = document.createElement('span');
        fg.innerHTML = html;
        var REPLACE_SELECTION = false;
        // Node.contains(Node)
        if (REPLACE_SELECTION && compose_ele.contains(/** @type {Element} */ (sel.baseNode))) {
          // this testing never trun true because, selection from the Gmail thread
          // was clear when user click the menu. emmm...
          sel.baseNode.parentElement.replaceChild(fg, sel.baseNode);
        } else {
          compose_ele.appendChild(fg);
        }

      }, function(e) {
        throw e;
      }, this);
    } else {
      window.alert('A valid recipient email address is required in To input field.');
    }
  }
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.gmail.Template.CSS_CLASS = 'crm-template inj';


/**
 * Attach to compose panel.
 * @return {boolean} true if successfully attached.
 */
ydn.crm.ui.gmail.Template.prototype.attach = function() {

  var form = document.querySelector('form[enctype="multipart/form-data"]');

  if (!form) {
    this.logger.warning('compose FORM element not found.');
    return false;
  }
  if (ydn.crm.ui.gmail.Template.DEBUG) {
    var tag = 'tag' + goog.now();
    form.setAttribute('data-ydn-tag', tag);
    window.console.log('form tag with ' + tag);
  }
  var last_td = ydn.crm.ui.gmail.Template.form2TDLastChild(form);
  if (last_td) {
    this.renderMenu(last_td);
    return true;
  } else {
    this.logger.warning('compose toolbar not found.');
    return false;
  }
};


/**
 * Render menu
 * @param {Element} last_td HTMLTableColElement
 * @protected
 */
ydn.crm.ui.gmail.Template.prototype.renderMenu = function(last_td) {
  var dom = new goog.dom.DomHelper(last_td.ownerDocument);
  if (!this.root_) {
    this.root_ = last_td;
    var menu = new goog.ui.Menu(dom);
    var b1 = new goog.ui.MenuButton('$t', menu, null, dom);
    b1.setTooltip('Insert SugarCRM template');
    this.listTemplates(function(templates) {
      this.renderMenu_(menu, templates);
    }, this);
    var span = dom.createDom('span');
    span.className = ydn.crm.ui.gmail.Template.CSS_CLASS;
    last_td.insertBefore(span, last_td.firstElementChild);
    b1.render(span);
    goog.events.listen(menu, goog.ui.Component.EventType.ACTION, this.handleMenuAction, true, this);
    if (ydn.crm.ui.gmail.Template.DEBUG) {
      window.console.log('new template menu renderred', last_td);
    }
  } else if (this.root_.parentElement == last_td) {
    // nothing to do.
  } else {
    if (this.root_.parentElement) {
      this.root_.parentElement.removeChild(this.root_);
    }
    var span = dom.createDom('span');
    span.className = ydn.crm.ui.gmail.Template.CSS_CLASS;
    span.appendChild(this.root_);
    last_td.insertBefore(span, last_td.firstElementChild);
    if (ydn.crm.ui.gmail.Template.DEBUG) {
      window.console.log('new template menu re-attached', last_td);
    }
  }

};


/**
 * @param {string} html
 * @return {boolean} return true if template has reference to contact field name.
 */
ydn.crm.ui.gmail.Template.hasContactRef = function(html) {
  return html.indexOf('$contact_name') >= 0 ||
      html.indexOf('$contact_account_name') >= 0;
};


/**
 * List available templates.
 * Result eg: {'campaign': ["News from CRM"], '': ["Test"]}
 * @param {function(this: T, Array.<ydn.crm.ui.gmail.Template.Info>)} cb result is lists of template name
 * for each template type.
 * @param {T} scope
 * @template T
 */
ydn.crm.ui.gmail.Template.prototype.listTemplates = function(cb, scope) {

  this.getModel().listRecords(ydn.crm.sugar.ModuleName.EMAIL_TEMPLATES,
      undefined, undefined, undefined, 200).addCallbacks(function(x) {
    var query = /** @type {SugarCrm.Query} */ (x[0]);
    var templates_ = [];
    for (var i = 0; i < query.result.length; i++) {
      var record = query.result[i];
      var type = record['type'] || '';
      templates_.push({
        id: record['id'],
        name: record['name'],
        type: type,
        contactRequired: ydn.crm.ui.gmail.Template.hasContactRef(record['body_html'])
      });
    }
    cb.call(scope, templates_);
  }, function(e) {
    throw e;
  }, this);

};


/**
 * Render template with given contact.
 * @param {string} template HTML
 * @param {ydn.crm.sugar.model.Record=} opt_target contact record to fill in the tempalte.
 * @return {string} template HTML by supplementing fields from the record.
 */
ydn.crm.ui.gmail.Template.prototype.renderTemplate = function(template, opt_target) {
  // see parsing in SugarCE-Full-6.5/modules/EmailTemplates/EmailTemplate.php/parse_template_bean

  var user = this.getModel().getUser();
  if (user && user.hasRecord()) {
    var info = this.getModel().getModuleInfo(ydn.crm.sugar.ModuleName.USERS);
    for (var name in info.module_fields) {
      var value = user.value(name);
      if (goog.isString(value)) {
        template = template.replace(new RegExp('\\$user_' + name, 'g'), value);
        // template = template.replace(new RegExp('\\$contact_user_' + name, 'g'), value);
      }
    }
  } else {
    this.logger.warning('Login user info not available');
  }

  if (ydn.crm.ui.gmail.Template.DEBUG) {
    window.console.log(template, user, opt_target);
  }

  if (opt_target && opt_target.hasRecord()) {
    var c_info = opt_target.getModuleInfo();
    for (var name in c_info.module_fields) {
      var value = opt_target.value(name);
      if (goog.isString(value)) {
        template = template.replace(new RegExp('\\$contact_' + name, 'g'), value);
        // template = template.replace(new RegExp('\\$contact_account_' + name, 'g'), value);
      }
    }
  }
  return template;
};


/**
 * Render a template.
 * @param {string} id template id.
 * @param {(ydn.crm.sugar.model.Record|string)=} opt_contact SugarCRM record (Contacts,
 * Leads, or Targets) module. If string, it is email of the record.
 * @return {!goog.async.Deferred} return HTML string of fulfill template.
 */
ydn.crm.ui.gmail.Template.prototype.fillTemplate = function(id, opt_contact) {
  /**
   * @type {ydn.crm.sugar.model.Sugar}
   */
  var sugar = this.getModel();
  if (goog.isString(opt_contact)) {
    var email = opt_contact;
    var query = [{
      'store': ydn.crm.sugar.ModuleName.CONTACTS,
      'index': 'ydn$emails',
      'key': email,
      'limit': 1
    }, {
      'store': ydn.crm.sugar.ModuleName.LEADS,
      'index': 'ydn$emails',
      'key': email,
      'limit': 1
    }];
    return sugar.send(ydn.crm.Ch.SReq.LIST, query).addCallback(function(x) {
      var results = /** @type {Array.<SugarCrm.Query>} */ (x);
      var record = null;
      if (results[0].result[0]) {
        record = new ydn.crm.sugar.Record(sugar.getDomain(), ydn.crm.sugar.ModuleName.CONTACTS,
            results[0].result[0]);
      } else if (results[1].result[0]) {
        record = new ydn.crm.sugar.Record(sugar.getDomain(), ydn.crm.sugar.ModuleName.LEADS,
            results[1].result[0]);
      }
      var model = record ? new ydn.crm.sugar.model.Record(sugar, record) : null;
      return this.fillTemplate(id, model);
    }, this);
  }
  if (!goog.isString(id) || id.length < 16) {
    throw new Error('valid template id required, but ' + id + ' found.');
  }
  var q = {
    'module': ydn.crm.sugar.ModuleName.EMAIL_TEMPLATES,
    'id': id
  };
  return sugar.send(ydn.crm.Ch.SReq.GET, q).addCallback(function(x) {
    var html = x['body_html'];
    if (goog.isString(html)) {
      return this.renderTemplate(html, /** @type {ydn.crm.sugar.model.Record} */ (opt_contact));
    } else {
      throw new Error('Template record: ' + id + ' does not have body_html');
    }
  }, this);
};
