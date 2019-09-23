import express from 'express';
const router = express.Router();

import auth from './auth';
import player from './player';
import * as upgradeController from '../controllers/upgrade';
import { getHighScores } from '../model/player'


router.use('/', auth);
router.use('/player', player);
router.get('/upgrade', upgradeController.get);
router.get('/highScores', (_, res) => {
	return res.json({ highScores: getHighScores() });
});

export default router;