import { Request, Response } from 'express';
import { MinimuimVersion } from '../models/minimum-version'

/**
 * @api {post} api/minimum-version Minimum version
 * @apiDescription Checks for the minimum build version supported. Forces users to update. Shows update screen.
 * @apiName minimumVersion
 * @apiGroup Util
 * @apiInterface (../models/minimum-version.ts) {MinimuimVersion}
 **/
export const minimumVersion = async (req: Request, res: Response) => {
    const minVersion: MinimuimVersion = {
        customTitle: 'Please update',
        customMessage: 'We got some great updates incoming.',
        minBuildNumber: 1,
    }
    return res.json(minVersion);
};
