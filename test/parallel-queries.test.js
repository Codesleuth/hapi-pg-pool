const tap = require('tap')
const createServer = require('./server')

tap.test('Parallel queries', (assert) => {
  const server = createServer(10)
  server.inject({
    method: 'GET',
    url: '/'
  }, (response) => {
    assert.equal(response.statusCode, 200)
    
    const payload = JSON.parse(response.payload)
    assert.ok(payload.before <= payload.after - 3000, `${payload.before} <= ${payload.after} - 3000`)

    server.stop()
    assert.end()
  })
})
