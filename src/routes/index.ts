import express from 'express';
const router = express.Router();

import login from './login';
import player from './player';
import team from './team';


router.use('/login', login);
router.use('/player', player);
router.use('/team', team);


export default router;