# Hapi PG Pool [![Build Status](https://travis-ci.org/Codesleuth/hapi-pg-pool.svg?branch=master)](https://travis-ci.org/Codesleuth/hapi-pg-pool) [![npm](https://img.shields.io/npm/v/hapi-pg-pool.svg)](https://www.npmjs.com/package/hapi-pg-pool) [![Dependency Status](https://david-dm.org/Codesleuth/hapi-pg-pool.svg)](https://david-dm.org/Codesleuth/hapi-pg-pool)

Create a PostgreSQL connection pool available to Hapi request handlers.  
Implements pooling with the [`pg-pool`](https://www.npmjs.com/package/pg-pool) package.

## Using

1. Install from NPM

    ```sh
    npm i hapi-pg-pool -S
    ```

2. Ensure you have either your favourite PostgreSQL client dependency, or install the `pg` client

    ```sh
    npm i pg -S
    ```

3. Register the extension

    ```js
    server.register({
      register: require('hapi-pg-pool'),
      options: {
        database: 'postgres',
        user: 'postgres',
        password: 'postgres'
      }
    }, function (err) {
      if (err) {
        throw err
      }

      // server.route(...)
    })
    ```

4. Use the pool in your handlers

    ```js
    server.route({
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        console.log('sleepy...');

        request.pg.query('SELECT pg_sleep(1)', function (err, result) {
          if (err) {
            server.log('error', err)
            return reply(err)
          }
          reply('awake!')
        })

      }
    });
    ```

Refer to [`pg-pool`](https://www.npmjs.com/package/pg-pool) for more ways to use the `request.pg` (Pool) object.

## License

MIT.
