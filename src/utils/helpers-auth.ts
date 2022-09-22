import { mongoDb } from './helpers-mongo'
import { logError } from '../utils/logger';
import { RouteError } from './route-error'
import { User } from '../models/user'
import * as jwtthen from 'jwt-then'
import { Config } from './config';


/**
 * @api {post} authentication How to authenticate
 * @apiDescription We use Json Web Tokens for authentication. When creating an account you will receive a JWT string.
 * @apiName Authentication
 * @apiGroup Info
 * @apiHeaderExample {json} Request-Example:
 * {
 *    "authorization": [JWT String]
 * }
 */


export const createJwt = async (userUid: string): Promise<string> => {
    return await jwtthen.sign({ userUid }, Config.jwtSecret);
}

/**
 * Checks the auth token and returns the user.
 */
export const checkJwt = async (token: string): Promise<User> => {
    try {
        const decoded = await jwtthen.verify(token, Config.jwtSecret) as any
        const user = await mongoDb.collection<User | undefined>('users').findOne({ 'uid': decoded.userUid })
        if (!user) {
            throw new RouteError('not-authenticated', 'The user has an invalid auth token.')
        }
        return user;

    } catch (e) {
        logError('not-authenticated', e)
        throw new RouteError('not-authenticated', 'The user has an invalid auth token.');
    }
}

export interface SignupData {
    username: string,
    phoneNumber: string,
    photoUrl: string,
}