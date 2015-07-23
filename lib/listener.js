var Slack = require('slack-client')
var getEnv = require('./get-env')
var debug = require('debug')('slashbot:listener')
var helpers = require('./helpers')

var token = getEnv('SLASHBOT_TOKENS', 'slashbot')
var autoReconnect = true
var autoMark = true

if (!token) {
  debug("Couldn't find a 'slashbot' token in the SLASHBOT_TOKENS environment variable. This variable is required for slashbot listeners to function.")
  module.exports = null
  return
}

var slack = new Slack(token, autoReconnect, autoMark)

var listeners = []

/**
 * Add a listener. Just pushes a listener function to the listeners array.
 */
var addListener = function (name, listener) {
  listener.name = name
  listeners.push(listener)
}

/**
 * Print a message when slack connection is opened.
 */
slack.on('open', function () {
  var unreads = slack.getUnreadCount()
  var channels = []
  for (var c in slack.channels) {
    if (c.is_member) channels.push(c.name)
  }
  var groups = []
  for (var g in slack.groups) {
    if(g.is_open && !g.is_archived) groups.push(g.name)
  }
  debug('successfully logged in to slack as %s on team %s.', slack.self.name, slack.team.name)
  if (channels.length) {
    debug('joined channels: %s',channels.join(','))
  } else {
    debug('not in any channels.')
  }
  if (groups.length) {
    debug('joined groups: %s',groups.join(','))
  } else {
    debug('not in any groups.')
  }
  debug('there are %s unread messages.', unreads)
})

/**
 * When we receive a message, forward it to all our listeners.
 */
slack.on('message', function (msg) {
  var channel = slack.getChannelGroupOrDMByID(msg.channel)
  var user = slack.getUserByID(msg.user)
  var message = msg.text
  // don't parse messages without text.
  if(!message) return;
  // slack sends @tags as <@USERID>, so let's decode that.
  var m, idPattern = /<@(\w+)>/g
  while (m = idPattern.exec(message)) {
    if (m) {
      var u = slack.getUserByID(m[1])
      if (u) message = message.replace(m[0],'@'+u.name)
    }
  }

  var i = 0, len = listeners.length
  var context = helpers
  context.respond = context.respond.bind({name : slack.self.name})
  context.slack = slack
  context.channel = channel
  context.user = user
  context.name = slack.self.name
  for (i;i < len;i++) {
    var listener = listeners[i]
    // skip listeners that have a match property and didn't match the message
    if (listener.match && !listener.match.test(message)) {
      continue
    }
    var c = listener.call(context, message, function (err, message) {
      if (err) return debug('listener %s returned an error: %s', listener.name, err.message)
      channel.send(message)
    })
    // if listeners return false, we don't allow other listeners to respond.
    if (c === false) {
      break
    }
  }
})

/**
 * Report errors.
 */
slack.on('error', function (err) {
  debug('Failed to connect to slack with error: %s', err)
})

/**
 * Now log in to slack.
 */
slack.login()

/**
 * Export addListener.
 */
module.exports = addListener
