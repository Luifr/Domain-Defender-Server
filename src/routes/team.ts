import express from 'express';
const router = express.Router();

import * as controller from '../controllers/team';

router.get('/', controller.score);


module.exports = router;