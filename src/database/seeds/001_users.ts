import * as Knex from 'knex';
import bcrypt from 'bcrypt';
import faker from 'faker';
import { User } from 'src/@types';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('users').del();

    // Inserts seed entries
    for (let index = 0; index < 50; index++) {
        const username = faker.internet.userName().substr(0, 18);
        if ((await knex('users').where({ username })).length >= 1) return;

        await knex('users').insert({
            username,
            password: bcrypt.hashSync('secret', 10),
        } as User);
    }

    console.log('✅ Users created.');
}
