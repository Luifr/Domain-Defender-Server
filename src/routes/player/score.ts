import express from 'express';
const router = express.Router();

import * as controller from '../../controllers/player/score'

router.post('/', controller.saveHighScore);

router.get('/', controller.getHighScore);

module.exports = router;