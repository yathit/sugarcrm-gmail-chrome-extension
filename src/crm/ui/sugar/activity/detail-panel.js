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
 * @fileoverview Activity detail panel.
 *
 * Note: Events are handled by the parent activity panel.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.sugar.activity.DetailPanel');



/**
 * Activity detail panel.
 * @param {ydn.crm.sugar.model.Sugar} model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.sugar.activity.DetailPanel = function(model, dom) {
  goog.base(this, dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.ui.sugar.activity.DetailPanel, goog.ui.Component);


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.getModel;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_ITEM = 'detail-item';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_CLOSE = 'close';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_HEADER = 'header';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_CONTENT = 'content';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS = 'detail-panel';


/** @return {string} */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.getCssClass = function() {
  return ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.dom_;
  var root = this.getElement();
  root.classList.add(this.getCssClass());
  root.appendChild(dom.createDom('div', ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_HEADER));
  root.appendChild(dom.createDom('div', ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_CONTENT));
};


/**
 * @return {Element}
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.getHeadElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_HEADER);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_CONTENT);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  // this.getHandler().listen(this.getElement(), 'click', this.handleClick_);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.handleClick_ = function(e) {

};


/**
 * Render item
 * @param {SugarCrm.Record} record
 * @private
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.renderItem_ = function(record) {
  var dom = this.getDomHelper();
  var domain = this.getModel().getDomain();
  var m_name = /** @type {ydn.crm.sugar.ModuleName} */ (record._module);
  var r = new ydn.crm.sugar.Record(domain, m_name, record);
  var icon = dom.createDom('div', 'icon', record._module.substr(0, 2));
  var msg = dom.createDom('span');
  var mod_id = r.value('modified_user_id');
  var user_id = r.value('created_by');
  if (mod_id) {
    var mod_link = dom.createDom('a', {
      'href': ydn.crm.sugar.getViewLink(domain, ydn.crm.sugar.ModuleName.USERS, mod_id),
      'target': '_blank'
    }, r.value('modified_user_name'));
    msg.appendChild(mod_link);
    msg.appendChild(dom.createTextNode(' '));
  } else if (user_id) {
    var user_link = dom.createDom('a', {
      'href': ydn.crm.sugar.getViewLink(domain, ydn.crm.sugar.ModuleName.USERS, user_id),
      'target': '_blank'
    }, r.value('created_by_name'));
    msg.appendChild(user_link);
    msg.appendChild(dom.createTextNode(' '));
  }

  var type = record.date_modified == record.date_entered ? 'created ' : 'updated ';
  msg.appendChild(dom.createTextNode(type));
  var link = dom.createDom('a', {
    'href': r.getViewLink(),
    'target': '_blank'
  }, r.value('name'));
  msg.appendChild(link);

  var m_no_s = ydn.crm.sugar.Record.moduleAsNoun(m_name);
  msg.appendChild(dom.createTextNode(' ' + m_no_s + ''));

  var since = ydn.crm.sugar.utils.parseDate(record['date_modified']);
  var t = goog.date.relative.format(since.getTime()) || 'on ' + since.toLocaleDateString();
  msg.appendChild(dom.createTextNode(' ' + t + '.'));

  var div = dom.createDom('div', null, [icon, msg]);
  div.className = ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_ITEM +
      ' record-header ' + record._module;
  this.getContentElement().appendChild(div);
};


/**
 *
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.clear = function() {
  var content = this.getContentElement();
  content.innerHTML = '';
  var head = this.getHeadElement();
  head.innerHTML = '';
};


/**
 * Return query.
 * @param {ydn.crm.sugar.ModuleName} m_name one of ydn.crm.sugar.ACTIVITY_MODULES.
 * @return {CrmApp.ReqQuery} query
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.queryUpcoming = function(m_name) {
  var assigned_user_id = this.getModel().getUser().getId();
  var start_date = ydn.crm.sugar.utils.toDateString(new Date());
  var kr = ydn.db.KeyRange.bound([assigned_user_id, start_date], [assigned_user_id, '\uffff']);

  var query = {
    'store': m_name,
    'index': ydn.crm.sugar.Record.getIndexForDeadline(m_name),
    'keyRange': kr
  };
  return /** @type {CrmApp.ReqQuery} */ (/** @type {Object} */ (query));
};


/**
 * Render recent activity.
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.renderActivity = function() {
  var root = this.getElement();
  this.getModel().send(ydn.crm.Ch.SReq.ACTIVITY_STREAM).addCallbacks(function(ans) {
    // window.console.log(ans);
    var dom = this.getDomHelper();
    var title = dom.createDom('span');
    if (ans.length > 0) {
      var since = ydn.crm.sugar.utils.parseDate(ans[ans.length - 1]['date_modified']);
      var t = goog.date.relative.format(since.getTime()) || since.toLocaleDateString();
      title.textContent = ans.length + ' records updated since ' + t;
    } else {
      title.appendChild(dom.createTextNode('No activity? Have you '));
      var link = dom.createDom('a', {'href': chrome.extension.getURL('setup.html')}, 'setup');
      title.appendChild(link);
      title.appendChild(dom.createTextNode('?'));
    }
    this.renderHeader_(title);
    for (var i = 0; i < ans.length; i++) {
      this.renderItem_(ans[i]);
    }
  }, function(e) {
    throw e;
  }, this);
};


/**
 * Render upcoming activity item.
 * @param {SugarCrm.Record} obj
 * @param {ydn.crm.sugar.ModuleName} m_name
 * @private
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.renderUpcomingItem_ = function(obj, m_name) {
  var dom = this.getDomHelper();
  var domain = this.getModel().getDomain();
  var r = new ydn.crm.sugar.Record(domain, m_name, obj);
  var msg = dom.createDom('span');
  var verb = ydn.crm.sugar.Record.moduleAsVerb(m_name);
  verb = verb.charAt(0).toUpperCase() + verb.substr(1) + ' ';
  msg.appendChild(dom.createTextNode(verb));
  var link = dom.createDom('a', {
    'href': r.getViewLink(),
    'target': '_blank'
  }, r.value('name'));
  msg.appendChild(link);
  var deadline = r.getDeadline();
  var time_msg = goog.date.relative.format(deadline.getTime()) || 'on ' + deadline.toLocaleDateString();
  msg.appendChild(dom.createTextNode(' ' + time_msg + '.'));
  var div = dom.createDom('div', null, [msg]);
  div.className = ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_ITEM +
      ' record-header ' + obj._module;
  this.getContentElement().appendChild(div);
};


/**
 * Render header using given element as title.
 * @param {Element} el
 * @private
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.renderHeader_ = function(el) {
  var head = this.getHeadElement();
  head.innerHTML = '';
  head.appendChild(el);
  var close = this.getDomHelper().createDom('div', ydn.crm.ui.sugar.activity.DetailPanel.CSS_CLASS_CLOSE);
  close.innerHTML = '&#x25B2';
  close.setAttribute('title', 'Close');
  close.setAttribute('name', 'close');
  head.appendChild(close);
};


/**
 * Render upcoming activity.
 * @param {ydn.crm.sugar.ModuleName} m_name one of ydn.crm.sugar.ACTIVITY_MODULES.
 */
ydn.crm.ui.sugar.activity.DetailPanel.prototype.renderUpcoming = function(m_name) {
  var q = this.queryUpcoming(m_name);
  this.getModel().send(ydn.crm.Ch.SReq.VALUES, q).addCallbacks(function(arr) {
    var results = /** @type {Array.<SugarCrm.Record>} */ (arr);
    var head = this.getDomHelper().createDom('span');
    head.textContent = results.length + ' upcoming ' + m_name;
    this.renderHeader_(head);
    for (var i = 0; i < results.length; i++) {
      this.renderUpcomingItem_(results[i], m_name);
    }
  }, function(e) {
    throw e;
  }, this);
};
