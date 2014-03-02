/**
 * @fileOverview Popup page.
 */



/**
 * Yathit CRM Popup Page.
 * @constructor
 */
var PopupPage = function() {
  var ul = document.querySelector('ul.host-permission');
  ul.addEventListener('click', this.handleHostPermissionRequest_.bind(this));
};


/**
 * Convert JSON to Element.
 * @param {Object} json
 * @return {Element}
 */
PopupPage.json2element = function(json) {
  if (!json || ['DIV', 'SPAN', 'A', 'BUTTON'].indexOf(json.tagName) == -1) {
    console.warn(json);
    return null;
  }
  var ele = document.createElement(json.tagName);
  var attrs = ['className', 'href', 'name', 'textContent', 'target'];
  for (var i = 0; i < attrs.length; i++) {
    if (json[attrs[i]]) {
      ele[attrs[i]] = json[attrs[i]];
    }
  }
  var n = json.children ? json.children.length : 0;
  for (var i = 0; i < n; i++) {
    var child = PopupPage.json2element(json.children[i]);
    if (child) {
      ele.appendChild(child);
    }
  }
  return ele;
};


/**
 * Set status message.
 * @param {Error|string} msg
 */
PopupPage.setStatus = function(msg) {
  var s = msg instanceof Error ? msg.name + ' ' + msg.message : msg;
  document.getElementById('status-bar-message').textContent = s;
};


/**
 * Render feed info.
 * @param {Array} feeds
 * @param {boolean=} opt_append
 */
PopupPage.prototype.renderFeed = function(feeds, opt_append) {
  if (!feeds) {
    return;
  }
  var fg = document.querySelector('ul.feeds');
  if (!opt_append) {
    fg.innerHTML = '';
  }
  for (var i = 0; i < feeds.length; i++) {
    var ele = PopupPage.json2element(feeds[i]);
    if (ele) {
      var li = document.createElement('li');
      li.appendChild(ele);
      fg.appendChild(li);
    }
  }

};


/**
 * @param {Event} e
 * @private
 */
PopupPage.prototype.handleHostPermissionRequest_ = function(e) {
  var a = e.target;
  if (a.tagName == 'A') {
    e.preventDefault();
    var domain = a.getAttribute('data-domain');
    var permissions = {
      origins: ['http://' + domain + '/*', 'https://' + domain + '/*']
    };
    chrome.permissions.request(permissions, function(grant) {
      if (grant) {
        a.style.display = 'none';
      }
    });
  }
};


/**
 * Initialize UI.
 */
PopupPage.prototype.init = function() {
  PopupPage.setStatus('checking login...');
  // here we can use extension.getURL, but need more robust on dev.
  var option_page = window.location.href.replace(/#.*/, '')
      .replace('popup.html', 'option-page.html');
  ydn.msg.getChannel().send('login-info').addCallbacks(function(info) {
    if (info.is_login) {
      PopupPage.setStatus(info.email + ' logged in.');
      // check host premission requirement
      SugarCrmModel.list(function(models) {
        for (var i = 0; i < models.length; i++) {
          models[i].hasHostPermission(function(grant) {
            if (!grant) {
              var ul = document.querySelector('ul.host-permission');
              var li = document.createElement('li');
              var a = document.createElement('a');
              a.textContent = 'Grant host permission';
              a.setAttribute('title', this.getDomain());
              a.href = '#';
              li.appendChild(a);
              a.setAttribute('data-domain', this.getDomain());
              ul.appendChild(li);
            }
          }, models[i]);
        }
        if (models.length == 0) {
          this.renderFeed([
            {
              tagName: 'A',
              textContent: 'Setup SugarCRM',
              target: 'option-page',
              href: option_page + '#credentials'
            }
          ], true);
        }
      }, this);
      // check gdata token
      ydn.msg.getChannel().send('gdata-token', option_page + '#credentials').addCallback(function(data) {
        var token = /** @type {YdnApiToken} */ (data);
        if (!token || !token.has_token) {
          this.renderFeed([
            {
              tagName: 'A',
              textContent: 'Setup Google account',
              target: 'option-page',
              href: option_page + '#credentials'
            }
          ], true);
        }
      }, this);
    } else {
      PopupPage.setStatus('Not logged in.');
      var arr = [
        {
          tagName: 'A',
          textContent: 'Setup',
          target: 'option-page',
          href: option_page
        }
      ];
      this.renderFeed(arr, true);
    }
  }, function(e) {
    PopupPage.setStatus(e);
  }, this);
};


ydn.msg.initPipe('popup');
var app = new PopupPage();
app.init();



