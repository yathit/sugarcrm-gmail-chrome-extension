
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
    fn += this.module.value('first_name') || '';
    var last_name = this.module.value('last_name');
    if (last_name) {
      fn += ' ' + last_name;
    }
  } else {
    fn += full_name;
  }
  return fn;
};


/**
 * Check given word is salutation.
 * @param {string} word
 * @return {boolean}
 */
ydn.crm.sugar.model.NameGroup.prototype.isSalutation = function(word) {
  if (!word) {
    return false;
  }
  if (word.charAt(word.length - 1) != '.') {
    word = word + '.';
  }
  var info = this.module.getFieldInfo('salutation');
  var salutations = info.options ? Object.keys(info.options) : ['Mrs.', 'Mr.'];
  return salutations.indexOf(word) >= 0;
};


/**
 * Parse full name into first name and last name.
 * @param {string} full_name
 * @return {Object}
 */
ydn.crm.sugar.model.NameGroup.prototype.parseFullNameLabel = function(full_name) {
  full_name = full_name.trim();
  if (!this.hasField('last_name')) {
    return {
      'full_name': !full_name ? undefined : full_name
    };
  }
  var obj = {
    'salutation': undefined,
    'full_name': undefined,
    'first_name': undefined,
    'last_name': undefined
  };
  if (!full_name) {
    return obj;
  }
  var names = full_name.split(/\s+/);
  if (!this.hasField('last_name')) {
    return {
      'name': full_name
    };
  }
  var salutation = this.module.value('salutation');
  var first_name = this.module.value('first_name');
  var last_name = this.module.value('last_name');

  if (names[0] == salutation) {
    obj['salutation'] = names.shift();
    full_name = full_name.substr(salutation.length + 1).trim();
  }
  if (this.hasField('salutation')) {
    if ((!!first_name && names[1] == first_name) ||
        (names.length >= 2 && this.isSalutation(names[0]))) {
      obj['salutation'] = names.shift();
      full_name = full_name.substr(obj['salutation'].length + 1).trim();
    }
  }
  var sep = full_name.indexOf(last_name);
  if (!!last_name && sep >= 0) {
    obj['first_name'] = full_name.substr(0, sep - 1).trim();
    obj['last_name'] = full_name.substr(sep).trim();
  } else {
    var idx = full_name.indexOf(first_name);
    if (!!first_name && idx >= 0) {
      obj['first_name'] = first_name;
      obj['last_name'] = full_name.substr(idx + first_name.length + 1, full_name.length).trim();
    } else {
      obj['first_name'] = names.shift();
      obj['last_name'] = names.join(' ');
    }
  }

  if (obj['first_name']) {
    obj['full_name'] = obj['first_name'];
  }
  if (obj['last_name']) {
    if (obj['full_name']) {
      obj['full_name'] += ' ' + obj['last_name'];
    } else {
      obj['full_name'] = obj['last_name'];
    }
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
  if (this.hasField('full_name')) {
    return this.getFullNameLabel();
  } else {
    return this.module.value('name') || '';
  }
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
