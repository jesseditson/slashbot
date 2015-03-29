/* global describe,before,after,it */
var assert = require('assert')
var request = require('supertest')
var app = require('../../lib/server')

describe('server', function () {
  var server

  before(function (ready) {
    // start up our server
    app.set('port', process.env.PORT || 3000)
    server = app.listen(app.get('port'), function () {
      ready()
    })
  })

  after(function () {
    server.close()
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
