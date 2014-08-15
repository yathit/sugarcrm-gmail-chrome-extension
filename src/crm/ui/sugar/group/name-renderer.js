/**
 * @fileoverview Simple group component renderer.
 *
 */


goog.provide('ydn.crm.ui.sugar.group.NameRenderer');
goog.require('ydn.crm.ui.sugar.group.SimpleGroupRenderer');



/**
 * Simple group component renderer.
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.SimpleGroupRenderer}
 */
ydn.crm.ui.sugar.group.NameRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.ui.sugar.group.NameRenderer,
    ydn.crm.ui.sugar.group.SimpleGroupRenderer);
goog.addSingletonGetter(ydn.crm.ui.sugar.group.NameRenderer);


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.NameRenderer.prototype.decorate = function(ctrl) {
  goog.base(this, 'decorate', ctrl);
  /**
   * @type {ydn.crm.sugar.model.BaseGroup}
   */
  var model = ctrl.getModel();
  var href = model.module.getViewLink() || '';

  var root = ctrl.getContentElement().querySelector('.' +
      ydn.crm.ui.sugar.field.FieldRenderer.CSS_CLASS);
  var a = ctrl.getDomHelper().createDom('a', {
    'class': ydn.crm.ui.sugar.group.NameRenderer.CLS_NAME_LUNCH + ' icon-box',
    'title': 'Lunch in SugarCRM',
    'target': model.getDomain(),
    'href': href
  });
  var svg = ydn.crm.ui.createSvgIcon('launch', 'icons-small');
  svg.classList.add('fill');
  a.appendChild(svg);
  root.insertBefore(a, root.firstElementChild);
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.sugar.group.NameRenderer.CLS_NAME_LUNCH = 'lunch';


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.NameRenderer.prototype.refresh = function(ctrl) {
  goog.base(this, 'refresh', ctrl);
  /**
   * @type {ydn.crm.sugar.model.BaseGroup}
   */
  var model = ctrl.getModel();
  var href = model.module.getViewLink();
  var lunch = ctrl.getContentElement().querySelector('.' +
      ydn.crm.ui.sugar.group.NameRenderer.CLS_NAME_LUNCH);
  if (!href) {
    lunch.style.display = 'none';
  } else {
    lunch.href = href;
    lunch.style.display = '';
  }

};


