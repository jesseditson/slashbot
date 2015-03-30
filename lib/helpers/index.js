var respond = require('./respond')
var request = require('superagent')
var config = require('./config')

/**
 * Helpers - this object is included as the `this` scope of all responders.
 * Use the exported methods to perform common tasks when handling responses.
 */

module.exports = {
  respond : respond,
  request : request,
  config : config
}
