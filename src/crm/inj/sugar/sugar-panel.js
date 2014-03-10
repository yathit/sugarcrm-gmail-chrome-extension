/**
 * @fileoverview SugarCRM panel.
 *
 * A SugarCRM panel represent a fixed sugarcrm instance, with or without valid
 * login.
 *
 * The panel will probe available sugarcrm module and its fields before
 * initializing this instance. User may have preference setting.
 *
 * This panel display on right side bar of the gmail interface in email thread
 * view. SugarCrm instance related UI are on Header and email thread dependent
 * UI are in Body panels.
 */


goog.provide('ydn.crm.inj.SugarPanel');
goog.require('goog.debug.Logger');
goog.require('goog.ui.Component');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.inj.sugar.Body');
goog.require('ydn.crm.inj.sugar.FeedBody');
goog.require('ydn.crm.inj.sugar.Header');
goog.require('ydn.gdata.m8.ContactEntry');
goog.require('ydn.json');



/**
 * Contact sidebar panel.
 * @param {goog.dom.DomHelper} dom
 * @param {SugarCrm.About} about
 * @param {Object.<SugarCrm.ModuleInfo>} modules_info
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.SugarPanel = function(dom, about, modules_info) {
  goog.base(this, dom);
  var model = new ydn.crm.sugar.model.Sugar(about, modules_info);
  this.setModel(model);

};
goog.inherits(ydn.crm.inj.SugarPanel, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.SugarPanel.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.SugarPanel.CSS_CLASS = 'sugar-panel';


/** @return {string} */
ydn.crm.inj.SugarPanel.prototype.getCssClass = function() {
  return ydn.crm.inj.SugarPanel.CSS_CLASS;
};


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.inj.SugarPanel.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.inj.SugarPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.dom_;
  var root = this.getElement();
  goog.dom.classes.add(root, this.getCssClass());


  var header_panel = new ydn.crm.inj.sugar.Header(dom, this.getModel());
  this.addChild(header_panel, true);

  // var body_panel = new ydn.crm.inj.sugar.Body(dom, this.getModel());
  var body_panel = new ydn.crm.inj.sugar.FeedBody(dom, this.getModel());
  this.addChild(body_panel, true);
};


/**
 * @inheritDoc
 */
ydn.crm.inj.SugarPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.SugarPanel.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.SugarPanel');


/**
 * @return {!ydn.msg.Channel}
 */
ydn.crm.inj.SugarPanel.prototype.getChannel = function() {
  return ydn.msg.getChannel(ydn.msg.Group.SUGAR, this.getDomainName());
};


/**
 * @return {string}
 */
ydn.crm.inj.SugarPanel.prototype.getDomainName = function() {
  return this.getModel().getDomain();
};


/**
 * Change contact model when inbox changes.
 * @param {ydn.crm.inj.ContactModel} contact_model
 */
ydn.crm.inj.SugarPanel.prototype.updateContact = function(contact_model) {
  /**
   * @type {ydn.crm.sugar.model.Sugar}
   */
  var model = this.getModel();
  var root = this.getElement();
  var email = contact_model.getEmail();
  if (!email) {
    goog.style.setElementShown(root, false);
    // this.body_panel;
    return;
  }
  goog.style.setElementShown(root, true);

  model.setContactModel(contact_model);

};


