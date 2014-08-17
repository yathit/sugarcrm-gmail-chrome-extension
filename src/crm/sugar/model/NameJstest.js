

NameJsTest = TestCase("NameJsTest");



NameJsTest.prototype.setUp = function() {

};


/**
 * @param {Object} original
 * @returns {ydn.crm.sugar.model.NameGroup}
 */
NameJsTest.prototype.mockNameGroup = function(original) {
  var record = {
    value: function(name) {
      return original[name];
    }
  };
  var ng = new ydn.crm.sugar.model.NameGroup(record, 'name');
  ng.hasField = function(name) {
    return original.hasOwnProperty(name);
  };
  return ng;
};


NameJsTest.prototype.test_label_full_name = function() {
  var original = {
    'salutation': '',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Mg Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  assertEquals('Mg Kyaw Tun', ng.getFullNameLabel());

};
NameJsTest.prototype.test_label_no_full_name = function() {
  var original = {
    'first_name': 'Kyaw',
    'last_name': 'Tun'
  };
  var ng = this.mockNameGroup(original);
  assertEquals('Kyaw Tun', ng.getFullNameLabel());
};



NameJsTest.prototype.test_label_full_name_sal = function() {
  var original = {
    'salutation': 'Mr.',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  assertEquals('Mr. Kyaw Tun', ng.getFullNameLabel());
};


NameJsTest.prototype.test_parse_simple = function() {
  var original = {
    'salutation': '',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Kyaw Tun');
  assertUndefined('salutation', patch.salutation);
  assertEquals('first name', patch.first_name, original.first_name);
  assertEquals('first name', patch.last_name, original.last_name);
  assertEquals('first name', patch.full_name, original.full_name);
};


NameJsTest.prototype.test_parse_with_salutation = function() {
  var original = {
    'salutation': 'Mr.',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Mr. Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Mr. Kyaw Tun');
  assertEquals('salutation', original.salutation, patch.salutation);
  assertEquals('first name', original.first_name, patch.first_name);
  assertEquals('last name', original.last_name, patch.last_name);
  assertEquals('full name', original.full_name, patch.full_name);
};


NameJsTest.prototype.test_parse_remove_salutation = function() {
  var original = {
    'salutation': 'Mr.',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Kyaw Tun');
  assertUndefined('salutation', patch.salutation);
  assertEquals('first name', patch.first_name, original.first_name);
  assertEquals('last name', patch.last_name, original.last_name);
  assertEquals('full name', patch.full_name, original.full_name);
};

NameJsTest.prototype.test_parse_add_sal = function() {
  var original = {
    'salutation': '',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Ms. Kyaw Tun');
  assertEquals('salutation', 'Ms.', patch.salutation);
  assertEquals('first name', original.first_name, patch.first_name);
  assertEquals('last name', original.last_name, patch.last_name);
  assertEquals('full name', 'Ms. Kyaw Tun', patch.full_name);
};

NameJsTest.prototype.test_parse_edit_sal = function() {
  var original = {
    'salutation': 'Mr.',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Ms. Kyaw Tun');
  assertEquals('salutation', 'Ms.', patch.salutation);
  assertEquals('first name', original.first_name, patch.first_name);
  assertEquals('last name', original.last_name, patch.last_name);
  assertEquals('full name', 'Ms. Kyaw Tun', patch.full_name);
};


NameJsTest.prototype.test_parse_add_first = function() {
  var original = {
    'salutation': '',
    'last_name': 'Tun',
    'full_name': 'Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Kyaw Tun');
  assertUndefined('salutation', patch.salutation);
  assertEquals('first name', 'Kyaw', patch.first_name);
  assertEquals('last name', 'Tun', patch.last_name);
  assertEquals('full name', 'Kyaw Tun', patch.full_name);
};


NameJsTest.prototype.test_parse_edit_first = function() {
  var original = {
    'salutation': 'Mr.',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Mr. Cyaw Tun');
  assertEquals('salutation', original.salutation, patch.salutation);
  assertEquals('first name', 'Cyaw', patch.first_name);
  assertEquals('last name', original.last_name, patch.last_name);
  assertEquals('full name', 'Mr. Cyaw Tun', patch.full_name);
};


NameJsTest.prototype.test_parse_remove_first = function() {
  var original = {
    'salutation': '',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Tun');
  assertUndefined('salutation', patch.salutation);
  assertEquals('first name', '', patch.first_name);
  assertEquals('last name', 'Tun', patch.last_name);
  assertEquals('full name', 'Tun', patch.full_name);
};


NameJsTest.prototype.test_parse_add_last = function() {
  var original = {
    'salutation': '',
    'first_name': 'Kyaw',
    'last_name': '',
    'full_name': 'Kyaw'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Kyaw Tun');
  assertUndefined('salutation', patch.salutation);
  assertEquals('first name', 'Kyaw', patch.first_name);
  assertEquals('last name', 'Tun', patch.last_name);
  assertEquals('full name', 'Kyaw Tun', patch.full_name);
};

NameJsTest.prototype.test_parse_edit_last = function() {
  var original = {
    'salutation': 'Mr.',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Mr. Kyaw Htoon');
  assertEquals('salutation', original.salutation, patch.salutation);
  assertEquals('first name', 'Kyaw', patch.first_name);
  assertEquals('last name', 'Htoon', patch.last_name);
  assertEquals('full name', 'Mr. Kyaw Htoon', patch.full_name);
};


NameJsTest.prototype.test_parse_remove_last = function() {
  var original = {
    'salutation': '',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Kyaw');
  assertUndefined('salutation', patch.salutation);
  assertEquals('first name', 'Kyaw', patch.first_name);
  assertEquals('last name', '', patch.last_name);
  assertEquals('full name', 'Kyaw', patch.full_name);
};


NameJsTest.prototype.test_parse_extra_last = function() {
  var original = {
    'salutation': '',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Kyaw Tun San');
  assertUndefined('salutation', patch.salutation);
  assertEquals('first name', 'Kyaw', patch.first_name);
  assertEquals('last name', 'Tun San', patch.last_name);
  assertEquals('full name', 'Kyaw Tun San', patch.full_name);
};

NameJsTest.prototype.test_parse_extra_last_with_sal = function() {
  var original = {
    'salutation': 'Mr. ',
    'first_name': 'Kyaw',
    'last_name': 'Tun',
    'full_name': 'Mr. Kyaw Tun'
  };
  var ng = this.mockNameGroup(original);
  var patch = ng.parseFullNameLabel('Mr. Kyaw Tun San');
  assertEquals('salutation', 'Mr.', patch.salutation);
  assertEquals('first name', 'Kyaw', patch.first_name);
  assertEquals('last name', 'Tun San', patch.last_name);
  assertEquals('full name', 'Mr. Kyaw Tun San', patch.full_name);
};
