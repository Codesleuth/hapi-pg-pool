const Pool = require('pg-pool')
const package = require('./package.json')

exports.register = function (server, options, next) {
  options.log = options.log || ((msg, data) => server.log(['pg-pool', data], msg))

  const pool = new Pool(options)

  server.ext('onPreAuth', function (request, reply) {
    request.pg = {
      connect: pool.connect.bind(pool),
      query: pool.query.bind(pool),
      on: pool.on.bind(pool)
    }
    reply.continue()
  })

  server.once('stop', () => {
    server.log(['info', package.name], 'Draining PostgreSQL connection pool...')
    
    pool.end(() => {
      server.log(['info', package.name], 'PostgreSQL connection pool drained.')
    })
  })

  next()
}

exports.register.attributes = {
  pkg: package
};
