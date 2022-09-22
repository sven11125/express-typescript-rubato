import { Request, Response } from 'express';
import { logger, enumerateErrorFormat } from '../utils/logger';

export const errorHandler = (error: any, req: Request, res: Response, next) => {

    if (res.headersSent) {
        return next(error)
    }

    if (error.isRouteError) {
        res.status(500).send({
            statusCode: error.statusCode,
            details: error.details,
        })
        logRouteError(req, res, error)
        return;
    }

    logRouteError(req, res, error)
    res.status(500).send()
}


const logRouteError = (req: Request, res: Response, error) => {

    let type = 'error';

    if (error.logAsInfo) {
        type = 'info'
    }

    logger.log(type, req.originalUrl, {
        error: enumerateErrorFormat(error),
        body: req.body,
        httpRequest: {
            status: res.statusCode,
            requestUrl: req.url,
            requestMethod: req.method,
            remoteIp: req.connection.remoteAddress,
        },
    });
}
