exports.up = function (knex, Promise) {
  return knex
    .schema
    .createTable('users', (userTable) => {
      // Primary key
      userTable.increments();
      userTable.string('name', 50).notNullable();
      userTable.string('username', 50).notNullable().unique();
      userTable.string('email', 250).notNullable().unique();
      userTable.string('password', 128).notNullable();
      userTable.string('guid', 50).notNullable().unique();
      userTable.timestamp('created_at').notNullable();
    })

    .createTable('birds', (birdsTable) => {
      // Primarykey
      birdsTable.increments();
      birdsTable.string('owner', 36).references('guid').inTable('users');
      birdsTable.string('name', 250).notNullable();
      birdsTable.string('species', 250).notNullable();
      birdsTable.string('picture_url', 250).notNullable();
      birdsTable.string('guid', 36).notNullable().unique();
      birdsTable.boolean('isPublic').notNullable().defaultTo(true);
      birdsTable.timestamp('created_at').notNullable();
    });
};

exports.down = function (knex, Promise) {
  return knex
    .schema
    .dropTableIfExists('birds')
    .dropTableIfExists('users');
};
