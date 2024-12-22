import dotenv from "dotenv";
import configs from "../knexfile";

const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envPath });

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import Knex from "knex";
import { Model } from 'objection';
import authRoute from '../routes/auth.route';

const app: Express = express();

const environtment = process.env.NODE_ENV || 'development';
const knexConfig = configs[environtment];

const knexInstance = Knex(knexConfig);
Model.knex(knexInstance)

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use('/api/v1/auth', authRoute)

app.get('/', (req: Request, res: Response) => {
    res.send(`Express + Typescript server ${port}`);
})

export default app;