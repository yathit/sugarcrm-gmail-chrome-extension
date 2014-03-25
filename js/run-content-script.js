/**
 * @fileoverview Send message to background thread to inject scripts base on user preferences.
 *
 * We cannot specify content script by file name, because files are different depending on
 * preferred version and additional features.
 *
 * At the same time, we cannot inject from the page, because that will not carried permission required
 * specific for extension script. So just send a message and let background page to inject correct files.
 *
 * We could have also use tabs event to inject, but that will require 'tabs' permission.
 */


chrome.runtime.sendMessage({
  'req': 'inject' // request background thread to inject scripts base on user preferences
});
