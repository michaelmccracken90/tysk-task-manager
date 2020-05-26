import * as Knex from 'knex';
import faker from 'faker';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('tasks').del();

    const projectsId = await knex('projects').select('id').orderBy('id', 'asc');

    // Inserts seed entries
    for (let index = 0; index < 2000; index++) {
        await knex('tasks').insert({
            description: faker.lorem.sentence(undefined, 64).substr(0, 64),
            project_id:
                faker.random.number(projectsId.length - 1) +
                (projectsId[0].id || 1),
            completed: faker.random.boolean(),
        });
    }

    console.log('✅ Tasks created.');
}
