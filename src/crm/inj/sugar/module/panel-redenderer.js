/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This provides adding, linking and syncing.
 */


goog.provide('ydn.crm.inj.sugar.module.PanelRenderer');
goog.require('goog.ui.ControlRenderer');
goog.require('ydn.crm.inj.sugar.module.Body');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.PanelRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.PanelRenderer, goog.ui.ControlRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.PanelRenderer.DEBUG = goog.DEBUG;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.module.PanelRenderer.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.sugar.module.PanelRenderer');


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS = 'record-panel';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_CONTENT = 'record-content';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_HEAD = 'record-header';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_A_TITLE = 'title';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_A_IMPORT = 'import';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_A_LINK = 'link';


/**
 * Instead of using component element as root, a child element 'root' is appended
 * so that this panel can be hide/show by using element or root. Parent container
 * use element to show/hide, this control use root to show/hide.
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_ROOT = 'record-root';


/** @return {string} */
ydn.crm.inj.sugar.module.PanelRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.PanelRenderer.prototype.createDom = function(x) {
  var el = goog.base(this, 'createDom', x);
  var header = /** {ydn.crm.inj.sugar.module.Panel} */ (x);
  var model = /** @type {ydn.crm.sugar.model.Module} */ (header.getModel());
  var module = model.getModuleName();
  var dom = header.getDomHelper();
  var root = dom.createDom('div', ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_ROOT);
  el.appendChild(root);
  var heading = dom.createDom('div', ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_HEAD);
  var content = dom.createDom('div', ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_CONTENT);
  root.appendChild(heading);
  root.appendChild(content);
  header.setElementInternal(root);
  root.classList.add(module);
  var icon = dom.createDom('span', {
    'class': 'icon'
  }, module.substr(0, 2));
  var title = dom.createDom('a', {
    'href': '#',
    'class': ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_A_TITLE
  });
  var sync = dom.createDom('a', {
    'href': '#link',
    'class': ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_A_LINK
  }, 'link');
  var syncd_symbol = dom.createDom('span', 'synced');
  goog.style.setElementShown(sync, false);
  goog.style.setElementShown(syncd_symbol, false);
  var title_div = dom.createDom('div', 'header', [icon, title, sync, syncd_symbol]);
  var imp = dom.createDom('a', {
    'class': ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_A_IMPORT,
    'href': '#import'
  }, 'Add to ' + module);
  imp.style.zIndex = 1000;
  var imp_div = dom.createDom('div', {'class': 'import'}, imp);

  // goog.style.setElementShown(heading, false);
  heading.appendChild(imp_div);
  heading.appendChild(title_div);

  var body = new ydn.crm.inj.sugar.module.Body(model,
      null, dom);
  header.addChild(body, true);

  return el;
};


/**
 * @param {ydn.crm.inj.sugar.module.Panel} x
 */
ydn.crm.inj.sugar.module.PanelRenderer.prototype.updateImportLink = function(x) {
  var root = x.getHeadElement();
  /**
   * @type {ydn.crm.sugar.model.Module}
   */
  var model = x.getModel();
  var import_div = root.querySelector('.import');
  var div_title = import_div.nextElementSibling;
  var import_a = import_div.querySelector('a');
  var gdata = model.getGData();
  var module_name = model.getModuleName();
  import_a.textContent = (gdata ? 'Import' : 'Add') + ' to ' + module_name;
  if (gdata) {
    import_a.textContent = 'Import to ' + module_name;
    import_a.setAttribute('title', 'Import Gmail contact ' + gdata.getSingleId() +
        ' to SugarCRM ' + module_name);
  } else {
    import_a.textContent = 'Add to ' + module_name;
    import_a.setAttribute('title', 'Add current contact ' +
        ' to SugarCRM ' + module_name);
  }
};


/**
 * Refresh view due to change in model.
 * @param {Element} root
 * @param {ydn.crm.inj.sugar.module.Panel.Labels} labels
 */
ydn.crm.inj.sugar.module.PanelRenderer.prototype.refresh = function(root, labels) {

  var import_div = root.querySelector('.import');
  var header = root.querySelector('.header');
  var title = root.querySelector('.title');
  var div_title = import_div.nextElementSibling;
  var import_a = import_div.querySelector('a');
  var link_a = root.querySelector('a.link');
  var synced = div_title.querySelector('.synced');

  if (!!labels.title_link || !!labels.import_label) {
    goog.style.setElementShown(root, true);
  } else {
    goog.style.setElementShown(root, false);
  }

  goog.style.setElementShown(header, !!labels.title);
  title.textContent = labels.title;
  if (labels.title_link) {
    title.href = labels.title_link;
  } else {
    title.removeAttribute('href');
  }

  import_a.textContent = labels.import_label;
  import_a.setAttribute('title', labels.import_title);

  link_a.textContent = labels.link_label;
  if (labels.link_label) {
    link_a.setAttribute('title', labels.import_title);
    link_a.href = '#' + labels.link_label;
  } else {
    link_a.removeAttribute('href');
  }

  goog.style.setElementShown(synced, labels.is_synced);

};




