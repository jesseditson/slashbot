var express = require('express')
var logger = require('morgan')
var bodyParser = require('body-parser')
var routes = require('./routes')
var responders = require('./responders')
var getEnv = require('./get-env')
var pkg = require('../package.json')
var setConfig = require('./helpers/config').set
var debug = require('debug')('slashbot:server')

// validate our environment - we have to define some variables for this to work at all.
var tokens = getEnv('SLASHBOT_TOKENS')
if (!tokens) throw new Error("Couldn't find a SLASHBOT_TOKENS environment variable. This variable is required for slashbot to function.")

var app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', routes)

// auto-load responders
responders.load(routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.send(JSON.stringify({
      message: err.message,
      error: err,
      stack: err.stack
    }))
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(JSON.stringify({
    error: err.message
  }))
})

/**
 * Start the slashbot server.
 */
var startServer = function (config, callback) {
  if (!callback) {
    callback = config
    config = {}
  }
  if (!config.name) config.name = pkg.name
  if (!config.port) config.port = process.env.PORT || 3000
  setConfig('name',config.name)
  setConfig('icon',config.icon)

  // load responders passed to us
  if (config.responders) {
    config.responders.forEach(function(path){
      responders.add(path,routes)
    })
  }

  return app.listen(config.port, function (err) {
    var msg = 'slashbot server listening on port ' + config.port
    if (config.name) msg += ' as ' + config.name
    if (config.icon) msg += ' with default icon ' + config.icon
    debug(msg)
    callback(err, app)
  })
}

module.exports = startServer
