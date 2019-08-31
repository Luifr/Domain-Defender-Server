import express from 'express';
const router = express.Router();

import * as controller from '../controllers/player'

router.post('/score/save', controller.saveHighScore);

module.exports = router;