/**
 * @fileoverview About this file
 */


goog.provide('ydn.crm.sugar');


/**
 * @enum {string}
 */
ydn.crm.sugar.ModuleName = {
  ACCOUNTS: 'Accounts',
  CALLS: 'Calls',
  CAMPAIGNS: 'Campaigns',
  CONTACTS: 'Contacts',
  DOCUMENTS: 'Documents',
  MEETINGS: 'Meetings',
  EMAILS: 'Emails',
  EMAIL_TEXT: 'EmailText',
  EMAIL_TEMPLATES: 'EmailTemplates',
  EMPLOYEES: 'Employees',
  LEADS: 'Leads',
  NOTES: 'Notes',
  OPPORTUNITIES: 'Opportunities',
  TASKS: 'Tasks',
  TEAMS: 'Teams',
  TEAM_SETS: 'TeamSets',
  USERS: 'Users'
};


/**
 * List of modules used in this app.
 * @type {Array.<ydn.crm.sugar.ModuleName>}
 */
ydn.crm.sugar.Modules = [ydn.crm.sugar.ModuleName.ACCOUNTS,
  ydn.crm.sugar.ModuleName.CALLS,
  ydn.crm.sugar.ModuleName.CAMPAIGNS,
  ydn.crm.sugar.ModuleName.CONTACTS,
  ydn.crm.sugar.ModuleName.DOCUMENTS,
  ydn.crm.sugar.ModuleName.MEETINGS,
  ydn.crm.sugar.ModuleName.EMAILS,
  // Note: EMAIL_TEXT is not a separate module but part of EMAILS module
  ydn.crm.sugar.ModuleName.EMAIL_TEMPLATES,
  ydn.crm.sugar.ModuleName.EMPLOYEES,
  ydn.crm.sugar.ModuleName.LEADS,
  ydn.crm.sugar.ModuleName.NOTES,
  ydn.crm.sugar.ModuleName.OPPORTUNITIES,
  ydn.crm.sugar.ModuleName.TASKS,
  ydn.crm.sugar.ModuleName.TEAMS,
  ydn.crm.sugar.ModuleName.TEAM_SETS,
  ydn.crm.sugar.ModuleName.USERS];


/**
 * @param {string} name
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.sugar.assertModuleName = function(name) {
  goog.asserts.assert(ydn.crm.sugar.Modules.indexOf(name) >= 0, name);
  return /** @type {ydn.crm.sugar.ModuleName} */ (name);
};


/**
 * List of modules that sync. Synchronization will queue in this order.
 * @type {Array.<ydn.crm.sugar.ModuleName>}
 */
ydn.crm.sugar.CacheModules = [ydn.crm.sugar.ModuleName.ACCOUNTS,
  ydn.crm.sugar.ModuleName.CONTACTS,
  ydn.crm.sugar.ModuleName.EMAIL_TEMPLATES,
  ydn.crm.sugar.ModuleName.LEADS,
  ydn.crm.sugar.ModuleName.NOTES,
  ydn.crm.sugar.ModuleName.TASKS,
  ydn.crm.sugar.ModuleName.MEETINGS,
  ydn.crm.sugar.ModuleName.CALLS,
  ydn.crm.sugar.ModuleName.OPPORTUNITIES,
  ydn.crm.sugar.ModuleName.EMAILS
];


/**
 * Primary modules are those direct relationship with contact entry.
 * @const
 * @type {Array.<ydn.crm.sugar.ModuleName>}
 */
ydn.crm.sugar.PRIMARY_MODULES = [ydn.crm.sugar.ModuleName.ACCOUNTS,
  ydn.crm.sugar.ModuleName.CONTACTS,
  ydn.crm.sugar.ModuleName.LEADS];


/**
 * Secondary modules are those having relationship with primary modules.
 * @const
 * @type {Array.<ydn.crm.sugar.ModuleName>}
 */
ydn.crm.sugar.SECONDARY_MODULES = [ydn.crm.sugar.ModuleName.NOTES,
  ydn.crm.sugar.ModuleName.TASKS];


/**
 * Modules represent to people.
 * @const
 * @type {Array.<ydn.crm.sugar.ModuleName>}
 */
ydn.crm.sugar.PEOPLE_MODULES = [ydn.crm.sugar.ModuleName.ACCOUNTS,
  ydn.crm.sugar.ModuleName.CONTACTS,
  ydn.crm.sugar.ModuleName.LEADS];


/**
 * Modules showed in inbox sidebar.
 * @const
 * @type {Array.<ydn.crm.sugar.ModuleName>}
 */
ydn.crm.sugar.PANEL_MODULES = [ydn.crm.sugar.ModuleName.CONTACTS,
  ydn.crm.sugar.ModuleName.LEADS];


/**
 * Modules represent simple module.
 * @const
 * @type {Array.<ydn.crm.sugar.ModuleName>}
 */
ydn.crm.sugar.SIMPLE_MODULES = [ydn.crm.sugar.ModuleName.NOTES];


/**
 * Modules supporting edit function.
 * @const
 * @type {Array.<ydn.crm.sugar.ModuleName>}
 */
ydn.crm.sugar.EDITABLE_MODULES = ydn.crm.sugar.CacheModules;


/**
 * Modules in activity stream.
 * SugarCE-Full-6.5.16/service/v3/SugarWebServiceUtilv3.php/get_upcoming_activities
 * @const
 * @type {Array.<ydn.crm.sugar.ModuleName>}
 */
ydn.crm.sugar.ACTIVITY_MODULES = [ydn.crm.sugar.ModuleName.MEETINGS,
  ydn.crm.sugar.ModuleName.CALLS,
  ydn.crm.sugar.ModuleName.TASKS,
  ydn.crm.sugar.ModuleName.OPPORTUNITIES
];


/**
 * @param {string} name
 * @return {ydn.crm.sugar.ModuleName}
 */
ydn.crm.sugar.toModuleName = function(name) {
  var idx = ydn.crm.sugar.Modules.indexOf(name);
  goog.asserts.assert(idx >= 0, 'Invalid module name ' + name);
  return ydn.crm.sugar.Modules[idx];
};


/**
 * Check support valid module name.
 * @param {string} name
 * @return {boolean}
 */
ydn.crm.sugar.isValidModule = function(name) {
  return ydn.crm.sugar.Modules.indexOf(name) >= 0;
};


/**
 * Convert SugarCRM boolean string to boolean.
 * @param {SugarCrm.Boolean} value
 * @return {boolean}
 */
ydn.crm.sugar.toBoolean = function(value) {
  if (value == '1') {
    return true;
  } else {
    return false;
  }
};


/**
 * Get url for contact entry of given id
 * @param {string} domain
 * @param {string} module
 * @param {string} id
 * @return {string}
 */
ydn.crm.sugar.getViewLink = function(domain, module, id) {
  return 'https://' + domain + '/index.php?module=' + module +
      '&action=DetailView&record=' + id;
};
