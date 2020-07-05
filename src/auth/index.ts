import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from 'src/@types';

class Auth {
    private static JWT_SECRET =
        process.env.JWT_SECRET || crypto.randomBytes(256).toString('hex');

    static createToken(payload: User): string {
        return JWT.sign(payload, Auth.JWT_SECRET || 'secret', {
            expiresIn: '7d',
        });
    }

    static decodeToken(token: string): User {
        const results = JWT.verify(token, Auth.JWT_SECRET || 'secret') as User;
        return {
            id: results.id,
            username: results.username,
            password: results.password,
        };
    }

    static password(data: unknown, encrypted?: string): string | boolean {
        if (data && encrypted) {
            return bcrypt.compareSync(data, encrypted);
        } else if (data) {
            return bcrypt.hashSync(data, 10);
        }
        return false;
    }
}

export default Auth;
