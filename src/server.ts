import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
const app = express();

let port = process.env.PORT || ((process.env.NODE_ENV == "production") ? 443 : 3000);

import { verifyToken, requestOrigin } from './authentication';
import router from './routes/index';
import rateLimit from "express-rate-limit";

const fs = require('fs');
const https = require('https');

const apiLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 1000
});


app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(apiLimiter);
app.use(requestOrigin);
app.use(verifyToken);

app.use('/', router);

if (process.env.NODE_ENV == "production") {

	let key = fs.readFileSync('/etc/letsencrypt/live/bixoquest.icmc.usp.br/privkey.pem');
	let cert = fs.readFileSync('/etc/letsencrypt/live/bixoquest.icmc.usp.br/fullchain.pem');

	let options = {
		key,
		cert
	};

	let server = https.createServer(options, app);
	server.listen(port, () => {
		console.log(`🚀  listening on ${port}!`);
		console.log(listEndpoints(app));
	});
}
else {
	app.listen(port, () => {
		console.log(`🚀  listening on port ${port}!`);
		console.log(listEndpoints(app));
	});
}