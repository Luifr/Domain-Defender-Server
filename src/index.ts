import express from 'express';
const listEndpoints = require('express-list-endpoints')
const app = express();

import cors from 'cors';

const https = require('https');
const fs = require('fs');
var key = fs.readFileSync('/etc/letsencrypt/live/bixoquest.icmc.usp.br/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/bixoquest.icmc.usp.br/fullchain.pem');

let options = {
	key,
	cert
};

let port = process.env.PORT || 443;

import { verifyToken, requestOrigin } from './authentication';
import router from './routes/index';
import rateLimit from "express-rate-limit";


const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 300
});

// only apply to requests that begin with /api/


app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(apiLimiter);
app.use(requestOrigin);
app.use(verifyToken);


app.use('/', router);

let server = https.createServer(options, app);

server.listen(port, () => {
console.log(`🚀  listening on ${port}!`);
	console.log(listEndpoints(app));
});
