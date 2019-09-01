import express from 'express';
const router = express.Router();

router.use('/login', require('./login'));
router.use('/player', require('./player/index'));
router.use('/team', require('./team'));


export default router;