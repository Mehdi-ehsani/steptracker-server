import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger/swagger.mjs";
import { authRouter, profileRouter } from "../routes/index.mjs";
import { logger } from "../middlewares/index.mjs";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(logger);

/**
 * @swagger
 * /:
 *   get:
 *     summary: صفحه اصلی API
 *     tags: [General]
 *     responses:
 *       200:
 *         description: پیام خوش‌آمدگویی
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello World
 */
app.get("/", (req, res) => {
	res.status(200).send("Hello World");
});

// Swagger UI
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

mongoose
	.connect(process.env.DB_URI)
	.then(() => {
		console.log("connected to DB");
		app.listen(PORT, () => {
			console.log(`server running in port:${PORT}`);
		});
	})
	.catch((error) => console.log(error));
