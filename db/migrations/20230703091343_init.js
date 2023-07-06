/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema
        .createTable('exercises', function (table) {
            table.bigIncrements('exercise_id');
            table.string('title', 255).notNullable();
            table.boolean('is_static').defaultTo(false);
            table.string('img', 255);
            table.timestamps(true, true);
        })
        .createTable('users', function (table) {
            table.bigIncrements('user_id');
            table.string('first_name').notNullable();
            table.string('sur_name').notNullable();
            table.integer('age').notNullable();
            table.boolean('gender').defaultTo(true);
            table.boolean('is_admin').defaultTo(false);
            table.timestamps(true, true);
        })
        .createTable('user_details', function (table) {
            table.bigInteger('user_id').references('user_id').inTable('users').notNullable();
            table.primary('user_id');
            table.string('login').notNullable();
            table.string('password').notNullable();
        })
        .createTable('workouts', function (table) {
            table.bigIncrements('workout_id');
            table.string('title').notNullable();
            table.bigInteger('user_id').references('user_id').inTable('users');
            table.timestamps(true, true);
        })
        .createTable('workout_exercises', function (table) {
            table.bigInteger('workout_id').references('workout_id').inTable('workouts').notNullable();
            table.bigInteger('exercise_id').references('exercise_id').inTable('exercises').notNullable();
            table.primary(['workout_id', 'exercise_id']);
        })
        .createTable('sessions', function (table) {
            table.bigIncrements('session_id');
            table.bigInteger('workout_id').references('workout_id').inTable('workouts');
        })
        .createTable('session_users', function (table) {
            table.bigInteger('session_id').references('session_id').inTable('sessions').notNullable();
            table.bigInteger('user_id').references('user_id').inTable('users').notNullable();
            table.primary(['session_id', 'user_id']);
        })
        .createTable('messages', function (table) {
            table.bigIncrements('message_id');
            table.bigInteger('session_id').references('session_id').inTable('sessions').notNullable();
            table.bigInteger('user_id').references('user_id').inTable('users').notNullable();
            table.text('text');
            table.timestamps(true, true);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema
        .dropTable('messages')
        .dropTable('session_users')
        .dropTable('sessions')
        .dropTable('workout_exercises')
        .dropTable('workouts')
        .dropTable('user_details')
        .dropTable('users')
        .dropTable('exercises');
};
