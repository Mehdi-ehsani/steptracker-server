import { Router } from "express";
import { authMiddleware } from "../middlewares/index.mjs";
import { userModel } from "../models/index.mjs";

const router = Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: دریافت پروفایل کاربر
 *     description: اطلاعات پروفایل کاربر احراز هویت شده را برمی‌گرداند
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: پروفایل کاربر با موفقیت دریافت شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         description: خطا در احراز هویت (توکن نامعتبر یا منقضی شده)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authMiddleware, async (req, res) => {
	try {
		const user = await userModel.findById(req.userId);
		res.status(200).send({
			success: true,
			status: 200,
			message: "پروفایل دریافت شده",
			data: user,
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			status: 500,
			message: "خطای سرور",
			error: error.message,
		});
	}
});

export { router as profileRouter };
