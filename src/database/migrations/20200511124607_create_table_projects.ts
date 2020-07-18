import * as Knex from 'knex';

export const up = async (knex: Knex): Promise<void> =>
    knex.schema.createTable('projects', (table) => {
        table.increments('id').primary();
        table.string('title', 25).notNullable();
        table.string('description', 126).notNullable();

        table
            .integer('user_id')
            .unsigned()
            .references('users.id')
            .notNullable()
            .onDelete('CASCADE');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        process.env.DATABASE_CLIENT !== 'pg' &&
            table
                .timestamp('updated_at')
                .defaultTo(
                    knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                );
    });

export const down = async (knex: Knex): Promise<void> =>
    knex.schema.dropTable('projects');
