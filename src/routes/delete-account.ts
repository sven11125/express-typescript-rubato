import { Request, Response } from 'express';
import { randomDummyProfilePhoto } from '../utils/helpers-photos'
import { mongoDb } from '../utils/helpers-mongo';
import { createUid } from '../utils/helpers';


export const deleteAccount = async (req: Request, res: Response) => {

    res.status(200).end();

    const user = req.user;

    // Remove sensative fields
    user.isDeleted = true;
    user.email = createUid() + '@delete.com'
    user.mediaLinks = [randomDummyProfilePhoto()]

    await mongoDb.collection('users').updateOne(
        { uid: user.uid },
        {
            $set: user,
        },
        { upsert: false }
    )
};
