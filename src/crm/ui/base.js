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
ydn.crm.ui.CSS_CLASS_ACTIVE = 'active';


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
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_HEAD = 'head';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_TITLE = 'title';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_BADGE = 'badge';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_OK_BUTTON = 'ok-button';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_MORE_MENU = 'more-menu';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_FLEX_BAR = 'flex-bar';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_CONTENT = 'content';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_FOOTER = 'footer';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.CSS_CLASS_NORMALLY_HIDE = 'normally-hide';


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
 * @param {string=} opt_cls icon class, default to 'icons'. 'icons-small' use
 * 14px x 14px sized icon. If `null` no class will be added.
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
  if (arguments.length < 2) {
    svg.classList.add('icons');
  } else if (goog.isString(opt_cls)) {
    svg.classList.add(opt_cls);
  }
  // NOTE: work around https://crbug.com/370136
  // svg.style.pointerEvents = 'none';
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


/**
 * @type {Document}
 * @private
 */
ydn.crm.ui.template_doc_ = null;


/**
 * Load template synchronously.
 * @return {Document}
 * @private
 */
ydn.crm.ui.getTemplate_ = function() {
  if (!ydn.crm.ui.template_doc_) {
    var url = chrome.extension.getURL(ydn.crm.base.INJ_TEMPLATE);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onload = function() {
      var parser = new DOMParser();
      ydn.crm.ui.template_doc_ = parser.parseFromString(xhr.responseText, 'text/html');
      xhr = null;
    };
    xhr.send();
  }
  return ydn.crm.ui.template_doc_;
};


/**
 * @param {string} id
 * @return {Element}
 */
ydn.crm.ui.getTemplateElement = function(id) {
  var doc = ydn.crm.ui.getTemplate_();
  var el = doc.documentElement.querySelector('#' + id);
  if (!document.body.contains(el)) {
    el = document.importNode(el, true);
    document.body.appendChild(el);
  }
  return /** @type {Element} */ (el);
};

