/**
 * @fileoverview Record module panel for Accounts, Contacts, Leads, etc.
 *
 * This panel two components: Header and Body.
 */


goog.provide('ydn.crm.inj.sugar.module.Panel');
goog.require('goog.ui.Control');
goog.require('ydn.crm.inj.sugar.module.PanelRenderer');
goog.require('ydn.crm.sugar');



/**
 * Contact sidebar panel.
 * @param {goog.dom.DomHelper} dom
 * @param {ydn.crm.sugar.model.Module} model model
 * @constructor
 * @struct
 * @extends {goog.ui.Control}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.Panel = function(dom, model) {
  goog.base(this, null, null, dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.inj.sugar.module.Panel, goog.ui.Control);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.Panel.DEBUG = false;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.inj.sugar.module.Panel.prototype.logger =
    goog.debug.Logger.getLogger('ydn.crm.inj.sugar.module.Panel');


/**
 * @return {!ydn.crm.sugar.model.Module}
 * @override
 */
ydn.crm.inj.sugar.module.Panel.prototype.getModel;


/**
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.inj.sugar.module.Panel.prototype.getModuleName = function() {
  return this.getModel().getModuleName();
};


/**
 * @override
 */
ydn.crm.inj.sugar.module.Panel.prototype.getContentElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_CONTENT,
      this.getElement());
};


/**
 * Get root element of header UI.
 * @return {Element}
 */
ydn.crm.inj.sugar.module.Panel.prototype.getHeadElement = function() {
  return goog.dom.getElementByClass(ydn.crm.inj.sugar.module.PanelRenderer.CSS_CLASS_HEAD,
      this.getElement());
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.Panel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();
  var imp = root.querySelector('.import a');
  this.getHandler().listen(imp, 'click', this.handleImportClick, false);
  // imp.onclick = this.handleImportClick.bind(this);
  var sync = root.querySelector('a.link');
  this.getHandler().listen(sync, 'click', this.handleLinkClick, false);
  this.getHandler().listen(this.getModel(), [ydn.crm.sugar.model.events.Type.RECORD_CHANGE,
    ydn.crm.sugar.model.events.Type.NEW_GDATA], this.refresh);
};


/**
 * Refresh view due to change in model.
 * @param {ydn.crm.sugar.model.events.Event} e
 */
ydn.crm.inj.sugar.module.Panel.prototype.refresh = function(e) {
  var model = this.getModel();
  if (ydn.crm.inj.sugar.module.Panel.DEBUG) {
    window.console.log('module ' + this.getModuleName() + ' refresh for ' + e.type, model);
  }
  var root = this.getHeadElement();
  var r = /** {ydn.crm.inj.sugar.module.PanelRenderer} */ (this.getRenderer());
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
ydn.crm.inj.sugar.module.Panel.Labels;


/**
 * Return list of UI labels.
 * @return {ydn.crm.inj.sugar.module.Panel.Labels}
 */
ydn.crm.inj.sugar.module.Panel.prototype.getLabels = function() {
  var model = this.getModel();
  var gdata = model.getGData();
  var contact = model.getContactModel();
  var record = model.getRecord();
  var module_name = model.getModuleName();
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
              ' with this SugarCRM ' + module_name;
        }
      }
    } else if (gdata) {
      import_label = 'Import to ' + module_name;
      import_title = 'Import Gmail contact ' + gdata.getSingleId() +
          ' to SugarCRM ' + module_name;
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
ydn.crm.inj.sugar.module.Panel.prototype.handleLinkClick = function(e) {
  e.preventDefault();
  var root = this.getElement();
  var a = /** @type {Element} */ (e.target);
  var div_import = root.querySelector('.import');
  var div_title = div_import.nextElementSibling;
  var is_error = goog.dom.classes.has(a, 'error');
  var is_null = goog.dom.classes.has(a, 'null');
  if (is_null) {
    return;
  } else if (is_error) {
    a.textContent = 'Error recorded. Thanks.';
    a.removeAttribute('href');
    return;
  }
  goog.dom.classes.add(a, 'null');

  var model = this.getModel();
  a.textContent = 'Linking...';
  model.link().addCallbacks(function(x) {
    a.textContent = 'Done.';
    goog.dom.classes.add(a, 'null');
    goog.style.setElementShown(div_import, false);
    goog.style.setElementShown(div_title, true);
    this.dispatchEvent(new goog.events.Event(goog.ui.Component.EventType.CHANGE));
  }, function(e) {
    goog.dom.classes.remove(a, 'null');
    goog.dom.classes.add(a, 'error');
    var msg = e instanceof Error ? e.name + ' ' + e.message :
        goog.isObject(e) ? ydn.json.toShortString(e) : e;
    a.setAttribute('title', msg);
    var sidebar = goog.dom.getAncestorByClass(a, 'sidebar');
    ydn.msg.getChannel().send(ydn.crm.Ch.Req.LOG, {
      'class': 'RecordHeader',
      'method': 'handleLinkClick',
      'context': a.textContent,
      'html': sidebar ? sidebar.outerHTML : '',
      'error': msg
    });
    a.textContent = 'Error';
  }, this);

};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.inj.sugar.module.Panel.prototype.handleImportClick = function(e) {
  e.preventDefault();
  var a = /** @type {Element} */ (e.target);
  var rel = a.getAttribute('rel');
  if (rel == 'error-report') {
    a.textContent = 'Recorded. Thanks';
    a.setAttribute('rel', 'null');
    a.removeAttribute('title');
    a.removeAttribute('href');
    goog.dom.classes.remove(a, 'error');
    return;
  } else if (rel == 'null') {
    return;
  }
  var model = this.getModel();
  var module_name = model.getModuleName();
  a.textContent = 'adding... to ' + module_name;
  var link_req = model.importToSugar();
  var gdata = model.getGData();
  if (gdata) {
    link_req = link_req.addCallbacks(function(record) {
      a.textContent = 'Added. Linking...';
      return model.link();
    }, function(e) {
      a.setAttribute('rel', 'error-report');
      var msg = e instanceof Error ? e.name + ' ' + e.message :
          goog.isObject(e) ? ydn.json.toShortString(e) : e;
      a.setAttribute('title', 'Error importing: ' + msg);
      goog.dom.classes.add(a, 'error');
      var sidebar = goog.dom.getAncestorByClass(a, 'sidebar');
      ydn.msg.getChannel().send(ydn.crm.Ch.Req.LOG, {
        'class': 'RecordHeader',
        'method': 'handleImportClick',
        'context': a.textContent,
        'html': sidebar ? sidebar.outerHTML : '',
        'error': msg
      });
      a.textContent = 'error';
    }, this);
  } else {
    a.textContent = 'Importing...';
  }
  link_req.addCallbacks(function(entry) {
    goog.style.setElementShown(a.parentElement, false);
    var done = new goog.events.Event(goog.ui.Component.EventType.CHANGE, this);
    this.dispatchEvent(done);
  }, function(e) {
    a.setAttribute('rel', 'error-report');
    var msg = e instanceof Error ? e.name + ' ' + e.message :
        goog.isObject(e) ? ydn.json.toShortString(e) : e;
    a.setAttribute('title', 'Error linking: ' + msg);
    goog.dom.classes.add(a, 'error');
    var sidebar = goog.dom.getAncestorByClass(a, 'sidebar');
    ydn.msg.getChannel().send(ydn.crm.Ch.Req.LOG, {
      'class': 'RecordHeader',
      'method': 'handleImportClick',
      'context': a.textContent,
      'html': sidebar ? sidebar.outerHTML : '',
      'error': msg
    });
    a.textContent = 'error';
  }, this);
};


goog.ui.registry.setDefaultRenderer(ydn.crm.inj.sugar.module.Panel,
    ydn.crm.inj.sugar.module.PanelRenderer);
