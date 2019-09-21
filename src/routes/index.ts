import express from 'express';
const router = express.Router();

import login from './login';
import player from './player';
import team from './team';
import * as upgradeController from '../controllers/upgrade';


router.use('/login', login);
router.use('/player', player);
router.use('/team', team);
router.get('/upgrade', upgradeController.get);

export default router;