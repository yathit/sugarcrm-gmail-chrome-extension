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


goog.provide('ydn.crm.inj.sugar.PanelsBody');
goog.require('goog.ui.TabBar');
goog.require('ydn.crm.inj.sugar.module.Panel');
goog.require('ydn.crm.sugar');



/**
 * Contact sidebar panel.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.sugar.model.Sugar} model
 * @constructor
 * @struct
 * @extends {goog.ui.Container}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.PanelsBody = function(dom, model) {
  goog.base(this, dom);
  this.setModel(model);
  /**
   * @protected
   * @type {goog.ui.TabBar}
   */
  this.tabbar = new goog.ui.TabBar(goog.ui.TabBar.Location.TOP, null, dom);
};
goog.inherits(ydn.crm.inj.sugar.PanelsBody, goog.ui.Container);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.PanelsBody.DEBUG = goog.DEBUG;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.PanelsBody.CSS_CLASS = 'sugar-body';


/** @return {string} */
ydn.crm.inj.sugar.PanelsBody.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.PanelsBody.CSS_CLASS;
};


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.inj.sugar.PanelsBody.prototype.getModel;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.PanelsBody.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.sugar.PanelsBody');


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.PanelsBody.prototype.getContentElement = function() {
  return goog.dom.getElementByClass('goog-tab-content', this.getElement());
};


/**
 * @return {ydn.crm.sugar.model.Sugar}
 * @override
 */
ydn.crm.inj.sugar.PanelsBody.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.PanelsBody.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.dom_;
  var root = this.getElement();
  /**
   * @type {ydn.crm.sugar.model.Sugar}
   */
  var model = this.getModel();
  goog.dom.classes.add(root, this.getCssClass());

  var tabs = [
    dom.createDom('div', 'goog-tab goog-tab-selected',
        dom.createDom('div', {
          'class': 'feed',
          'title': 'Recent activities'}))
  ];
  var contents = [
    dom.createDom('div', {'name': 'feed'}, 'Feeds')
  ];
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

    var content = dom.createDom('div', {'name': name});
    contents.push(content);

    var module_model = model.getModuleModel(/** @type {ydn.crm.sugar.ModuleName} */ (module_info.module_name));
    var panel = new ydn.crm.inj.sugar.module.Panel(dom, module_model);
    this.addChild(panel, true);
    panel.render(content);
  }

  var tab_bar_ele = dom.createDom('div', 'goog-tab-bar goog-tab-bar-top', tabs);
  var tab_sep_ele = dom.createDom('div', 'goog-tab-bar-clear');
  var tab_content_ele = dom.createDom('div', 'goog-tab-content', contents);
  root.appendChild(tab_bar_ele);
  root.appendChild(tab_sep_ele);
  root.appendChild(tab_content_ele);
  this.tabbar.decorate(tab_bar_ele);

};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.PanelsBody.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();

  this.getHandler().listen(this.tabbar, goog.ui.Component.EventType.SELECT,
      this.selectContent);
};


/**
 * refresh
 */
ydn.crm.inj.sugar.PanelsBody.prototype.refresh = function() {
  this.tabbar.setSelectedTabIndex(0);
};


/**
 * @param e
 */
ydn.crm.inj.sugar.PanelsBody.prototype.selectContent = function(e) {
  var index = this.tabbar.getSelectedTabIndex();
  var contents = this.getContentElement();
  for (var i = 0, n = contents.childElementCount; i < n; i++) {
    if (i == index) {
      goog.dom.classes.add(contents.children[i], 'selected');
    } else {
      goog.dom.classes.remove(contents.children[i], 'selected');
    }
  }
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.inj.sugar.PanelsBody.prototype.handleAddNoteClick = function(e) {

};



