import { Config } from 'knex';

const {
    NODE_ENV,
    DATABASE_URL,
    database_timezone,
    database_client,
    database_host,
    database_name,
    database_user,
    database_password,
} = process.env;

if (NODE_ENV !== 'production') require('ts-node/register');

const knexConfig = {
    client: database_client || 'mysql2',

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
    timezone: database_timezone || 'utc',
} as Config;

knexConfig.connection = DATABASE_URL
    ? DATABASE_URL
    : {
          host: database_host || '127.0.0.1',
          database: database_name || 'tysk',
          user: database_user || 'root',
          password: database_password || '',
      };

module.exports = knexConfig;
