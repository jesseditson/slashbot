var express = require('express')
var router = express.Router()

/**
 * Root route. Prints the slashbot version in a json object.
 */
router.get('/', function (req, res) {
  res.json({ 'slashbot': {
      version: pkg.version
  }})
})

module.exports = router
