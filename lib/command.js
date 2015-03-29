var getEnv = require('./get-env')
var debug = require('debug')('slashbot:command')
var helpers = require('./helpers')

var tokens = getEnv('SLASHBOT_TOKENS')

/**
 * Incoming slack command - this will have the body of:
 *
 * token=<token>
 * team_id=T0001
 * team_domain=example
 * channel_id=C2147483705
 * channel_name=test
 * user_id=U2147483697
 * user_name=Steve
 * command=/weather
 * text=94070
 *
 */

module.exports = function (name, command, req, res, next) {
  // first, validate that this request came from a chat we recognize.
  var payload = req.body
  debug('received payload %s', JSON.stringify(payload))
  var token = tokens[name]
  if (!token) debug('WARNING: command %s does not have a valid token loaded. No requests will be authenticated.', name)
  if (payload.token !== token) {
    return res.status(401).send("I'm sorry Dave, I can't let you do that.")
  }
  // Ok, we recognize this client. Assemble a context and foward the payload to the command.
  var context = helpers
  context.req = req
  context.res = res
  context.name = name
  var callback = function (err, response) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(response)
    }
  }
  // decorate the payload with some parsed stuff
  payload.channel = payload.channel_name === 'directmessage' ? '@' + payload.user_name : '#' + payload.channel_name
  command.call(context, payload, callback)
}
