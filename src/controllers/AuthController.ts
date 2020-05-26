import { Request, Response, NextFunction } from 'express';
import Auth from '../auth';
import knex from '../database';
import User from 'src/interfaces/user';

export default class AuthController {
    static async index(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response<unknown>> {
        try {
            const { username, password = '' } = req.body;

            const { authorization } = req.headers;
            if (authorization) {
                const token =
                    authorization &&
                    (authorization as string).replace('Bearer ', '');

                if (token) {
                    const decodedUser = Auth.decodeToken(token);

                    const user = await knex('users')
                        .where(decodedUser)
                        .select(['id', 'username']);

                    if (user.length >= 1) {
                        return res.status(200).send({
                            token,
                            user: user[0],
                        });
                    }
                }

                return next({
                    status: 403,
                    message: 'Forbidden',
                });
            }

            const user = (await knex('users')
                .where({ username })
                .select(['id', 'username', 'password'])) as Array<User>;

            if (user.length >= 1 && Auth.password(password, user[0].password)) {
                res.status(200).send({
                    token: Auth.createToken(user[0]),
                    user: { id: user[0].id, username },
                });
            }
            next({
                status: 404,
                message: 'Username or password incorrect',
            });
        } catch ({ message }) {
            console.log(message);
            next({});
        }
    }

    /**
     * @middleware
     */
    static async token(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { authorization } = req.headers;

            const token =
                authorization &&
                (authorization as string).replace('Bearer ', '');

            if (token) {
                const decodedUser = Auth.decodeToken(token);

                const user = await knex('users')
                    .where(decodedUser)
                    .select(['id', 'username']);

                if (user.length >= 1) {
                    res.locals.user = user[0];
                    return next();
                }
            }

            next({
                status: 403,
                message: 'Forbidden',
            });
        } catch ({ message }) {
            next({
                status: 403,
                message,
            });
        }
    }
}
