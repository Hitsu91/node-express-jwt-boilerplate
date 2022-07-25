require('dotenv').config();
import config from 'config';
import express from 'express';
import connectToDb from '../utils/connectToDb';
import log from '../utils/logger';
import deserializeUser from './middleware/deserializeUser';
import router from './routes';

const app = express();

app.use(express.json());
app.use(deserializeUser);

app.use(router);

const port = config.get<number>('port');
app.listen(port, () => {
  log.info(`App running at port: ${port}`);
  connectToDb();
});
