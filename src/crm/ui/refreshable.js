/**
 * @fileoverview A component that refresh.
 */


goog.provide('ydn.crm.ui.Refreshable');



/**
 * A component that refresh.
 * @interface
 */
ydn.crm.ui.Refreshable = function() {};


/**
 * Refresh component content.
 * @param {*=} opt_e may have optional event.
 */
ydn.crm.ui.Refreshable.prototype.refresh = function(opt_e) {};
