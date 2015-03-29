var Slack = require('slack-client')
var getEnv = require('./get-env')
var debug = require('debug')('slashbot:listener')
var async = require('async')
var helpers = require('./helpers')

var token = getEnv('SLASHBOT_TOKENS','slashbot')
var autoReconnect = true
var autoMark = true

if (!token) throw new Error("Couldn't find a 'slashbot' token in the SLASHBOT_TOKENS environment variable. This variable is required for slashbot listeners to function.")

var slack = new Slack(token,autoReconnect,autoMark)

var listeners = []

/**
 * Add a listener. Just pushes a listener function to the listeners array.
 */
var addListener = function(name,listener) {
  listener.name = name
  listeners.push(listener)
}

/**
 * Print a message when slack connection is opened.
 */
slack.on('open',function(){
  var unreads = slack.getUnreadCount()
  var channels = slack.channels.filter(function(c) {
    return c.is_member
  }).map(function(c) {
    return c.name
  })
  var groups = slack.groups.filter(function(g) {
    return g.is_open && !g.is_archived
  })
  debug('successfully logged in to slack as %s on team %s.',slack.self.name,slack.team.name)
  debug('joined channels %s and groups %s',channels.join(','),groups.join(','))
})


/**
 * When we receive a message, forward it to all our listeners.
 */
slack.on('message',function(message) {
  var channel = slack.getChannelGroupOrDMByID(message.channel)
  var user = slack.getUserByID(message.user)

  var i=0,len=listeners.length
  var context = helpers
  context.slack = slack
  context.channel = channel
  context.user = user
  context.name = slack.self.name
  for(i;i<len;i++) {
    var listener = listeners[i]
    // skip listeners that have a match property and didn't match the message
    if (listener.match && !listener.match.test(message)) {
      continue;
    }
    var c = listener.call(context,message,function(err,message) {
      if (err) return debug('listener %s returned an error: %s',listener.name, err.message)
      channel.send(message)
    })
    // if listeners return false, we don't allow other listeners to respond.
    if (c === false) {
      break;
    }
  }
})


/**
 * Report errors.
 */
slack.on('error',function(err) {
  debug('Failed to connect to slack with error: %s',err.message)
})


/**
 * Now log in to slack.
 */
slack.login()


/**
 * Export addListener.
 */
module.exports = addListener
