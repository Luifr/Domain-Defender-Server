import express from 'express';
const router = express.Router();

import * as controller from '../../controllers/player/index'

router.post('/', controller.savePlayer);

router.get('/', controller.getPlayer);

router.post('/upgrade', controller.buyUpgrade);


export default router;