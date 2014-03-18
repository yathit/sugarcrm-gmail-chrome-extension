/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This panel two components: Header and Body. Header handle GData and Body
 * is Record.
 */


goog.provide('ydn.crm.inj.sugar.module.GDataPanel');
goog.require('goog.ui.Control');
goog.require('ydn.crm.inj.sugar.module.GDataPanelRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.ui.Reportable');



/**
 * Contact sidebar panel.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.sugar.model.GDataRecord} model model
 * @constructor
 * @struct
 * @extends {goog.ui.Control}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.GDataPanel = function(dom, model) {
  goog.base(this, null, null, dom);
  this.setModel(model);
  /**
   * @final
   * @type {ydn.ui.Reportable}
   * @protected
   */
  this.import_link = new ydn.ui.Reportable();
  /**
   * @protected
   * @final
   * @type {ydn.ui.Reportable}
   */
  this.sync_link = new ydn.ui.Reportable();
};
goog.inherits(ydn.crm.inj.sugar.module.GDataPanel, goog.ui.Control);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.GDataPanel.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.module.GDataPanel.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.sugar.module.GDataPanel');


/**
 * @return {!ydn.crm.sugar.model.GDataRecord}
 * @override
 */
ydn.crm.inj.sugar.module.GDataPanel.prototype.getModel;


/**
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.inj.sugar.module.GDataPanel.prototype.getModuleName = function() {
  return this.getModel().getModuleName();
};


/**
 * @override
 */
ydn.crm.inj.sugar.module.GDataPanel.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_CONTENT,
      this.getElement());
};


/**
 * Get root element of header UI.
 * @return {Element}
 */
ydn.crm.inj.sugar.module.GDataPanel.prototype.getHeadElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_HEAD,
      this.getElement());
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.GDataPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();
  this.import_link.attachElement(goog.dom.getElementsByTagNameAndClass('A',
      ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_A_IMPORT, root)[0]);
  this.sync_link.attachElement(goog.dom.getElementsByTagNameAndClass('A',
      ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_A_LINK, root)[0]);
  this.getHandler().listen(this.import_link, 'click', this.handleImportClick, false);
  // imp.onclick = this.handleImportClick.bind(this);
  this.getHandler().listen(this.sync_link, 'click', this.handleLinkClick, false);
  var model = this.getModel();
  this.getHandler().listen(model, [ydn.crm.sugar.model.events.Type.RECORD_CHANGE], this.refresh);
  this.getHandler().listen(model.parent, [ydn.crm.sugar.model.events.Type.GDATA_CHANGE], this.refresh);
};


/**
 * Refresh view due to change in model.
 * @param {ydn.crm.sugar.model.events.Event} e
 */
ydn.crm.inj.sugar.module.GDataPanel.prototype.refresh = function(e) {
  var model = this.getModel();
  if (ydn.crm.inj.sugar.module.GDataPanel.DEBUG) {
    window.console.log('module ' + this.getModuleName() + ' refresh for ' + e.type, model);
  }
  var root = this.getHeadElement();
  var r = /** {ydn.crm.inj.sugar.module.GDataPanelRenderer} */ (this.getRenderer());
  r.refresh(root, this.getLabels());
  var content = this.getContentElement();
  goog.style.setElementShown(content, !!model.getRecord()); // should this be handled by body itself?
};


/**
 * @typedef {{
 *    title: string,
 *    title_link: string?,
 *    import_label: string,
 *    import_title: string,
 *    is_synced: boolean,
 *    link_label: string,
 *    link_title: string
 * }}
 */
ydn.crm.inj.sugar.module.GDataPanel.Labels;


/**
 * Return list of UI labels.
 * @return {ydn.crm.inj.sugar.module.GDataPanel.Labels}
 */
ydn.crm.inj.sugar.module.GDataPanel.prototype.getLabels = function() {
  var model = this.getModel();
  var gdata = model.getGData();
  var any_gdata = gdata ? null : model.getUnboundGData();
  var contact = model.getContactModel();
  var record = model.getRecord();
  var module_name = model.getModuleName();
  if (ydn.crm.inj.sugar.module.GDataPanel.DEBUG) {
    window.console.log([module_name, model, gdata, contact, record]);
  }
  var title = '';
  var title_link = null;
  var is_synced = false; // gdata and record are in sync.
  var import_label = '';
  var import_title = '';
  var link_label = '';
  var link_title = '';
  if (contact) {
    import_label = 'Add to ' + module_name;
    import_title = 'Add current contact ' + contact.getEmail() +
        ' to SugarCRM ' + module_name;
    if (record) {
      title = record.getFullName();
      title_link = record.getViewLink();
      import_label = '';
      import_title = '';
      link_label = 'export';
      link_title = 'Export this SugarCRM ' + module_name +
          ' to Gmail My Contacts address book';
      if (gdata) {
        if (model.isSynced()) {
          is_synced = true;
          link_label = '';
          link_title = '';
        } else {
          link_label = 'link';
          link_title = 'Link Gmail contact ' + gdata.getSingleId() +
              ' with this SugarCRM ' + module_name + ' ' + record.getId();
        }
      }
    } else if (any_gdata) {
      import_label += ' and sync';
      import_title += ' and then synchronize between the two records.';
      link_label = '';
      link_title = '';
    }
  }
  return {
    title: title,
    title_link: title_link,
    import_label: import_label,
    import_title: import_title,
    is_synced: is_synced,
    link_label: link_label,
    link_title: link_title
  };
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.inj.sugar.module.GDataPanel.prototype.handleLinkClick = function(e) {

  var model = this.getModel();
  this.sync_link.setLink('Linking...');
  model.link().addCallbacks(function(x) {
    this.sync_link.setLink('Done.');
    this.dispatchEvent(new goog.events.Event(ydn.crm.sugar.model.events.Type.RECORD_CHANGE));
  }, function(e) {
    var msg = e instanceof Error ? e.name + ' ' + e.message :
        goog.isObject(e) ? ydn.json.toShortString(e) : e;
    var sidebar = goog.dom.getAncestorByClass(this.getElement(), 'sidebar');
    var payload = {
      'class': 'RecordHeader',
      'method': 'handleLinkClick',
      'context': 'link',
      'html': sidebar ? sidebar.outerHTML : '',
      'error': msg
    };
    this.sync_link.setError(payload, msg);
  }, this);

};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.inj.sugar.module.GDataPanel.prototype.handleImportClick = function(e) {
  var model = this.getModel();
  var module_name = model.getModuleName();
  this.import_link.setLink('Adding... to ' + module_name);

  var gdata = model.getUnboundGData();
  var import_req;
  if (gdata) {
    import_req = model.importToSugar().addCallback(function(x) {
      this.import_link.setLink('Linking GData and SugarCRM...');
      return model.link();
    }, this);
  } else {
    import_req = model.addToSugar();
    import_req = import_req.addCallback(function(record) {
      return model.link();
    }, this);
  }

  import_req.addCallbacks(function(entry) {
    this.import_link.setLink(null);
    var done = new goog.events.Event(goog.ui.Component.EventType.CHANGE, this);
    this.dispatchEvent(done);
  }, function(e) {
    var msg = e instanceof Error ? e.name + ' ' + e.message :
        goog.isObject(e) ? ydn.json.toShortString(e) : e;
    var sidebar = goog.dom.getAncestorByClass(this.getElement(), 'sidebar');
    var load = {
      'class': 'RecordHeader',
      'method': 'handleImportClick',
      'context': 'link',
      'html': sidebar ? sidebar.outerHTML : '',
      'error': msg
    };
    this.import_link.setError(load, msg);
  }, this);
};


goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.GDataPanel,
    ydn.crm.inj.sugar.module.GDataPanelRenderer);
