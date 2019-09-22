import express from 'express';
const router = express.Router();

import auth from './auth';
import player from './player';
import * as upgradeController from '../controllers/upgrade';


router.use('/', auth);
router.use('/player', player);
router.get('/upgrade', upgradeController.get);

export default router;