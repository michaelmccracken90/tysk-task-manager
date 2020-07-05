import knex from '../database';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Auth from '../auth';
import { User, NextErrorFunction } from 'src/@types';

export default class UserController {
    static async index(
        req: Request,
        res: Response,
        next: NextErrorFunction
    ): Promise<void> {
        const { username } = req.params;
        const { page = 1, perPage = 5 } = req.query;

        try {
            let results: Array<User>;
            if (username) {
                results = await knex('users')
                    .select(['id', 'username'])
                    .where({ username });
            } else {
                results = await knex('users')
                    .select(['id', 'username'])
                    .limit(parseInt(perPage as string))
                    .offset(
                        (parseInt(page as string) - 1) *
                            parseInt(perPage as string)
                    )
                    .orderBy('id', 'asc');
            }

            if (results.length >= 1) res.json(results);
            else next({ status: 404, message: 'User not found' });
        } catch ({ message }) {
            console.error(message);
            next({});
        }
    }

    static async create(
        req: Request,
        res: Response,
        next: NextErrorFunction
    ): Promise<void> {
        try {
            let { password } = req.body;
            const { username } = req.body;

            if ((await knex('users').where({ username })).length >= 1) {
                next({ status: 409, message: 'User already exists' });
            } else {
                password = bcrypt.hashSync(password, 10);

                await knex('users').insert({
                    username,
                    password,
                });

                const user = await knex('users')
                    .where({ username, password })
                    .select(['id', 'username', 'password']);

                res.status(201).json({
                    token: Auth.createToken(user[0]),
                    user: { id: user[0].id, username },
                });
            }
        } catch (error) {
            console.error(new Error(error.message));
            next({});
        }
    }

    static async update(
        req: Request,
        res: Response,
        next: NextErrorFunction
    ): Promise<void> {
        try {
            const { id } = res.locals.user;
            const { username, password } = req.body;

            const user = await knex('users')
                .where({ id })
                .select(['id', 'username']);

            if (user.length >= 1) {
                if (
                    username &&
                    (
                        await knex('users')
                            .where({ username })
                            .select(['id', 'username'])
                    ).length >= 1
                ) {
                    next({
                        status: 409,
                        message: 'User with this username already exists',
                    });
                } else {
                    const newUser: User = {};
                    if (username) newUser.username = username;
                    if (password)
                        newUser.password = bcrypt.hashSync(password, 10);

                    await knex('users').update(newUser).where({ id });

                    res.json({ old: user[0] });
                }
            } else {
                next({ status: 404, message: 'User not found' });
            }
        } catch (error) {
            console.error(new Error(error.message));
            next({});
        }
    }

    static async delete(
        req: Request,
        res: Response,
        next: NextErrorFunction
    ): Promise<void> {
        try {
            const { id } = res.locals.user;
            if ((await knex('users').where({ id })).length >= 1) {
                await knex('users').where({ id }).del();
                res.send();
            } else {
                next({ status: 404, message: 'User not found' });
            }
        } catch (error) {
            console.error(new Error(error.message));
            next({});
        }
    }
}
