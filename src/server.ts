import 'reflect-metadata';
import express from 'express';
import { router } from './routes';
import './database';

const app = express();

app.use(express.json());
app.use(router);

app.get('/users', (req, res) => {
    return res.json({ messgae: "batatatatatatatat" });
})

const port = 3333;
app.listen(port, () => {
    console.log("Server is running on port " + port);
});