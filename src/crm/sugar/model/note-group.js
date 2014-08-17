
/**
 * @fileoverview Group model for 'name' group fields.
 *
 *
 */


goog.provide('ydn.crm.sugar.model.NoteGroup');
goog.require('ydn.crm.sugar.model.Group');



/**
 * Group model for 'email' group fields.
 * @param {ydn.crm.sugar.model.Record} parent
 * @param {string} group_name group name, should be 'alt_address', 'primary_address'
 * or 'address'.
 * @constructor
 * @extends {ydn.crm.sugar.model.Group}
 * @struct
 */
ydn.crm.sugar.model.NoteGroup = function(parent, group_name) {
  goog.base(this, parent, group_name);
};
goog.inherits(ydn.crm.sugar.model.NoteGroup, ydn.crm.sugar.model.Group);
