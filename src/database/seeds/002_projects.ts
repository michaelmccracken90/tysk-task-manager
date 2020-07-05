import * as Knex from 'knex';
import faker from 'faker';
import { Project } from 'src/@types';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('projects').del();

    const usersId = await knex('users').select('id').orderBy('id', 'asc');

    // Inserts seed entries
    for (let index = 0; index < 200; index++) {
        await knex('projects').insert({
            title: faker.lorem.words(2).substr(0, 16),
            description: faker.lorem.sentence(undefined, 125).substr(0, 126),
            user_id:
                faker.random.number(usersId.length - 1) + (usersId[0].id || 1),
        } as Project);
    }

    console.log('✅ Projects created.');
}
