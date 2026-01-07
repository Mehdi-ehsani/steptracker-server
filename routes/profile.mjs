import { Router } from "express";
import { authMiddleware } from "../middlewares/index.mjs";
import { refreshTokenModel, userModel } from "../models/index.mjs";

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

/**
 * @swagger
 * /api/profile/logout:
 *   post:
 *     summary: خروج کاربر از همه دستگاه‌ها
 *     description: همه refresh token‌های کاربر را حذف می‌کند و کاربر از همه دستگاه‌ها خارج می‌شود
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: کاربر با موفقیت از همه دستگاه‌ها خارج شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       401:
 *         description: خطا در احراز هویت
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
router.post("/logout", authMiddleware, async (req, res) => {
	try {
		const result = await refreshTokenModel.deleteMany({ userId: req.userId });

		if (result.deletedCount === 0) {
			return res.status(200).send({
				success: true,
				status: 200,
				message: "کاربر از قبل خارج شده است",
			});
		}

		return res.status(200).send({
			success: true,
			status: 200,
			message: "کاربر با موفقیت از همه دستگاه‌ها خارج شد",
		});
	} catch (error) {
		return res.status(500).send({
			success: false,
			status: 500,
			message: "خطای سرور",
			error: error.message,
		});
	}
});

export { router as profileRouter };
