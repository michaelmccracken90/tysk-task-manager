import * as Knex from 'knex';

export const up = async (knex: Knex): Promise<any> =>
    knex.schema.createTable("users", (table) => {
        console.log(process.env.database_client);
        table.increments("id").primary();
        table.string("username", 18).notNullable().unique();
        table.string("password", 72).notNullable();

        table.timestamp("created_at").defaultTo(knex.fn.now());
        process.env.database_client !== "pg" && table.timestamp("updated_at").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });

export const down = async (knex: Knex): Promise<any> => knex.schema.dropTable("users");
