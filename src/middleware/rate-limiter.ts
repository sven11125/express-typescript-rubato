import * as rateLimit from 'express-rate-limit'
import { isTestMode } from '../..';
import { RouteError } from '../utils/route-error';

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const rateLimitReachStatusCode = 'rate-limit-reached';
const rateLimitReachStatusMessage = 'The rate limit has been reached';

/**
 * 2R = 2 Requests
 * 2M = 2 Minutes
 */
export const rateLimiter2R2M = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 2,
    handler: (req, res, next) => {
        if (isTestMode()) {
            next()
            return
        }
        throw new RouteError(rateLimitReachStatusCode, rateLimitReachStatusMessage)
    }
});


/**
 * 2R = 2 Requests
 * 2M = 2 Minutes
 */
export const rateLimiter5R1M = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 2,
    handler: (req, res, next) => {
        if (isTestMode()) {
            next()
            return
        }
        throw new RouteError(rateLimitReachStatusCode, rateLimitReachStatusMessage)
    }
});
