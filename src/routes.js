import jwt from 'jsonwebtoken';
import Knex from './knex';

const routes = [
  {
    method: 'GET',
    path: '/hello',
    handler: () => 'helloworld',
  },
  {
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
  },
  {
    config: {
      auth: { strategy: 'token' },
    },
    method: 'POST',
    path: '/birds',
    handler: async (request, h) => {
      const { bird } = request.payload;
    },
  },
  {
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
  },
];

export default routes;
