sugarcrm-gmail-chrome-extension
===============================

Chrome Extension for SugarCRM from Gmail inbox.

Check out: [Yathit CRM Bridge (Beta)](https://chrome.google.com/webstore/detail/yathit-crm-bridge-beta/iccdnijlhdogaccaiafdpjmbakdcdakk)

Yathit CRM API provides:

1. Authentication and authorization of sugarcrm and Google services.
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

Dependency repo:

1. Closure library http://closure-library.googlecode.com/svn/trunk/
2. Base utility library https://bitbucket.org/ytkyaw/ydn-base.git
3. Database library git@bitbucket.org:ytkyaw/ydn-db.git
4. Authentication and authorization https://bitbucket.org/ytkyaw/ydn-auth
5. Full text search https://github.com/yathit/ydn-db-fulltext.git
6. Dependency for ydn-db-fulltext https://github.com/yathit/fullproof
7. Dependency for ydn-db-fulltext https://github.com/yathit/natural
8. Synchronization https://bitbucket.org/ytkyaw/ydn-db-sync (private)
9. SugarCRM https://bitbucket.org/ytkyaw/crm-ex (private)


