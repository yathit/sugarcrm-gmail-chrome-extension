sugarcrm-gmail-chrome-extension
===============================

Chrome Extension for SugarCRM from Gmail inbox.

Try out: [Yathit CRMinInbox: SugarCRM for Gmail](https://chrome.google.com/webstore/detail/yathit-crm-bridge-beta/iccdnijlhdogaccaiafdpjmbakdcdakk)

[Home page and Documentation](http://crm.yathit.com)

[Suggestion and feedback](https://yathit.uservoice.com/)

#### SugarCRM integrator and sell partner wanted

If interested, please drop me (kyawtun@yathit.com) describing how you would like to do.


Design Goal
-----------

API will be designed so that it is secure, easy to use, flexible and powerful enough to common use case in CRM applications in Gmail.

All UI code (and associate data model, configuration, build script) will be open source so that the app can be easily extensible.

Multiple backend service including GData, SugarCRM, AWS S3 and AWS DynamoDB will be supported.

Security consideration:

 1. No loading of insecure code (no eval, no inline script).
 2. Use sandbox iframe for third party.
 4. All SSL connection. (Including SugarCRM that don't support https?)
 5. All resources (images) must be serialized, i.e., image file are loaded by XMLHttpRequest and render using canvas or datauri.
 6. Request only absolutely necessary host permission. Avoid host access to www.google.com, since the stakes are too high. All hosts permission is definitely not acceptable.
 7. Reduce permission request. Use optional permission. Remember we are just an app, not managing browser. Don't stalk other tabs.
 8. Use sandbox iframe. Use encryption.
 9. Don't delete or hide Gmail DOM element.


Features
--------

1. Authentication and authorization of sugarcrm, AWS and Google GData services.
2. CRUD operation of SugarCRM Module Record and GData Entry.
3. Synchronizing SugarCRM modules between SugarCRM instance and client side database.
4. Synchronizing GData entries (contact, task, calender, sites) between Google server and client side database.
5. Caching relationship table.
6. Conversion and synchronizing between GData Entry and SugarCRM module record.
7. Promise base centralized communication between extension pages.
8. Customizable full text search.

Backend server
--------------

Google AppEngine (Java) backend server provides authentication and authorization. For SugarCRM, hash password is kept in the browser with encryption. Backend server also provide proxy with authorization header.

Please contact to info@yathit.com to use YDN backend server for your extension. A new application id, `ydn.crm.base.APP_ID` will be created for your extension. A valid (paid) user login is required to use the service.

Dependency
----------

This repo is packaging for Chrome Extension and source codes are in the following repositories. Most of the main codes are in CRM Core and SugarCRM repo.

1. Closure library http://closure-library.googlecode.com/svn/trunk/
2. Base utility library https://github.com/yathit/ydn-base
3. Database library https://github.com/yathit/ydn-db
4. Authentication and authorization https://bitbucket.org/ytkyaw/ydn-auth
5. Full text search https://github.com/yathit/ydn-db-fulltext.git
6. Dependency for ydn-db-fulltext https://github.com/yathit/fullproof
7. Dependency for ydn-db-fulltext https://github.com/yathit/natural
8. CRM Core https://github.com/yathit/crm
9. CRM extra feature https://github.com/yathit/crm-front 
10. SugarCRM model and UI https://github.com/yathit/sugarcrm
11. CRM backend https://github.com/yathit/crm-back 


Development
-----------

You should be able to load this repo folder as [unpacked Chrome Extension](https://developer.chrome.com/extensions/getstarted#unpacked). You will need compiles dependency files, which are available in http://ydn-src-1.storage.googleapis.com/

Pricing
-------

Open source does not mean zero cost. Open source means that you can change source code to suite your use case and inspect them for security or privacy concern. I would expect pricing will be around $5~`0/user/month.

Licensing
---------

All UI components, data models and base utilities are released under GNU Lesser General Public License. Backend and database synchronization will not be open source, but license to partners.


