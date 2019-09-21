import express from 'express';
const listEndpoints = require('express-list-endpoints')
const app = express();

let port = process.env.PORT || 3000;

import { verifyToken } from './authentication';
import router from './routes/index';

app.use(express.urlencoded({ extended: false }));


app.use(verifyToken);

app.use('/', router);

app.listen(port, () => {
	console.log(`🚀  listening on port ${port}!`);
	console.log(listEndpoints(app));
});