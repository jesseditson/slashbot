/**
 * Grabs environment variables and parses them.
 *
 * Valid formats:
 * SOMETHING=something        # this will return a string.
 * SOMETHING=10               # this will return a float
 * SOMETHING=foo:bar,fizz:baz # this will return the object: {"foo" : "bar", "fizz" : "baz"}
 *
 * @param {string} name - the environment variable to get
 * @param {string} [key] - if the variable is an object, retrieve this key.
 */
var getEnv = function (name, key) {
  var value = process.env[name]
  var out = value
  // urls are special, we don't want to parse them like objects.
  if (/^(\w+)?:?\/\//.test(value)) {
    // url, skip other parsers.
    return out
  } else if (/[,:]/.test(value)) {
    // parse out comma separated key value strings
    var pairs = value.split(',')
    out = pairs
      .filter(function (i) {
        return !!i
      })
      .reduce(function (o, v) {
        var pair = v.split(':')
        o[pair[0]] = pair[1]
        return o
      }, {})
    if (key) {
      out = out ? out[key] : null
    }
  } else if (!isNaN(parseFloat(value))) {
    out = parseFloat(value)
  }
  return out
}

module.exports = getEnv
