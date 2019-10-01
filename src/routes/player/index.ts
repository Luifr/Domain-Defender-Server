import express from 'express';
const router = express.Router();
import { checkHash } from '../../authentication'

import * as controller from '../../controllers/player/index'

router.post('/', checkHash, controller.savePlayer);

router.get('/', controller.getPlayer);

router.post('/upgrade', controller.buyUpgrade);


export default router;