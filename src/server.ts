import { app } from "./app";

app.get('/users', (req, res) => res.json({ messgae: "batatatatatatatat" }));

const port = 3333;
app.listen(port, () => {
    console.log("Server is running on port " + port);
});