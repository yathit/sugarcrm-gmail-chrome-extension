/**
 * @fileoverview About this file
 */


goog.provide('ydn.crm.ui');
goog.provide('ydn.crm.ui.ContextPanelPosition');


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_EMPTY = 'empty';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_ERROR = 'error';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_TOOLBAR = 'toolbar';


/**
 * Convert JSON to Element.
 * @param {Object} json
 * @return {Element}
 */
ydn.crm.ui.json2element = function(json) {
  if (!json || ['DIV', 'SPAN', 'A', 'BUTTON'].indexOf(json.tagName) == -1) {
    window.console.log(json.tagName);
    return null;
  }
  var ele = document.createElement(json.tagName);
  var attrs = ['className', 'href', 'name', 'textContent', 'target'];
  for (var i = 0; i < attrs.length; i++) {
    if (json[attrs[i]]) {
      ele[attrs[i]] = json[attrs[i]];
    }
  }
  var n = json['children'] ? json['children'].length : 0;
  for (var i = 0; i < n; i++) {
    var child = ydn.crm.ui.json2element(json.children[i]);
    if (child) {
      ele.appendChild(child);
    }
  }
  return ele;
};


/**
 * @enum {string} position of context panel in Gmail.
 */
ydn.crm.ui.ContextPanelPosition = {
  WIDGET: 'wg',
  INLINE: 'in',
  NONE: 'no',
  RIGHT_BAR: 'rb',
  STICKY: 'st'
};


/**
 * All positions.
 * @type {Array.<ydn.crm.ui.ContextPanelPosition>}
 */
ydn.crm.ui.ContextPanelPositions = [
  ydn.crm.ui.ContextPanelPosition.WIDGET,
  ydn.crm.ui.ContextPanelPosition.INLINE,
  ydn.crm.ui.ContextPanelPosition.NONE,
  ydn.crm.ui.ContextPanelPosition.RIGHT_BAR,
  ydn.crm.ui.ContextPanelPosition.STICKY];
