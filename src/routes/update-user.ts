import { Request, Response } from 'express';
import { fetchUser } from '../utils/helpers-users';
import { addDummyIfNoPhotos } from '../utils/helpers-photos';
import { mongoDb } from '../utils/helpers-mongo';

export const updateUser = async (req: Request, res: Response) => {

    const user = req.user
    const data = req.body

    try {
        // Don't update.
        delete data.uid;
        delete data.password;
        delete data.isAdmin

        // If they have no media, make a placeholder for them.
        if (data.mediaLinks) {
            data.mediaLinks = addDummyIfNoPhotos(data.mediaLinks);
        }

        await mongoDb.collection('users').updateOne(
            { uid: user.uid },
            {
                $set: {
                    data,
                }
            },
        )

        return res.status(200).json((await fetchUser(user.uid)));
    } catch (e) {
        throw e;
    }
};

