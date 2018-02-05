export default require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'public',
    password: 'birdbasepublic',
    database: 'birdbase',
    charset: 'utf8',
  },
});
