import { Router } from 'express';
import { getRec } from './Gemini.js';
import { rawgRouter } from './RAWG.js';
import { gameRouter } from './games-routes.js';
import { userRouter } from './user-routes.js';

const router = Router();

router.use('/Gemini', getRec);
router.use('/RAWG', rawgRouter);
router.use('/games', gameRouter);
router.use('/users', userRouter);

export default router;
