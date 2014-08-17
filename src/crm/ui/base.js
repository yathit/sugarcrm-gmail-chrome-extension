/**
 * @fileoverview About this file
 */


goog.provide('ydn.crm.ui');
goog.provide('ydn.crm.ui.ContextPanelPosition');
goog.require('goog.soy.Renderer');
goog.require('ydn.crm.base');


/**
 * @const
 * @type {string} root class name for all UI.
 */
ydn.crm.ui.CSS_CLASS = 'ydn-crm';


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


/**
 * @type {goog.soy.Renderer}
 * @private
 */
ydn.crm.ui.soy_renderer_ = null;


/**
 * @return {goog.soy.Renderer}
 */
ydn.crm.ui.getSoyRenderer = function() {
  if (!ydn.crm.ui.soy_renderer_) {
    ydn.crm.ui.soy_renderer_ = new goog.soy.Renderer();
  }
  return ydn.crm.ui.soy_renderer_;
};


/**
 * @type {Document}
 * @private
 */
ydn.crm.ui.svg_doc_ = null;


/**
 * Get svg
 * @return {Document}
 * @private
 */
ydn.crm.ui.getSvgDoc_ = function() {
  if (!ydn.crm.ui.svg_doc_) {
    var url = chrome.extension.getURL(ydn.crm.base.SVG_PAGE);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onload = function() {
      ydn.crm.ui.svg_doc_ = xhr.responseXML;
      xhr = null;
    };
    xhr.send();
  }
  return ydn.crm.ui.svg_doc_;
};


/**
 * Create SVG element for icon.
 * @param {string} name icon name in the svg sprite file.
 * @param {string=} opt_cls icon class, default to 'icons'.
 * @return {Element}
 */
ydn.crm.ui.createSvgIcon = function(name, opt_cls) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  var svg_doc = ydn.crm.ui.getSvgDoc_();
  var symbol = svg_doc.documentElement.getElementById(name);
  if (symbol) {
    svg.setAttribute('viewBox', symbol.getAttribute('viewBox'));
    svg.innerHTML = symbol.innerHTML;
  }
  svg.classList.add(opt_cls || 'icons');
  // NOTE: work around https://crbug.com/370136
  svg.style.pointerEvents = 'none';
  return svg;
};


/**
 * Create SVG element for icon.
 * Using svg by symbol is not supported in gmail content script.
 * @param {string} fileName either 'open-iconic' or 'paper-icons'
 * @param {string} name icon name in the svg sprite file.
 * @return {Element}
 */
ydn.crm.ui.createSvgIconBySymbol = function(fileName, name) {
  var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  var href = chrome.extension.getURL('/image/' + fileName + '.svg#' + name);
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href);
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add(fileName + '-icon');
  svg.classList.add('icons');
  // NOTE: work around https://crbug.com/370136
  svg.style.pointerEvents = 'none';
  svg.appendChild(use);
  return svg;
};
