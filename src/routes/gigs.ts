import { Request, Response } from 'express';
import * as Joi from 'joi';
import { mongoDb } from '../utils/helpers-mongo';
import { RouteError } from '../utils/route-error';
import { createUid } from '../utils/helpers';
import { Gig } from '../models/gig';


const saveGigSchema = Joi.object({
    title: Joi.string().required(),
    genre: Joi.array().required(),
    description: Joi.string().required(),
    tag: Joi.number().required(),
    firstPackage: Joi.string().required(),
    firstPrice: Joi.number().required(),
    secondPackage: Joi.string(),
    secondPrice: Joi.number(),
    coverImage: Joi.string().required(),
    gallery: Joi.array().required(),
    mediaLinks: Joi.array().required()
})


/**
 * @api {post} api/saveGig Save gig
 * @apiDescription Save new gig
 * @apiName saveGig
 * @apiGroup Gig
 * @apiParamExample {json} Request-Example:
 * {
 *     title: string,
 *     genre: string, 
 *     description: string,
 *     tag: number,
 *     firstPackage: string,
 *     firstPrice: number,
 *     secondPackage: string (optional),
 *     secondPrice: number (optional),
 *     coverImage: string,
 *     gallery: array,
 *     mediaLinks: array
 * }
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "gig": <Gig Object>,
 *     "jwt": <JWT token> 
 *   }
 */


export const saveGig = async (req: Request, res: Response) => {

    const { title, genre, description, tag, firstPackage, firstPrice, secondPackage, secondPrice, coverImage, gallery, mediaLinks } = req.body;

    try {

        const { error } = saveGigSchema.validate(req.body);

        if (error) {
            throw new RouteError('save-gig-parms-invalid', error.details[0].message);
        } else {

            const gigId = createUid();

            const newGig: Gig = {
                gigId,
                title,
                genre,
                description,
                tag,
                firstPackage,
                firstPrice,
                secondPackage,
                secondPrice,
                coverImage,
                gallery,
                mediaLinks
            }

            if (secondPackage)
                delete newGig.secondPackage

            if (secondPrice) {
                delete newGig.secondPrice
            }

            await mongoDb.collection('users').insertOne(newGig);
            return res.status(200).json({ gig: newGig });
        }

    } catch (e) {
        throw e;
    }
};


/**
 * @api {post} api/saveGig Save gig
 * @apiDescription Save new gig
 * @apiName saveGig
 * @apiGroup Gig
 * @apiParamExample {json} Request-Example:
 * {
 *     title: string,
 *     genre: string, 
 *     description: string,
 *     tag: number,
 *     firstPackage: string,
 *     firstPrice: number,
 *     secondPackage: string (optional),
 *     secondPrice: number (optional),
 *     coverImage: string,
 *     gallery: array,
 *     mediaLinks: array
 * }
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "gig": <Gig Object>,
 *     "jwt": <JWT token> 
 *   }
 */


export const editGig = async (req: Request, res: Response) => {

    const { gigId, title, genre, description, tag, firstPackage, firstPrice, secondPackage, secondPrice, coverImage, gallery, mediaLinks } = req.body;

    try {

        const { error } = saveGigSchema.validate(req.body);

        if (error) {
            throw new RouteError('save-gig-parms-invalid', error.details[0].message);
        } else {

            const editGig: Gig = {
                gigId,
                title,
                genre,
                description,
                tag,
                firstPackage,
                firstPrice,
                secondPackage,
                secondPrice,
                coverImage,
                gallery,
                mediaLinks
            }

            if (!secondPackage)
                delete editGig.secondPackage

            if (!secondPrice) {
                delete editGig.secondPrice
            }

            await mongoDb.collection('users').insertOne(editGig);
            return res.status(200).json({ gig: editGig });
        }

    } catch (e) {
        throw e;
    }
};


/**
 * @api {post} api/deleteGig Delete gig
 * @apiDescription Delete gig
 * @apiName deleteGig
 * @apiGroup Gig
 * @apiParamExample {json} Request-Example:
 * {
 *     _id: string,
 * }
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "gig": <Gig Object>,
 *     "jwt": <JWT token> 
 *   }
 */


export const deleteGig = async (req: Request, res: Response) => {

    const { gigId } = req.body;

    try {
        await mongoDb.collection('users').deleteOne({ gigId });
        return res.status(200).json({ message: 'Gig successfully deleted' });
    } catch (e) {
        throw e;
    }
};