import express from 'express';
const listEndpoints = require('express-list-endpoints')
const app = express();


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

app.use(express.urlencoded({ extended: false }));


app.use(requestOrigin);
app.use(verifyToken);

app.use('/', router);

let server = https.createServer(options, app);

server.listen(port, () => {
console.log(`🚀  listening on ${port}!`);
	console.log(listEndpoints(app));
});
