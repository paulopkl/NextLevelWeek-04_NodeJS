import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";
import createConnection from './database';
import { router } from './routes';
import { AppErrors } from './errors/AppErrors';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    // If error is instace of AppError
    if (err instanceof AppErrors) return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ status: "Error", message: `Internal Server error ${err.message}` });
})

export { app }