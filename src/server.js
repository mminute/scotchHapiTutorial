import jwt from 'jsonwebtoken';
import Hapi from 'hapi';
import Knex from './knex';

const server = new Hapi.Server({ port: 3000, host: 'localhost' });

// Need to update for Hapi v17
// UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1):
// AssertionError [ERR_ASSERTION]: Invalid register options "value" must be an object
// https://github.com/dwyl/hapi-auth-jwt2/pull/249
// TODO: upgrade to hapi-auth-jwt2
server.register(require('hapi-auth-jwt'), () => {
  server.auth.strategy('token', 'jwt', {
    key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',
    verifyOptions: {
      algorithms: ['HS256'],
    },
  });
});

server.route({
  method: 'GET',
  path: '/hello',
  // (request, h)
  handler: () => 'helloworld',
});

server.route({
  method: 'GET',
  path: '/birds',
  handler: async () => {
    const getData = async () => {
      const birds = await Knex('birds').where({
        isPublic: true,
      })
        .select('name', 'species', 'picture_url')
        .then((results) => {
          if (!results || results.length === 0) {
            return {
              error: true,
              errMessage: 'No birds found',
            };
          }
          return {
            dataCount: results.length,
            data: results,
          };
        })
        .catch(() => 'Server-side error!');

      return birds;
    };

    return getData();
  },
});

server.route({
  method: 'POST',
  path: '/auth',
  handler: async (request) => {
    const { username, password } = request.payload;

    const getOperation = async () => {
      const userToken = await Knex('users')
        .where({ username })
        .select('guid', 'password')
        .then(([user]) => {
          if (!user) {
            return {
              error: true,
              errMessage: 'Specified user not found',
            };
          }

          if (user.password === password) {
            const token = jwt.sign({
              username,
              scope: user.guid,
            }, 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy', {
              algorithm: 'HS256',
              expiresIn: '1h',
            });

            return {
              token,
              scope: user.guid,
            };
          }

          return 'Incorrect password!';
        })
        .catch(() => 'Server-side error!');

      return userToken;
    };

    return getOperation();
  },
});

try {
  server.start().then(console.log(`Server Started! ${server.info.uri}`));
} catch (err) {
  console.log('Error handling!');
  console.log(err);
}
