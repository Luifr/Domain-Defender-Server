import express from 'express';
const router = express.Router();

import * as controller from '../controllers/login';

router.post('/', controller.login);


export default router;