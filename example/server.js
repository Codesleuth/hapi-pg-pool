const Server = require('hapi').Server
const server = new Server({
  debug: {
    log: ['error', 'warn', 'info', 'pg-pool'],
    request: ['error', 'warn', 'info']
  }
})

server.connection({ port: 3000, host: 'localhost' })

server.register({
  register: require('../'),
  options: {
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    ssl: false,
    max: 20,
    min: 1,
    idleTimeoutMillis: 5000
  }
}, (err) => {
  if (err) {
    throw err
  }

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: function (request, reply) {
        server.log('info', 'Request started...')

        request.pg.query('SELECT pg_sleep(3)').then((result) => reply('success'), (err) => {
          server.log('error', err)
          reply(err)
        })
      }
    }
  })

  server.start((err) => {
    if (err) {
      return server.log('error', err)
    }
    server.log('info', `Example server started: ${server.info.uri}`)
  })

})
