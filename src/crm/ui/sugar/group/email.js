/**
 * @fileoverview Panel for name group fields.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.Email');
goog.require('goog.ui.PopupMenu');
goog.require('templ.ydn.crm.app');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.EmailGroup');
goog.require('ydn.crm.ui.sugar.group.Group');



/**
 * Panel for name group fields.
 * @param {ydn.crm.sugar.model.EmailGroup} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.Group}
 */
ydn.crm.ui.sugar.group.Email = function(model, opt_dom) {
  var renderer = ydn.crm.ui.sugar.group.GroupRenderer.getInstance();
  goog.base(this, model, renderer, opt_dom);
  /**
   * @type {goog.ui.PopupMenu}
   * @private
   */
  this.popup_menu_ = null;
};
goog.inherits(ydn.crm.ui.sugar.group.Email, ydn.crm.ui.sugar.group.Group);


/**
 * @return {ydn.crm.sugar.model.EmailGroup}
 * @override
 */
ydn.crm.ui.sugar.group.Email.prototype.getModel;




