/**
 * @fileoverview SugarCrm panel body.
 *
 * The panel will display for a target contact of the email thread. The
 * target contact is determined by gmail on the top right side, often a valid
 * gmail contact entry. Using email and contact name of the target, and possibly
 * gmail contact entry, relevant sugarcrm module are queried and display as
 * feed as default.
 *
 * Feed content panel is render here. The rest of the panels are render by
 * respective module panel.
 */


goog.provide('ydn.crm.inj.sugar.Body');
goog.require('goog.ui.TabBar');
goog.require('ydn.crm.inj.sugar.FeedPanel');
goog.require('ydn.crm.inj.sugar.module.Panel');
goog.require('ydn.crm.sugar');



/**
 * Contact sidebar panel.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.sugar.model.Sugar} model
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.Body = function(dom, model) {
  goog.base(this, dom);
  this.setModel(model);
  /**
   * @protected
   * @type {goog.ui.TabBar}
   */
  this.tabbar = new goog.ui.TabBar(goog.ui.TabBar.Location.TOP, null, dom);
};
goog.inherits(ydn.crm.inj.sugar.Body, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.Body.DEBUG = goog.DEBUG;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.Body.CSS_CLASS = 'sugar-body';


/** @return {string} */
ydn.crm.inj.sugar.Body.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.Body.CSS_CLASS;
};


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.inj.sugar.Body.prototype.getModel;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.Body.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.sugar.Body');


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.Body.prototype.getContentElement = function() {
  return goog.dom.getElementByClass('content', this.getElement());
};


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.inj.sugar.Body.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.Body.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.dom_;
  var root = this.getElement();
  /**
   * @type {ydn.crm.sugar.model.Sugar}
   */
  var model = this.getModel();
  goog.dom.classes.add(root, this.getCssClass());

  var tab_bar_ele = dom.createDom('div', 'goog-tab-bar goog-tab-bar-top');
  var tab_sep_ele = dom.createDom('div', 'goog-tab-bar-clear');
  var content = dom.createDom('div', 'content');
  var tab_content_ele = dom.createDom('div', 'goog-tab-content', content);
  root.appendChild(tab_bar_ele);
  root.appendChild(tab_sep_ele);
  root.appendChild(tab_content_ele);

  var tabs = [
    dom.createDom('div', 'goog-tab goog-tab-selected',
        dom.createDom('div', {
          'class': 'feed',
          'title': 'Recent activities'}))
  ];
  var feed_panel = new ydn.crm.inj.sugar.FeedPanel(dom, model);
  this.addChild(feed_panel, true);

  var modules = ydn.crm.sugar.PANEL_MODULES;
  for (var i = 0; i < modules.length; i++) {
    var module = modules[i];
    var module_info = (model.getModuleInfo(module));
    if (!module_info) {
      this.logger.warning('missing module info for ' + module);
      continue;
    }
    if (!module_info.module_name) {
      this.logger.warning('invalid module info for ' + ydn.json.toShortString(module));
      continue;
    }
    var name = module_info.module_name.toLowerCase();
    var code = module_info.module_name.substr(0, 2);
    var tab = dom.createDom('div', 'goog-tab',
        dom.createDom('div',
            {
              'class': name,
              'title': module_info.module_name
            },
            code));
    tabs.push(tab);

    var module_model = model.getModuleModel(/** @type {ydn.crm.sugar.ModuleName} */ (module_info.module_name));
    var panel = new ydn.crm.inj.sugar.module.Panel(dom, module_model);
    this.addChild(panel, true);
  }

  for (var i = 0; i < tabs.length; i++) {
    tab_bar_ele.appendChild(tabs[i]);
  }
  this.tabbar.decorate(tab_bar_ele);
  this.selectContent(null);
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.Body.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.tabbar, goog.ui.Component.EventType.SELECT,
      this.selectContent);
};


/**
 * refresh
 */
ydn.crm.inj.sugar.Body.prototype.refresh = function() {
  this.tabbar.setSelectedTabIndex(0);

};


/**
 * @param e
 */
ydn.crm.inj.sugar.Body.prototype.selectContent = function(e) {
  var index = this.tabbar.getSelectedTabIndex();
  // console.log('select ' + index);
  var contents = this.getContentElement();
  for (var i = 0, n = contents.childElementCount; i < n; i++) {
    goog.style.setElementShown(contents.children[i], i == index);
  }
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.inj.sugar.Body.prototype.handleAddNoteClick = function(e) {

};



