import { Router } from 'express';
import apiRoutes from './api/index.js';
import authRoutes from './auth-routes.js';
import { authenticateToken } from '../middleware/auth.js';
import { newUserRouter } from './registerNewUser.js';

const router = Router();

router.use('/api', authenticateToken, apiRoutes);
router.use('/auth', authRoutes);
router.use('/newUser', newUserRouter);

export default router;
