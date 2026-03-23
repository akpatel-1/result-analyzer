import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';



import { router } from './index.js';
import { errorHandler } from './module/error.handler.js';













export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(router);
app.use(errorHandler);
