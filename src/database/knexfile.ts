import { Config } from 'knex';

const {
    NODE_ENV,
    DATABASE_URL,
    DATABASE_TIMEZONE,
    DATABASE_CLIENT,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
} = process.env;

if (NODE_ENV !== 'production') require('ts-node/register');

const knexConfig = {
    client: DATABASE_CLIENT || 'mysql2',

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
    timezone: DATABASE_TIMEZONE || 'utc',
} as Config;

knexConfig.connection = DATABASE_URL
    ? DATABASE_URL
    : {
          host: DATABASE_HOST || '127.0.0.1',
          database: DATABASE_NAME || 'tysk',
          user: DATABASE_USER || 'root',
          password: DATABASE_PASSWORD || '',
      };

module.exports = knexConfig;
