import express from 'express';
const router = express.Router();

router.use('/score', require('./score'))

module.exports = router;