/**
 * @fileoverview Contact sidebar panel.
 */


goog.provide('ydn.crm.ui.SidebarPanel');
goog.require('goog.Timer');
goog.require('goog.async.DeferredList');
goog.require('goog.dom.classes');
goog.require('goog.log');
goog.require('goog.ui.Component');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.inj.ContactModel');
goog.require('ydn.crm.inj.Task');
goog.require('ydn.crm.inj.sugar.model.GDataSugar');
goog.require('ydn.crm.ui.SidebarHeader');
goog.require('ydn.crm.ui.UserSetting');
goog.require('ydn.crm.ui.sugar.SugarPanel');
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
   * @type {ydn.crm.ui.UserSetting}
   */
  this.user_setting = ydn.crm.ui.UserSetting.getInstance();

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
ydn.crm.ui.SidebarPanel.CSS_CLASS = 'sidebar';


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
  var sugar_setup = new ydn.crm.ui.SidebarHeader();
  this.addChild(sugar_setup, true);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.SidebarPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(ydn.msg.getMain(), ydn.crm.Ch.Req.LIST_SUGAR, this.handleChannelMessage);
};


/**
 * @param {ydn.msg.Event} e
 */
ydn.crm.ui.SidebarPanel.prototype.handleChannelMessage = function(e) {
  if (e.type == ydn.crm.Ch.Req.LIST_SUGAR) {
    var domains = e.getData();
    goog.asserts.assertArray(domains, 'list of domains must be array');
    var sugars = domains.map(function(name) {
      return {'domain': name};
    });
    this.prepareSugarPanels_(/** @type {Array.<SugarCrm.About>} */ (sugars));
  }
};


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.SidebarPanel.prototype.logger =
    goog.log.getLogger('ydn.crm.ui.SidebarPanel');


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
    for (var i = 0; i < this.getChildCount(); i++) {
      var child = /** @type {ydn.crm.ui.sugar.SugarPanel} */ (this.getChildAt(i));
      if (child instanceof ydn.crm.ui.sugar.SugarPanel) {
        if (child.getDomainName() == name) {
          this.logger.finer('sugar panel already exist created');
          return;
        }
      }
    }
    var panel = new ydn.crm.ui.sugar.SugarPanel(sugar, this.dom_);
    this.logger.finer('sugar panel ' + name + ' created');
    this.addChild(panel, true);
  }, this);
};


/**
 * Update sniff contact data.
 * @param {ydn.crm.inj.ContactModel} cm
 * @private
 */
ydn.crm.ui.SidebarPanel.prototype.updateForNewContact_ = function(cm) {

  var cn = this.getChildCount();
  for (var i = 0; i < cn; i++) {
    var child = /** @type {ydn.crm.ui.sugar.SugarPanel} */ (this.getChildAt(i));
    if (child instanceof ydn.crm.ui.sugar.SugarPanel) {
      /**
       * @type {ydn.crm.sugar.model.GDataSugar}
       */
      var sugar = child.getModel();
      if (cm) {
        sugar.update(cm.getEmail(), cm.getFullName(), cm.getPhone());
      } else {
        sugar.update(null, null, null);
      }
    }
  }
};


/**
 * Update sniff contact data.
 * @param {ydn.crm.inj.ContactModel} cm
 */
ydn.crm.ui.SidebarPanel.prototype.updateForNewContact = function(cm) {

  var cn = this.getChildCount();
  if (cn == 0) { // new sugarcrm instance may have
    this.init().addCallback(function() {
      this.updateForNewContact_(cm);
    }, this);
  } else {
    this.updateForNewContact_(cm);
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
 * Prepare sugar panels.
 * @param {Array.<SugarCrm.About>} sugars list of sugar domain.
 * @private
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.SidebarPanel.prototype.prepareSugarPanels_ = function(sugars) {
  if (ydn.crm.ui.SidebarPanel.DEBUG) {
    window.console.log(sugars);
  }
  var sugar_setup = this.getChildAt(0);
  sugar_setup.setModel(sugars);
  var dfs = [];
  for (var i = this.getChildCount() - 1; i > 0; i--) {
    var ch = this.getChildAt(i);
    if (ch instanceof ydn.crm.ui.sugar.SugarPanel) {
      var has_it = sugars.some(function(x) {
        return x.domain == ch.getDomain();
      });
      if (!has_it) {
        this.logger.fine('disposing sugar panel ' + ch.getDomainName());
        ch.getModel().dispose();
        this.removeChild(ch, true);
      }
    }
  }
  for (var i = 0; i < sugars.length; i++) {
    if (!this.hasSugarPanel(sugars[i].domain)) {
      this.logger.fine('adding sugar panel ' + sugars[i].domain);
      var about = sugars[i];
      if (!about.userName) {
        var channel = ydn.msg.getChannel(ydn.msg.Group.SUGAR, about.domain);
        dfs.push(channel.send(ydn.crm.Ch.SReq.ABOUT).addCallback(function(ab) {
          return this.initSugar_(ab);
        }, this));
      } else {

        dfs.push(this.initSugar_(about));
      }
    }
  }
  return goog.async.DeferredList.gatherResults(dfs);
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
    return this.prepareSugarPanels_(sugars);
  }, this);
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



