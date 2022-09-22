import PromiseRouter from 'express-promise-router';
import { checkIfAuthenticated } from '../middleware/auth-middleware';
import { rateLimiter2R2M, rateLimiter5R1M } from '../middleware/rate-limiter'
import { fetchUser } from './fetch-user';
import { uploadPhoto } from './upload-photo';
import { logger } from '../utils/logger';
import { deleteAccount } from './delete-account';
import { updateUser } from './update-user';
import { fetchUserLight } from './fetch-user-light';
import { checkUserExists } from './check-user-exists';
import { errorHandler } from '../utils/error-handler';
import { minimumVersion } from './minimum-version';
import { isProduction } from '../utils/config';
import { uploadMiddleware } from '../middleware/upload-middleware'
import { login } from './login'
import { register } from './register'
import { updateProfile } from './profile'
import { saveGig, editGig, deleteGig } from './gigs'


const router = PromiseRouter();

// Log the routes.
router.use((req, res, next) => {
    logger.info(req.originalUrl);
    next();
});

// Used for the auto-dev finder.
router.get('/', (req, res) => { res.json({ status: 'ok' }) })

// Generic routes
router.post('/minimum-version', minimumVersion)

// User routes
router.post('/login', rateLimiter5R1M, login);
router.post('/register', rateLimiter2R2M, register);
router.post('/updateProfile', rateLimiter5R1M, updateProfile)
router.post('/saveGig', rateLimiter5R1M, saveGig)
router.post('/editGig', rateLimiter5R1M, editGig)
router.post('/deleteGig', rateLimiter5R1M, deleteGig)


router.post('/fetch-user', checkIfAuthenticated, fetchUser);
router.post('/fetch-user-light', fetchUserLight);
router.post('/upload-photo', rateLimiter5R1M, uploadMiddleware.single('avatar'), uploadPhoto);
router.post('/delete-account', checkIfAuthenticated, deleteAccount)
router.post('/update-user', checkIfAuthenticated, updateUser)
router.post('/check-user-exists', checkUserExists);

// More routes


if (!isProduction()) {
    // Helper routes
}


// Errors
router.use(errorHandler)

export default router;
