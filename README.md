sugarcrm-gmail-chrome-extension
===============================

Chrome Extension for SugarCRM from Gmail inbox.

Try out: [Yathit CRM Bridge (Beta)](https://chrome.google.com/webstore/detail/yathit-crm-bridge-beta/iccdnijlhdogaccaiafdpjmbakdcdakk)

[Suggestion and feedback] (https://yathit.uservoice.com/)

#### Developer and marketer wanted

Since I, Kyaw Tun, does not have enough time for this endeavor, I am looking for developers and marketers to bootstrip this project. If interested, please drop me (kyawtun@yathit.com) describing how you would like to do.

Also let me know if you have problem with project setup.


Design Goal
-----------

API will be designed so that it is secure, easy to use, flexible and powerful enough to common use case in CRM applications in Gmail.

All UI code (and associate data model, configuration, build script) will be open source so that the app can be easily extensible.

Multiple backend service including GData, SugarCRM, AWS S3 and AWS DynamoDB will be supported.

Security consideration:

 1. No loading of insecure code (no eval, no inline script).
 2. Use sandbox iframe for third party.
 4. Use https for SugarCRM, even if user provide http.
 5. All resources (images) must be serialized, i.e., image file are loaded by XMLHttpRequest and render using canvas or datauri.
 6. Request only absolutely necessary host permission. Avoid host access to www.google.com, since the stakes are too high. All hosts permission is definitely not acceptable.
 7. Reduce permission request. Use optional permission. Remember we are just an app, not managing browser. Don't stalk other tabs.
 8. Use sandbox iframe. Use encryption.
 9. Don't delete or hide Gmail DOM element.


Plan
----

Stage 1 is implemented as Chrome Extension to Gmail bridging SugarCRM. The extension will allow SuagrCRM user easy to integrate Gmail, Google Contact, Task and Calendar and use SugarCRM inside Gmail. The extension UI is designed to be low profile in gmail interface.

In stage 2, this will be full feature web app.

In stage 3, Mobile client will be created through phonegap.


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

Backend server:

Google AppEngine (Java) backend server provides authentication and authorization. For SugarCRM, hash password is kept in the browser with encryption. Backend server also provide proxy with authorization header.

Please contact to info@yathit.com for deployment of your extension to use YDN backend server.

Dependency
----------

1. Closure library http://closure-library.googlecode.com/svn/trunk/
2. Base utility library https://bitbucket.org/ytkyaw/ydn-base.git
3. Database library git@bitbucket.org:ytkyaw/ydn-db.git
4. Authentication and authorization https://bitbucket.org/ytkyaw/ydn-auth
5. Full text search https://github.com/yathit/ydn-db-fulltext.git
6. Dependency for ydn-db-fulltext https://github.com/yathit/fullproof
7. Dependency for ydn-db-fulltext https://github.com/yathit/natural
8. Synchronization https://bitbucket.org/ytkyaw/ydn-db-sync (private)
9. Specialized utility library https://bitbucket.org/ytkyaw/ydn (private)
9. GData library https://bitbucket.org/ytkyaw/gdata (private)
10. SugarCRM Core https://bitbucket.org/ytkyaw/crm-ex (private)
11. SugarCRM UI https://bitbucket.org/ytkyaw/crm-ex/ui (content script UI, to be released under Apache v2)

Compiled dependency files are available in http://ydn-src-1.storage.googleapis.com/

Pricing
-------

Open source does not mean zero cost. Open source means that you can change source code to suite your use case and inspect them for security or privacy concern. I would expect pricing will be around $5/user/month. 

Licensing
---------

All UI components, base utilities and database api will be released under Apache v2 license. Backend and database synchronization will not be open source, but license to partners.


