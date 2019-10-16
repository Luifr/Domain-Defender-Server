// import express from 'express';
// const listEndpoints = require('express-list-endpoints')
// const app = express();

// let port = process.env.PORT || 3000;

// import { verifyToken, requestOrigin } from './authentication';
// import router from './routes/index';
// import rateLimit from "express-rate-limit";

// const apiLimiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 300
// });

import db from './dbManager'

// db.players.update({ username: "Luii" }, { $set: { username: "Lui", money: 60 } })
(async () => {
	console.log(await db.players.findAsync({ username: "Lui" }));
	let moneyMultiply = (await db.configs.findOneAsync({ name: "moneyMultiply" })).value;
	console.log(moneyMultiply);
}
)();

// app.use(express.urlencoded({ extended: false }));

// app.use(apiLimiter);
// app.use(requestOrigin);
// app.use(verifyToken);
// app.use('/', router);

// app.listen(port, () => {
// 	console.log(`🚀  listening on port ${port}!`);
// 	console.log(listEndpoints(app));
// });