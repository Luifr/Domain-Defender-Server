import express from 'express';
const router = express.Router();

router.use('/login', require('./login'));
router.use('/player', require('./player/index'));

export default router;