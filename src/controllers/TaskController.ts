import { Response, Request, NextFunction } from 'express';
import knex from '../database';

export default class TaskController {
    static async index(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { project_id, user_id: target_user_id } = req.params;

            const { id: user_id } = res.locals.user;
            // TODO: Implements permission system
            if (user_id != target_user_id)
                return next({
                    status: 401,
                    message: "You don't have permission",
                });

            const results = await knex('tasks').where({ project_id });
            res.json(results);
        } catch (error) {
            console.log(error.message);
            next({});
        }
    }

    static async create(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { project_id, user_id: target_user_id } = req.params;
            const { description } = req.body;

            const { id: user_id } = res.locals.user;
            // TODO: Implements permission system
            if (user_id != target_user_id)
                return next({
                    status: 401,
                    message: "You don't have permission",
                });

            const project = await knex('projects')
                .where({ id: project_id })
                .select('id');

            if (project.length >= 1) {
                const result = await knex('tasks')
                    .insert({
                        description,
                        project_id,
                    })
                    .returning('*');

                // To support RETURNING
                const task =
                    typeof result === 'object'
                        ? result
                        : await knex('tasks').where({ id: result });

                res.status(201).send(task);
            } else {
                next({ status: 404, message: 'Project not found' });
            }
        } catch (error) {
            console.log(error.message);
            next({});
        }
    }

    static async update(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id, project_id, user_id: target_user_id } = req.params;
            const { description, completed } = req.body;

            const { id: user_id } = res.locals.user;
            // TODO: Implements permission system
            if (user_id != target_user_id)
                return next({
                    status: 401,
                    message: "You don't have permission",
                });

            const project = await knex('projects')
                .where({ id: project_id })
                .select('id');

            if (project.length >= 1) {
                const task = await knex('tasks').where({ id });
                if (task.length >= 1) {
                    await knex('tasks')
                        .where({ id })
                        .update({ description, completed });
                    res.json({ old: task[0] });
                } else {
                    next({ status: 404, message: 'Task not found' });
                }
            } else {
                next({ status: 404, message: 'Project not found' });
            }
        } catch (error) {
            console.log(error.message);
            next({});
        }
    }
    static async delete(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id, project_id, user_id: target_user_id } = req.params;

            const { id: user_id } = res.locals.user;
            // TODO: Implements permission system
            if (user_id != target_user_id)
                return next({
                    status: 401,
                    message: "You don't have permission",
                });

            const project = await knex('projects')
                .where({ id: project_id })
                .select('id');

            if (project.length >= 1) {
                const task = await knex('tasks').where({ id });
                if (task.length >= 1) {
                    await knex('tasks').where({ id }).del();
                    res.json(task);
                } else {
                    next({ status: 404, message: 'Task not found' });
                }
            } else {
                next({ status: 404, message: 'Project not found' });
            }
        } catch (error) {
            console.log(error.message);
            next({});
        }
    }
}
