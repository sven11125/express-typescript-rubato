import { Request, Response, Express } from 'express';
import * as Joi from 'joi';
import * as bcrypt from 'bcrypt';
import { createUid } from '../utils/helpers';
import { createJwt } from '../utils/helpers-auth';
import { mongoDb } from '../utils/helpers-mongo';
import { RouteError } from '../utils/route-error';
import { randomDummyProfilePhoto } from '../utils/helpers-photos';
import { User } from '../models/user';
import * as supertest from 'supertest'
import test from 'ava';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { checkJwt } from '../utils/helpers-auth';
import { appLoaded } from '../../test'

const saltRounds = 10;

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(7).max(30).required(),
    email: Joi.string().email(),
    password: Joi.string().min(7).required()
})


/**
 * @api {post} api/register Register
 * @apiDescription Register User
 * @apiName register
 * @apiGroup Auth
 * @apiParamExample {json} Request-Example:
 * {
 *     username: string,
 *     email: string, 
 *     password: string
 * }
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "user": <User Object>,
 *     "jwt": <JWT token> 
 *   }
 */
export const register = async (req: Request, res: Response) => {

    const { username, email, password } = req.body;

    try {

        const { error } = registerSchema.validate(req.body);

        if (error) {
            throw new RouteError('register-parms-invalid', error.details[0].message);
        } else {

            const uid = createUid();
            const token = await createJwt(uid);
            const hash = bcrypt.hashSync(password, saltRounds);

            const newUser: User = {
                uid,
                username,
                email,
                mediaLinks: [randomDummyProfilePhoto()],
                createdISO: new Date().toISOString(),
                lastOpenedAppISO: new Date().toISOString(),
                isBanned: false,
                isDeleted: false,
                reports: {},
                role: 'standard',
                password: hash,
            }

            const oldUser = await mongoDb.collection('users').findOne({ email })

            if (oldUser) {
                return res.status(200).json({ message: 'Email already exist' });
            } else {
                await mongoDb.collection('users').insertOne(newUser);
                return res.status(200).json({ user: newUser, jwt: token });
            }
        }

    } catch (e) {
        throw e;
    }
};


/// -- TESTS --

export const customNamesConfig = {
    dictionaries: [adjectives, colors, animals],
    separator: '',
    length: 2,
};

export const registerTests = () => {

    test('api/register & verify jwt', async t => {
        const username = uniqueNamesGenerator(customNamesConfig);
        const result = await supertest(appLoaded)
            .post('/api/register/')
            .send({
                'username': username,
                'email': uniqueNamesGenerator(customNamesConfig) + '@test.com',
                'password': 'testtest123',
            })
            .expect(async (r) => {
                r.body.jwtCheck = await checkJwt(r.body.jwt)
            })
        await checkJwt(result.body.jwt)
        t.is(result.body.user.username, username)
        t.pass();
    });

    test('api/register & invalid username', async t => {
        const result = await supertest(appLoaded)
            .post('/api/register/')
            .send({
                'username': '',
                'email': uniqueNamesGenerator(customNamesConfig) + '@test.com',
                'password': 'testtest123',
            })
            .expect(500)
        t.is(result.body.statusCode, 'register-parms-invalid')
    });

    test('api/register & username long', async t => {
        const result = await supertest(appLoaded)
            .post('/api/register/')
            .send({
                'username': 'fwefnwfwienfwenfwifwnifwienfwiefniwefniwenfwienfiwfniwenfiwenfiwnfiwnfiinfw',
                'email': uniqueNamesGenerator(customNamesConfig) + '@test.com',
                'password': 'testtest123',
            })
            .expect(500)
        t.is(result.body.statusCode, 'register-parms-invalid')
    });

    test('api/register & invalid email', async t => {
        const username = uniqueNamesGenerator(customNamesConfig);
        const result = await supertest(appLoaded)
            .post('/api/register/')
            .send({
                'username': username,
                'email': 'fu',
                'password': 'testtest123',
            })
            .expect(500)
        t.is(result.body.statusCode, 'register-parms-invalid')
    });

    test('api/register & invalid password', async t => {
        const username = uniqueNamesGenerator(customNamesConfig);
        const result = await supertest(appLoaded)
            .post('/api/register/')
            .send({
                'username': username,
                'email': uniqueNamesGenerator(customNamesConfig) + '@test.com',
                'password': '',
            })
            .expect(500)
        t.is(result.body.statusCode, 'register-parms-invalid')
    });

}