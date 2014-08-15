/**
 * @fileoverview Panel for group of field in a module.
 *
 * This module provide adding, linking and syncing.
 */


goog.provide('ydn.crm.ui.sugar.group.Address');
goog.require('ydn.crm.ui.sugar.group.SimpleGroup');



/**
 * Contact sidebar panel.
 * @param {ydn.crm.sugar.model.AddressGroup} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.ui.sugar.group.SimpleGroup}
 */
ydn.crm.ui.sugar.group.Address = function(model, opt_dom) {
  goog.base(this, model, null, opt_dom);
};
goog.inherits(ydn.crm.ui.sugar.group.Address, ydn.crm.ui.sugar.group.SimpleGroup);


/**
 * @return {ydn.crm.sugar.model.AddressGroup}
 * @override
 */
ydn.crm.ui.sugar.group.Address.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.ui.sugar.group.Address.prototype.getTemplateData = function() {

  var model = this.getModel();
  var data = [];
  var module_info = model.getModuleInfo();

  var group_name = model.getGroupName();
  for (var name in module_info.module_fields) {
    var field = module_info.module_fields[name];
    if (field.group == group_name) {
      data.push({
        name: name,
        label: field.label,
        type: field.type,
        value: model.getFieldAsValue(name),
        listId: ydn.crm.ui.sugar.field.FieldRenderer.getDataList(model.getModuleName(),
            field)
      });
    }
  }

  return {
    fields: data
  };
};


