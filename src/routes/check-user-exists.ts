import { Request, Response } from 'express';
import { mongoDb } from '../utils/helpers-mongo';



export const checkUserExists = async (req: Request, res: Response) => {
    const {
        userUid,
    } = req.body;
    const user = await mongoDb.collection('users').findOne({ uid: userUid })
    return res.status(200).json({ exists: user ? true : false });
};
