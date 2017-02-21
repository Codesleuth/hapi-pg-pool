const tap = require('tap')
const createServer = require('./server')

tap.test('Sequential queries', (assert) => {
  const server = createServer(1)
  server.inject({
    method: 'GET',
    url: '/'
  }, (response) => {
    assert.equal(response.statusCode, 200)
    
    const payload = JSON.parse(response.payload)
    assert.ok(payload.before <= payload.after - 6000, `${payload.before} <= ${payload.after} - 6000`)

    server.stop()
    assert.end()
  })
})
