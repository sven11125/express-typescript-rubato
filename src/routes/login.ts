import { Request, Response } from 'express';
import * as Joi from 'joi';
import * as bcrypt from 'bcrypt';
import { mongoDb } from '../utils/helpers-mongo';
import { RouteError } from '../utils/route-error';

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(7).required()
})


/**
 * @api {post} api/login Login
 * @apiDescription Login User
 * @apiName login
 * @apiGroup Auth
 *  * @apiParamExample {json} Request-Example:
 * {
 *     email: string, 
 *     password: string
 * }
 * @apiInterface (../models/user.ts) {AuthUser}
 */
export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {

        const { error } = loginSchema.validate(req.body);

        if (error) {
            throw new RouteError('Request pamameters not validated', error.details[0].message);
        } else {

            const existUser = await mongoDb.collection('users').findOne({ email })

            if (existUser) {

                const matchingPassword = await bcrypt.compareSync(password, existUser.password)

                if (matchingPassword) {
                    delete existUser.password
                    return res.status(200).json({ message: 'Login success', user: existUser });
                } else {
                    return res.status(200).json({ message: 'Password incorrect' });
                }
            } else {
                return res.status(200).json({ message: 'Email incorrect' });
            }
        }

    } catch (e) {
        throw e;
    }
};
