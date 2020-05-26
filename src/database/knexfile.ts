import { Config } from 'knex';

require('ts-node/register');

module.exports = {
    client: process.env.database_client || 'mysql2',
    connection: {
        host: process.env.database_host || '127.0.0.1',
        database: process.env.database_name || 'tysk',
        user: process.env.database_user || 'root',
        password: process.env.database_password || '',
    },
    pool: {
        min: 1,
        max: 1,
    },
    migrations: {
        tablename: 'knex_migrations',
        directory: 'migrations',
    },
    seeds: {
        directory: 'seeds',
    },
    timezone: process.env.database_timezone || 'utc',
} as Config;
