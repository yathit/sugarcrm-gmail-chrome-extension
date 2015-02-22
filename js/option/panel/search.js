/**
 * @fileoverview Search panel.
 */



/**
 * Credentials section.
 * @constructor
 */
var SearchPanel = function() {
  /**
   * @type {HTMLElement}
   */
  this.root = document.getElementById('search');
  this.root.classList.add('sugar-panel');
  /**
   * @protected
   * @type {ydn.crm.ui.sugar.SearchPanel}
   */
  this.search = null;
};


/**
 * Setup sugar model.
 * @param {SugarCrmModel} model
 */
SearchPanel.prototype.setup = function(model) {
  var user = ydn.crm.ui.UserSetting.getInstance();
  user.getModuleInfo(model.getDomain())
      .addCallback(function(info) {
        var m = new ydn.crm.su.model.Sugar(model.getDetails(), info);
        this.root.innerHTML = ''; // here clean up previous panel.
        this.search = new ydn.crm.su.ui.SearchPanel(m);
        this.search.render(this.root);
      }, this);
};


/**
 * Change visibility.
 * @param {boolean} val
 */
SearchPanel.prototype.setVisible = function(val) {
  if (!val) {
    this.root.style.display = 'none';
    return;
  }
  this.root.style.display = '';
};

