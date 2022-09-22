import { Request, Response, Express } from 'express';
import * as Joi from 'joi';
import { mongoDb } from '../utils/helpers-mongo';
import { RouteError } from '../utils/route-error';
import { User } from '../models/user';


const profileSchema = Joi.object({
    uid: Joi.string().required(),
    username: Joi.string().alphanum().min(7).max(30).required(),
    birthDate: Joi.date().required(),
    gender: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    genre: Joi.array().required(),
    mediaLinks: Joi.array().required(),
    mainPhoto: Joi.string().required(),
    photos: Joi.array().required(),
    bio: Joi.string().required(),
})


/**
 * @api {post} api/updateProfile Update Profile
 * @apiDescription Update User Profile
 * @apiName updateProfile
 * @apiGroup User
 * @apiParamExample {json} Request-Example:
 * {
 *     uid: string,
 *     username: string,
 *     birthDate: date,
 *     gender: string,
 *     phoneNumber: string,
 *     address: string,
 *     genre: array,
 *     mediaLinks: array,
 *     mainPhoto: string,
 *     photos: array,
 *     bio: string
 * }
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "user": <User Object>,
 *     "jwt": <JWT token> 
 *   }
 */
export const updateProfile = async (req: Request, res: Response) => {

    const { uid, username, birthDate, gender, phoneNumber, address, genre, mediaLinks, mainPhoto, photos, bio } = req.body;

    try {

        const { error } = profileSchema.validate(req.body);

        if (error) {
            throw new RouteError('update-profile-parms-invalid', error.details[0].message);
        } else {

            const oldProfile = await mongoDb.collection('users').findOne({ uid })

            const newProfile: User = {
                uid,
                username,
                email: oldProfile.email,
                birthDate,
                gender,
                phoneNumber,
                address,
                genre,
                mediaLinks,
                mainPhoto,
                photos,
                bio,
                createdISO: new Date().toISOString(),
                lastOpenedAppISO: new Date().toISOString(),
                isBanned: false,
                isDeleted: false,
                reports: {},
                role: 'standard',
                password: oldProfile,
            };

            const resp = await mongoDb.collection('users').updateOne({ uid }, { $set: newProfile, $currentDate: { lastModified: true });
            return res.status(200).json({ message: 'Profile updated successfully' });
        };
    } catch (e) {
        throw e;
    }
};