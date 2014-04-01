/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This panel two components: Header and Body. Header handle GData and Body
 * is Record.
 */


goog.provide('ydn.crm.ui.GDataPanel');
goog.require('goog.ui.Component');
goog.require('ydn.crm.inj.sugar.module.GDataPanelRenderer');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.GData');
goog.require('ydn.crm.ui.sugar.record.Record');
goog.require('ydn.ui.Reportable');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.GData} model model
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.GDataPanel = function(model, dom) {
  goog.base(this, dom);
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
goog.inherits(ydn.crm.ui.GDataPanel, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.GDataPanel.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.ui.GDataPanel.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.ui.GDataPanel');


/**
 * @return {!ydn.crm.sugar.model.GData}
 * @override
 */
ydn.crm.ui.GDataPanel.prototype.getModel;


/**
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.ui.GDataPanel.prototype.getModuleName = function() {
  return this.getModel().getModuleName();
};


/**
 * @override
 */
ydn.crm.ui.GDataPanel.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_CONTENT,
      this.getElement());
};


/**
 * Get root element of header UI.
 * @return {Element}
 */
ydn.crm.ui.GDataPanel.prototype.getHeadElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_HEAD,
      this.getElement());
};


/**
 * @inheritDoc
 */
ydn.crm.ui.GDataPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var el = this.getElement();

  var model = /** @type {ydn.crm.sugar.model.GData} */ (this.getModel());
  var module = model.getModuleName();
  var dom = this.getDomHelper();
  var root = dom.createDom('div', ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_ROOT);
  el.appendChild(root);
  var heading = dom.createDom('div', ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_HEAD);
  var content = dom.createDom('div', ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_CONTENT);
  root.appendChild(heading);
  root.appendChild(content);
  root.classList.add(module);
  var icon = dom.createDom('span', {
    'class': 'icon'
  }, module.substr(0, 2));

  var imp = dom.createDom('a', {
    'class': ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_A_IMPORT,
    'href': '#import'
  }, 'Add to ' + module);
  imp.style.zIndex = 1000;
  var imp_div = dom.createDom('div', {'class': 'import'}, imp);

  // goog.style.setElementShown(heading, false);
  heading.appendChild(imp_div);


  var body = new ydn.crm.ui.sugar.record.Record(model, dom);
  this.addChild(body, true);

};


/**
 * @inheritDoc
 */
ydn.crm.ui.GDataPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();
  var hd = this.getHandler();
  var model = this.getModel();
  this.import_link.attachElement(goog.dom.getElementsByTagNameAndClass('A',
      ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_A_IMPORT, root)[0]);
  hd.listen(this.import_link, 'click', this.handleImportClick, false);
  // imp.onclick = this.handleImportClick.bind(this);
  hd.listen(this.sync_link, 'click', this.handleLinkClick, false);
  hd.listen(model, [ydn.crm.sugar.model.events.Type.GDATA_CHANGE],
      this.handleGDataOrRecordChanged);
  hd.listen(model, ydn.crm.sugar.model.events.Type.RECORD_CHANGE, this.handleGDataOrRecordChanged);
};


/**
 * Refresh view due to change in model.
 * @param {ydn.crm.sugar.model.events.Event} e
 * @protected
 */
ydn.crm.ui.GDataPanel.prototype.handleGDataOrRecordChanged = function(e) {
  var model = this.getModel();
  if (ydn.crm.ui.GDataPanel.DEBUG) {
    window.console.log('module ' + this.getModuleName() + ' refresh for ' +
        e.type + ' ' + model, model);
  }
  var head = this.getHeadElement();
  if (model.hasRecord()) {
    goog.style.setElementShown(head, false);
  } else {
    goog.style.setElementShown(head, true);
    var labels = this.getLabels();
    var import_div = head.querySelector('.' + ydn.crm.inj.sugar.module.GDataPanelRenderer.CSS_CLASS_A_IMPORT);
    var import_a = import_div.querySelector('a');

    if (!!labels.import_label) {
      goog.style.setElementShown(head, true);
    } else {
      goog.style.setElementShown(head, false);
    }

    import_a.textContent = labels.import_label;
    import_a.setAttribute('title', labels.import_title);

  }

};


/**
 * @typedef {{
 *    import_label: string,
 *    import_title: string,
 *    is_synced: boolean,
 *    link_label: string,
 *    link_title: string
 * }}
 */
ydn.crm.ui.GDataPanel.Labels;


/**
 * Return list of UI labels.
 * @return {ydn.crm.ui.GDataPanel.Labels}
 */
ydn.crm.ui.GDataPanel.prototype.getLabels = function() {
  /**
   * @type {ydn.crm.sugar.model.GData}
   */
  var model = this.getModel();
  /**
   * @type {ydn.gdata.m8.ContactEntry}
   */
  var contact = model.getGData();
  /**
   * @type {ydn.crm.sugar.Record}
   */
  var record = model.getRecord();
  var module_name = model.getModuleName();
  if (ydn.crm.ui.GDataPanel.DEBUG) {
    window.console.log([module_name, model, contact, record]);
  }
  var is_synced = false; // gdata and record are in sync.
  var link_label = '';
  var link_title = '';

  var import_label = 'Add to ' + module_name;
  var import_title = 'Add current contact ' + model.getEmail() +
      ' to SugarCRM ' + module_name;
  if (model.hasRecord()) {
    import_label = '';
    import_title = '';
    link_label = 'export';
    link_title = 'Export this SugarCRM ' + module_name +
        ' to Gmail My Contacts address book';
    if (contact) {
      if (model.isSynced()) {
        is_synced = true;
        link_label = '';
        link_title = '';
      } else {
        link_label = 'link';
        link_title = 'Link Gmail contact ' + contact.getSingleId() +
            ' with this SugarCRM ' + module_name + ' ' + record.getId();
      }
    }
  } else if (model.hasValidGData()) {
    import_label = 'Import to ' + module_name;
    import_title = 'Import existing gmail contact ' + model.getEmail() +
        ' to SugarCRM ' + module_name;
  }

  return {
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
ydn.crm.ui.GDataPanel.prototype.handleLinkClick = function(e) {

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
ydn.crm.ui.GDataPanel.prototype.handleImportClick = function(e) {
  var model = this.getModel();
  var module_name = model.getModuleName();
  this.import_link.setLink('Adding... to ' + module_name);

  /**
   * @type {ydn.gdata.m8.ContactEntry}
   */
  var gdata = model.getGData();
  var import_req;
  if (gdata instanceof ydn.gdata.m8.NewContactEntry) {
    import_req = model.importToSugar().addCallback(function(x) {
      this.import_link.setLink('Linking GData and SugarCRM...');
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


