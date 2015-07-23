var npm = require('npm')
var pkg = require('../package.json')
var path = require('path')
var command = require('./command')
var listener = require('./listener')
var debug = require('debug')('slashbot:add-responder')
var getEnv = require('./get-env')

/**
 * Add a responder to slashbot. Provide the path to the script or the package name,
 * and this function will automatically load the responder.
 */
var addResponder = function (file,router) {
  var name = path.basename(file)
  debug('loading %s responder', name)
  // make packages relative to the process.
  if(!/^(\.|\/)/.test(file)) file = './node_modules/' + file
  var responder = require(path.join(process.cwd(),file))
  if (responder.command) {
    // This is a command responder, load it as one.
    if (!getEnv('SLASHBOT_TOKENS',name)) debug('WARNING: command %s does not have a valid token set. No requests will be authenticated.', name)
    var route = '/'+responder.command
    debug('loaded command %s on path %s.',name,route)
    router.post(route, command.bind(null, name, responder))
  } else if (listener) {
    // no path, so treat this as a listener responder.
    listener(name, responder)
  }
}

/**
 * Auto-load any dependencies that start with slashbot-*
 */
// TODO: npm leaks a global, so we can't run mocha tests with --check-leaks on. Maybe fix or use something more lightweight.
var loadResponders = function(router){
  npm.load(function (err, npm) {
    if (err) throw err
    npm.commands.ls([], true, function (err, data, lite) {
      if (err) throw err
      var responderList = []
      Object.keys(lite.dependencies).forEach(function (name) {
        // catch errors in external dependencies and log them instead of throwing.
        try {
          if (/^slashbot-/.test(name)) {
            addResponder(name,router)
            responderList.push(name)
          }
        } catch(e) {
          debug('Failed trying to load %s. Error: %s', name, e.message)
        }
      })
      var l = responderList.length;
      if (l > 0) debug('auto-loaded %s responder%s.',l,l === 1 ? '' : 's')
    })
  })
}

module.exports = {
  add : addResponder,
  load : loadResponders
}
