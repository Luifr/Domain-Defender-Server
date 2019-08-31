import express from 'express';
const router = express.Router();

router.use('/login', require('./login'));
router.use('/player', require('./player'));

export default router;