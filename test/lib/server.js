/* global describe,before,after,it */
var assert = require('assert')
var request = require('supertest')
var startServer = require('../../lib/server')

describe('server', function () {
  var server, app

  before(function (ready) {
    // start up our server
    var server = startServer(function(err,a){
      assert.ifError(err)
      app = a
      ready()
    })
  })

  after(function () {
    if(server) server.close()
  })

  it('should serve a status page at /', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-type', /json/)
      .end(function (err, res) {
        assert.ifError(err)
        assert.ok(/version/i.test(res.text), 'shoud show the version number')
        done()
      })
  })

})
