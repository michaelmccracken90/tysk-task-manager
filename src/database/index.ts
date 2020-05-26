import * as knexfile from './knexfile';
import Knex, { Config } from 'knex';

const knex = Knex(knexfile as Config);

export default knex;
