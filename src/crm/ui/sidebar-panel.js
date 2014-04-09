/**
 * @fileoverview Contact sidebar panel.
 */


goog.provide('ydn.crm.ui.SidebarPanel');
goog.require('goog.Timer');
goog.require('goog.async.DeferredList');
goog.require('goog.debug.Logger');
goog.require('goog.dom.classes');
goog.require('goog.ui.Component');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.inj.ContactModel');
goog.require('ydn.crm.ui.sugar.SugarPanel');
goog.require('ydn.crm.inj.Task');
goog.require('ydn.crm.inj.UserSetting');
goog.require('ydn.crm.inj.sugar.model.GDataSugar');
goog.require('ydn.crm.ui.SugarSetupLink');
goog.require('ydn.gdata.m8.ContactEntry');
goog.require('ydn.msg.Message');



/**
 * Contact sidebar panel.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.SidebarPanel = function(opt_dom) {
  goog.base(this, opt_dom);

  /**
   * @type {ydn.crm.inj.UserSetting}
   */
  this.user_setting = ydn.crm.inj.UserSetting.getInstance();

  /**
   * @type {ydn.crm.ui.gmail.Template}
   * @private
   */
  this.gmail_template_ = null;
};
goog.inherits(ydn.crm.ui.SidebarPanel, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.SidebarPanel.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.SidebarPanel.CSS_CLASS = 'inj';


/** @return {string} */
ydn.crm.ui.SidebarPanel.prototype.getCssClass = function() {
  return ydn.crm.ui.SidebarPanel.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.ui.SidebarPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  root.classList.add(this.getCssClass());
  var sugar_setup = new ydn.crm.ui.SugarSetupLink();
  this.addChild(sugar_setup, true);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.SidebarPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.SidebarPanel.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.ui.SidebarPanel');


/**
 * Initialize sugar instance panel.
 * @param {SugarCrm.About} about
 * @private
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.SidebarPanel.prototype.initSugar_ = function(about) {
  var name = about.domain;
  var df = this.user_setting.getModuleInfo(name);
  return df.addCallback(function(modules_info) {
    var ac = this.user_setting.getGmail();
    var sugar = new ydn.crm.sugar.model.GDataSugar(about, modules_info, ac);
    if (!this.gmail_template_ && sugar.isLogin()) {
      this.logger.finer('compose template initialized.');
      this.gmail_template_ = new ydn.crm.ui.gmail.Template(sugar);
    }
    var panel = new ydn.crm.ui.sugar.SugarPanel(sugar, this.dom_);
    for (var i = 0; i < this.getChildCount(); i++) {
      var child = /** @type {ydn.crm.ui.sugar.SugarPanel} */ (this.getChildAt(i));
      if (child instanceof ydn.crm.ui.sugar.SugarPanel) {
        if (child.getDomainName() == name) {
          return;
        }
      }
    }
    this.logger.finer('sugar panel ' + name + ' created');
    this.addChild(panel, true);
  }, this);
};


/**
 * Update sniff contact data.
 * @param {ydn.crm.inj.ContactModel} cm
 */
ydn.crm.ui.SidebarPanel.prototype.updateForNewContact = function(cm) {

  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {ydn.crm.ui.sugar.SugarPanel} */ (this.getChildAt(i));
    if (child instanceof ydn.crm.ui.sugar.SugarPanel) {
      /**
       * @type {ydn.crm.sugar.model.GDataSugar}
       */
      var sugar = child.getModel();
      if (cm) {
        sugar.update(cm.getEmail(), cm.getFullName(), cm.getPhone())
      } else {
        sugar.update(null, null, null);
      }
    }
  }

};


/**
 * Inject template menu on Gmail compose panel.
 * @return {boolean} true if injected.
 */
ydn.crm.ui.SidebarPanel.prototype.injectTemplateMenu = function() {
  if (this.gmail_template_) {
    return this.gmail_template_.attach();
  } else {
    this.logger.warning('SugarCRM instance not ready.');
    return false;
  }
};


/**
 * Check existance of sugarcrm instance on the panel.
 * @param {string} name domain name
 * @return {boolean}
 */
ydn.crm.ui.SidebarPanel.prototype.hasSugarPanel = function(name) {
  for (var i = 1; i < this.getChildCount(); i++) {
    var ch = this.getChildAt(i);
    if (ch instanceof ydn.crm.ui.sugar.SugarPanel) {
      if (ch.getDomainName() == name) {
        return true;
      }
    }
  }
  return false;
};


/**
 * Initialize available sugar panels.
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.SidebarPanel.prototype.init = function() {

  if (this.getChildCount() > 1) {
    return goog.async.Deferred.succeed(); // already initialize sugar panel.
  }
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.LIST_SUGAR).addCallback(function(sugars) {
    if (ydn.crm.ui.SidebarPanel.DEBUG) {
      window.console.log('init sugar', sugars);
    }

    var sugar_setup = this.getChildAt(0);
    sugar_setup.setModel(sugars);
    var dfs = [];
    for (var i = 0; i < sugars.length; i++) {
      if (!this.hasSugarPanel(sugars[i])) {
        dfs.push(this.initSugar_(sugars[i]));
      }
    }
    return goog.async.DeferredList.gatherResults(dfs);
  }, this);
};


/**
 * Sniff contact and suitable element to inject ui.
 * @param {boolean=} opt_log_detail
 * @return {HTMLTableElement}
 */
ydn.crm.ui.SidebarPanel.prototype.getRightBarTable = function(opt_log_detail) {
  var root = this.getElement();

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
  var td_main = tr.children[0];
  var td_sidebar = tr.children[2];
  if (opt_log_detail && !td_sidebar.style.height) {
    this.logger.warning('Probably our assumption about layout is wrong');
  }

  return /** @type {HTMLTableElement} */ (td_sidebar.querySelector('table'));
};


/**
 * Get current contact showing on sidebar of gmail.
 * @return {ydn.crm.inj.ContactModel}
 * @override
 */
ydn.crm.ui.SidebarPanel.prototype.getModel;


/**
 * Show or hide this panel.
 * @param {boolean} val
 */
ydn.crm.ui.SidebarPanel.prototype.setVisible = function(val) {
  goog.style.setElementShown(this.getElement(), val);
};


/**
 * Attach to Gmail right side bar.
 * @param {HTMLTableElement} contact_table right bar table
 */
ydn.crm.ui.SidebarPanel.prototype.attachToGmailRightBar = function(contact_table) {

  // locate root element
  var root_container;
  var ele_stack = contact_table;
  for (var i = 0; i < 4; i++) {
    if (ele_stack.parentElement) {
      ele_stack = ele_stack.parentElement;
      if (ele_stack.nextElementSibling && ele_stack.nextElementSibling.tagName == 'DIV') {
        var parent = ele_stack.parentElement;
        var last = parent.lastElementChild;
        var is_ad = !!last.querySelector('a[href]'); // ad links
        root_container = document.createElement('div');
        if (is_ad) {
          parent.parentElement.insertBefore(root_container, last);
        } else {
          parent.appendChild(root_container);
        }
        break;
      }
    }
  }
  // root_container = null;
  if (!root_container) {
    // this technique is robust, but place in the table.
    this.logger.warning('usual root position is not available, locating on second best position');
    var doc = contact_table.ownerDocument;
    var td = doc.createElement('td');
    td.setAttribute('colspan', '2');
    var tr = doc.createElement('tr');
    tr.className = 'widget-topraw';
    tr.appendChild(td);
    // window.console.log(this.root.parentElement, table);
    var base = contact_table.querySelector('tbody') || contact_table;
    base.appendChild(tr);
    root_container = td;
  }
  var root = this.getElement();
  if (root.parentElement) {
    root.parentElement.removeChild(this.getElement());
    root_container.appendChild(root);
  } else {
    root_container.appendChild(root);
  }
  goog.style.setElementShown(this.getElement(), true);
};




