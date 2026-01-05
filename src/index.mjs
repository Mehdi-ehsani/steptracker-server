import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { authRouter } from "../routes/index.mjs";
import { logger } from "../middlewares/index.mjs";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
	res.status(200).send("Hello World");
});

app.use("/api/auth", authRouter);

mongoose
	.connect(process.env.DB_URI)
	.then(() => {
		console.log("connected to DB");
		app.listen(PORT, () => {
			console.log(`server running in port:${PORT}`);
		});
	})
	.catch((error) => console.log(error));
