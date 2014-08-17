
/**
 * @fileoverview Group model for 'name' group fields.
 *
 *
 */


goog.provide('ydn.crm.sugar.model.NameGroup');
goog.require('ydn.crm.sugar.model.BaseGroup');



/**
 * Group model for 'name' group fields. 'name' group exists if there exists one of
 * 'full_name', 'first_name', 'last_name' or 'name'.
 * @param {ydn.crm.sugar.model.Record} parent
 * @constructor
 * @extends {ydn.crm.sugar.model.BaseGroup}
 * @struct
 */
ydn.crm.sugar.model.NameGroup = function(parent) {
  goog.base(this, parent, 'name');
};
goog.inherits(ydn.crm.sugar.model.NameGroup, ydn.crm.sugar.model.BaseGroup);


/**
 * @return {string} full name with salutation.
 */
ydn.crm.sugar.model.NameGroup.prototype.getFullNameLabel = function() {
  var fn = '';
  var full_name = this.module.value('full_name');
  if (!full_name) {
    fn += this.module.value('first_name');
    var last_name = this.module.value('last_name');
    if (last_name) {
      fn += ' ' + last_name;
    }
  } else {
    fn += full_name;
  }
  var sal = this.module.value('salutation');
  if (sal) {
    fn = sal + ' ' + fn;
  }
  return fn;
};


/**
 * Parse full name into first name and last name.
 * @param {string} full_name
 * @return {{
 *   salutation: (string|undefined),
 *   full_name: string,
 *   first_name: (string|undefined),
 *   last_name: (string|undefined)
 * }}
 */
ydn.crm.sugar.model.NameGroup.prototype.parseFullNameLabel = function(full_name) {
  full_name = full_name.trim();
  if (!this.hasField('last_name') || !full_name) {
    return {
      full_name: full_name
    };
  }
  var names = full_name.split(/\s+/);
  if (!this.hasField('last_name')) {
    return {
      full_name: full_name,
      last_name: names.shift(),
      first_name: names.join(' ')
    };
  }
  var salutation = this.module.value('salutation');
  var first_name = this.module.value('first_name');
  var last_name = this.module.value('last_name');
  var obj = {};
  if (names[0] == salutation) {
    obj.salutation = names.shift();
    full_name = full_name.substr(salutation.length + 1).trim();
  }
  if (this.hasField('salutation') && names[1] == first_name) {
    obj.salutation = names.shift();
    full_name = full_name.substr(obj.salutation.length + 1).trim();
  }
  var sep = full_name.indexOf(last_name);
  if (!!last_name && sep >= 0) {
    obj.first_name = full_name.substr(0, sep - 1).trim();
    obj.last_name = full_name.substr(sep).trim();
  } else {
    var idx = full_name.indexOf(first_name);
    if (!!first_name && idx >= 0) {
      obj.first_name = first_name;
      obj.last_name = full_name.substr(idx + first_name.length + 1, full_name.length).trim();
    } else {
      obj.first_name = names.shift();
      obj.last_name = names.join(' ');
    }
  }
  obj.full_name = obj.salutation ? obj.salutation : '';
  if (obj.first_name) {
    if (obj.full_name) {
      obj.full_name += ' ';
    }
    obj.full_name += obj.first_name;
  }
  if (obj.last_name) {
    if (obj.full_name) {
      obj.full_name += ' ';
    }
    obj.full_name += obj.last_name;
  }
  return obj;
};


/**
 * Get full name.
 * @return {*}
 */
ydn.crm.sugar.model.NameGroup.prototype.getFullName = function() {
  var full_name = this.module.value('full_name');
  if (!full_name) {
    var first_name = this.module.value('first_name');
    var last_name = this.module.value('last_name');
    if (first_name && last_name) {
      full_name = first_name + ' ' + last_name;
    } else {
      full_name = first_name || last_name;
    }
  }
  return full_name;
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.NameGroup.prototype.getGroupLabel = function() {
  return 'Name';
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.NameGroup.prototype.hasGroupValue = function() {
  return this.hasField('name') || this.hasField('first_name');
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.NameGroup.prototype.getGroupValue = function() {
  return this.getFullNameLabel();
};


/**
 * @inheritDoc
 */
ydn.crm.sugar.model.NameGroup.prototype.getAdditionalOptions = function() {
  return {
    label: 'Edit',
    name: ydn.crm.sugar.model.Field.Command.EDIT,
    type: 'text'
  };
};
