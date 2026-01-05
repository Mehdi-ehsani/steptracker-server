import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.status(200).send("Hello World");
})

mongoose
	.connect(process.env.DB_URI)
	.then(() => {
		console.log("connected to DB");
		app.listen(PORT, () => {
			console.log(`server running in port:${PORT}`);
		});
	})
	.catch((error) => console.log(error));
