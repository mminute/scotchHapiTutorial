import jwt from 'jsonwebtoken';
import Hapi from 'hapi';
import Knex from './knex';
import routes from './routes';

const server = new Hapi.Server({ port: 3000, host: 'localhost' });

// Need to update for Hapi v17
// UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1):
// AssertionError [ERR_ASSERTION]: Invalid register options "value" must be an object
// https://github.com/dwyl/hapi-auth-jwt2/pull/249
// TODO: upgrade to hapi-auth-jwt2
server.register(require('hapi-auth-jwt'), (err) => {
  if (!err) {
    console.log('registered authentication provider');
  }

  server.auth.strategy('token', 'jwt', {
    key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',
    verifyOptions: {
      algorithms: ['HS256'],
    },
  });

  routes.forEach((route) => {
    console.log(`attaching ${route.path}`);
    server.route(route);
  });
});

try {
  server.start().then(console.log(`Server Started! ${server.info.uri}`));
} catch (err) {
  console.log('Error handling!');
  console.log(err);
}
