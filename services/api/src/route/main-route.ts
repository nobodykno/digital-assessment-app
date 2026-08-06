import { Router } from 'express';

import Route from './index.js';

const router: Router = Router();

/**
 * Parent route to access all its child route of auth
 */
router.use('/api', Route.AuthRoute);

/**
 * Parent route to access all its child route of file
 */
router.use('/api/files', Route.FileRoute);

export default router;
