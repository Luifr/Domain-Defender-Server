import express from 'express';
const app = express();

let port = process.env.PORT || 3000;

import router from './routes/index';

app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.listen(port, () => { console.log(`🚀  listening on port ${port}!`); });
