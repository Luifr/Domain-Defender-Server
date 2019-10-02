import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
const app = express();

let port = process.env.PORT || 443;

import { verifyToken, requestOrigin } from './authentication';
import router from './routes/index';
import rateLimit from "express-rate-limit";

const https = require('https');
const fs = require('fs');
var key = fs.readFileSync('/etc/letsencrypt/live/bixoquest.icmc.usp.br/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/bixoquest.icmc.usp.br/fullchain.pem');

let options = {
	key,
	cert
};

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

// app.listen(port, () => {
// 	console.log(`🚀  listening on port ${port}!`);
// 	console.log(listEndpoints(app));
// });

let server = https.createServer(options, app);

server.listen(port, () => {
	console.log(`🚀  listening on ${port}!`);
	console.log(listEndpoints(app));
});
