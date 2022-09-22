import { Request, Response } from 'express';


/**
 * @api {post} api/fetch-user Fetch User
 * @apiDescription Fetches users model using auth.
 * @apiName fetchUser
 * @apiGroup User
 * @apiPermission [authenticated]
 * @apiInterface (../models/user.ts) {User}
 */
export const fetchUser = async (req: Request, res: Response) => {
    return res.status(200).json(req.user);
};
