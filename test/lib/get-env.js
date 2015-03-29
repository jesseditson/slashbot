/* global describe,before,after,it */
var assert = require('assert')
var getEnv = require('../../lib/get-env')

describe('get-env', function () {

  before(function () {
    // set up our test environment variables
    process.env['SLASH_TEST_STRING'] = 'stringvalue'
    process.env['SLASH_TEST_URL']    = 'http://test.com'
    process.env['SLASH_TEST_NUMBER'] = '100.1'
    process.env['SLASH_TEST_OBJECT'] = 'key:value,key2:value2'
  })

  it('should parse strings from environment variables', function () {
    var str = getEnv('SLASH_TEST_STRING')
    assert.equal(str,'stringvalue')
  })

  it('should parse a number from environment variables', function () {
    var num = getEnv('SLASH_TEST_NUMBER')
    assert.equal(num,100.1)
  })

  it('should properly parse URLs', function() {
    var str = getEnv('SLASH_TEST_URL')
    assert.equal(str,'http://test.com')
  })

  describe('objects', function () {

    it('should parse an object from environment variables', function () {
      var o = getEnv('SLASH_TEST_OBJECT')
      assert.equal(o.key,'value')
      assert.equal(o.key2,'value2')
    })

    it('should return a value directly when called with a key argument', function () {
      var v = getEnv('SLASH_TEST_OBJECT','key')
      assert(v,'value')
    })

  })

})
