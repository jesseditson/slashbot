var express = require('express')
var logger = require('morgan')
var bodyParser = require('body-parser')
var routes = require('./routes')
var getEnv = require('./get-env')

// validate our environment - we have to define some variables for this to work at all.
var webhook_url = getEnv('SLASHBOT_WEBHOOK_URL')
if (!webhook_url) throw new Error("Couldn't find a SLASHBOT_WEBHOOK_URL environment variable. This variable is required for slashbot to function.")
var tokens = getEnv('SLASHBOT_TOKENS')
if (!tokens) throw new Error("Couldn't find a SLASHBOT_TOKENS environment variable. This variable is required for slashbot to function.")

var app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', routes)

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

module.exports = app
