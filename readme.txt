Tutorial source:
https://scotch.io/tutorials/getting-started-with-hapi-js

https://scotch.io/tutorials/making-a-restful-api-with-hapi-js

Updates required for Hapi v17.0.0

Installing mysql for mac:
https://dev.mysql.com/doc/refman/5.7/en/osx-installation-pkg.html

==================================================================
==================================================================

1) Make your directory and setup
    mkdir getting-started-with-hapi-js-part-1 && cd $_
    mkdir src
    touch .babelrc .gitignore src/server.js

2) npm init
3) Setup eslint
    https://eslint.org/docs/user-guide/getting-started

4) From root dir:
    npm install --save babel-core babel-preset-es2015 hapi

5) Setup .babelrc
    { "presets": [ "es2015" ] }

6) Add node_modules to gitignore file

7) create bootstrap.js which requires babel-core's registering module and the maim module of our code (server.js)
    require( 'babel-core/register' );
    require( './src/server' );

8) Add scripts to package.json to make it easy to fire up the Hapi app
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node bootstrap.js
    }

9) Import happy into server.js.  Setup server and routes

#########################
Setting up DB
#########################

10) Install dependencies
    npm i --save mysql jsonwebtoken hapi-auth-jwt knex

11) In MySQL workbench, create a new database.  Either use root user or create a new user with full access.

12) Create knexfile.js in root directory.  See file.
13) Create seeds directory in root directory.
14) Create a knex migrations
    knex migrate:make Datastructure
    It will produce a new file like: '20161211185139_Datastructure.js'
    Edit the migration file to create tables etc in th 'up' and drop tables in the 'down'
15) Run the migration
    knex migrate:latest
    You can see the changes in MySQLWorbench
16) Seed the db
    Seedfiles are executed in order of their filenames
    Create seed
        knex seed:make 01_Users
    Fill in seed file. See seed files.
    Execute seeds:
        knex seed:run
    See the changes in MySQL workbench

#########################
Setting up the API
#########################

Will authenticate with JWT
    https://jwt.io/introduction/
17) Setting up JWT
    server.register(require('hapi-auth-jwt'), (err) => {
      server.auth.strategy('token', 'jwt', {
        key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',
        verifyOptions: {
          algorithms: ['HS256'],
        },
      });
    });

18) Add routes
19) Add knex.js to src to connect to db and get data
20) Add a route that uses Knex to fetch data.  The handler must be async 'handler: async () => {...}'
    knex is async so you must await the results
        const getData = async () => { const data = await Knex(tableName).where(...)... }

#########################
Create an Auth Route
#########################
Note: Must require the jwt package.

Got this working with Hapi v17 using this hack:
https://github.com/dwyl/hapi-auth-jwt2/pull/249#issuecomment-350432038

https://auth0.com/blog/developing-restful-apis-with-hapijs/