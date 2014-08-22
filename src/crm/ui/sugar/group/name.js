/**
 * @fileoverview Panel for name group fields.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.Name');
goog.require('templ.ydn.crm.app');
goog.require('ydn.crm.sugar');
goog.require('ydn.crm.sugar.model.NameGroup');
goog.require('ydn.crm.ui.sugar.group.NameRenderer');
goog.require('ydn.crm.ui.sugar.group.SimpleGroup');



/**
 * Panel for name group fields.
 * @param {ydn.crm.sugar.model.NameGroup} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.SimpleGroup}
 */
ydn.crm.ui.sugar.group.Name = function(model, opt_dom) {
  goog.base(this, model, null, opt_dom);
};
goog.inherits(ydn.crm.ui.sugar.group.Name, ydn.crm.ui.sugar.group.SimpleGroup);


/**
 * @return {ydn.crm.sugar.model.NameGroup}
 * @override
 */
ydn.crm.ui.sugar.group.Name.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Name.prototype.getTemplateData = function() {

  var model = this.getModel();
  var sal = ydn.crm.ui.sugar.field.FieldRenderer.getDataList(model.getModuleName(),
      model.getFieldInfo('salutation'));
  var data = [
    {
      name: 'salutation',
      label: 'Salutation',
      type: 'enum',
      value: model.getFieldAsValue('salutation'),
      listId: sal
    },
    {
      name: 'first_name',
      label: 'First name',
      type: 'text',
      value: model.getFieldAsValue('first_name')
    },
    {
      name: 'last_name',
      label: 'Last name',
      type: 'text',
      value: model.getFieldAsValue('last_name')
    }
  ];

  return {
    fields: data
  };
};



