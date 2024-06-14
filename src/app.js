import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import RouterHome from './routes/index.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(RouterHome);

export default app;
