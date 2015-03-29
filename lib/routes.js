var npm = require('npm')
var express = require('express')
var router = express.Router()
var debug = require('debug')('slashbot')
var pkg = require('../package.json')
var command = require('./command')
var listener = require('./listener')

/**
 * Root route. Prints the slashbot version in a json object.
 */
router.get('/', function (req, res) {
  res.json({ 'slashbot': {
      version: pkg.version
  }})
})

/**
 * Add a responder to slashbot. Provide the path to the script or the package name,
 * and this function will automatically load the responder.
 */
var addResponder = function (name) {
  debug('loading %s responder', name)
  var responder = require(name)
  if (responder.path) {
    // This is a command responder, load it as one.
    router.get(responder.path, command.bind(null, name, responder))
  } else {
    // no path, so treat this as a listener responder.
    listener(name, responder)
  }
}

/**
 * Auto-load any dependencies that start with slashbot-*
 */
// TODO: npm leaks a global, so we can't run mocha tests with --check-leaks on. Maybe fix or use something more lightweight.
npm.load(function (err, npm) {
  if (err) throw err
  npm.commands.ls([], true, function (err, data, lite) {
    if (err) throw err
    var responderList = []
    Object.keys(lite.dependencies).forEach(function (name) {
      // catch errors in external dependencies and log them instead of throwing.
      try {
        if (/^slashbot-/.test(name)) {
          addResponder(name)
          responderList.push(name)
        }
      } catch(e) {
        throw e
        debug('Failed trying to load %s. Error: %s', name, e.message)
      }
    })
    debug('added %s responders.',responderList.length)
  })
})

/**
 * If you have custom responders you don't want to publish on npm,
 * this is where you could add them to your routes, by calling:
 *
 * addResponder('../responders/my-responder.js')
 */

module.exports = router
