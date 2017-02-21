const Server = require('hapi').Server

module.exports = function createServer(maxConnections) {
  const server = new Server({
    debug: {
      log: ['error', 'warn', 'info', 'pg-pool'],
      request: ['error', 'warn', 'info']
    }
  })

  server.connection({ port: 3421, host: 'localhost' })

  server.register({
    register: require('../'),
    options: {
      database: process.env.DB_DATABASE || 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_DATABASE || 'postgres',
      port: Number(process.env.DB_PORT || 5432),
      ssl: false,
      max: maxConnections,
      min: 1,
      idleTimeoutMillis: 5000
    }
  })

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: function (request, reply) {
        server.log('info', 'Request started...')

        Promise.all([
          request.pg.query('SELECT now()'),
          request.pg.query('SELECT pg_sleep(1)'),
          request.pg.query('SELECT pg_sleep(2)'),
          request.pg.query('SELECT pg_sleep(3)')
        ]).then((results) => {
          return request.pg.query('SELECT now()').then((result) => {
            const before = Date.parse(results[0].rows[0].now)
            const after = Date.parse(result.rows[0].now)
            reply({ before, after })
          })
        }).catch((err) => {
          server.log('error', err)
          reply(err)
        })
      }
    }
  })

  return server
}
