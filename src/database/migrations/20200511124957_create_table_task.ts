import * as Knex from 'knex';

export const up = async (knex: Knex): Promise<void> =>
    knex.schema.createTable('tasks', (table) => {
        table.increments('id').primary();
        table.string('description', 64).notNullable();
        table.boolean('completed').defaultTo(false);

        table
            .integer('project_id')
            .unsigned()
            .references('projects.id')
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
    knex.schema.dropTable('tasks');
