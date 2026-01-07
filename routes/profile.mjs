import { Router } from "express";
import { authMiddleware } from "../middlewares/index.mjs";
import { userModel } from "../models/index.mjs";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
	try {
		const user = await userModel.findById(req.userId);
		res.status(200).send({
			success: true,
			status: 200,
			message: "User fetched successfully",
			data: user,
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			status: 500,
			message: "Internal server error",
			error: error.message,
		});
	}
});

export { router as profileRouter };
