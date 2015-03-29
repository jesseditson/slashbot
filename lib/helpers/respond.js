var request = require('superagent')
var getEnv = require('../get-env')
var debug = require('debug')('slashbot:respond')

var slack_webhook_url = getEnv('SLACK_WEBHOOK_URL')

/**
 * respond to a slack room with a message.
 * you can add links to the message by encosing them in <braces>, with a pipe for the text:
 * <http://example.com|click me!>
 *
 * @param {string} message - the message string.
 * @param {string} [channel] - the #channel or @dm thread to respond to
 * @param {string} [username] - the username to send as
 * @param {string} [iconURL] - an icon url or :emoji: to use for the URL
 * @param {function} [callback] - a callback to call when done.
 */
var respond = function (message, channel, username, iconURL, callback) {
  // callback is the last function
  var args = Array.prototype.slice.call(arguments).reverse()
  for (var i = 0;i < args.length;i++) {
    var fn = args[i]
    if (typeof fn === 'function') {
      callback = fn
      break
    }
  }

  if (!callback) {
    callback = function (err, res) {
      // default callback: just log.
      if (err) {
        debug('error posting message to slack: %s', err.message)
        debug(JSON.stringify(res))
      } else {
        debug('successfully posted message to slack. %s', JSON.stringify(res.body))
      }
    }
  }

  // assemble our payload
  var payload = {text: message}
  if (iconURL && /^:\w+:$/.test(iconURL)) {
    payload.icon_emoji = iconURL
  } else if (iconURL) {
    payload.icon_url = iconURL
  }

  if (channel) payload.channel = channel
  if (username) payload.username = username

  // fire off the request
  request
    .post(slack_webhook_url)
    .set('Content-Type', 'application/json')
    .send(payload)
    .end(callback)
}

module.exports = respond
