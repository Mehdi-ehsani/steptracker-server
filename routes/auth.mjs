import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validate } from "../middlewares/index.mjs";
import {
	userSchema,
	sendOtpSchema,
	loginSchema,
} from "../validation/index.mjs";
import { userModel } from "../models/userModel.mjs";
import { refreshTokenModel } from "../models/refreshTokenModel.mjs";
import { sendOtp, createOtp } from "../services/index.mjs";

const router = Router();

router.post("/register", validate(userSchema), async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const existingUser = await userModel.findOne({ email });

		if (existingUser) {
			return res.status(400).send({
				success: false,
				status: 400,
				message: "کابری با این ایمیل از قبل وجود دارد",
			});
		}
		const hassedPassword = await bcrypt.hash(password, 10);

		const user = await userModel.create({
			name,
			email,
			password: hassedPassword,
		});

		const { password: _, ...userWithoutPassword } = user.toObject();

		return res.status(201).send({
			success: true,
			status: 201,
			message: "کابر با موفقیت ساخته شد",
			data: userWithoutPassword,
		});
	} catch (error) {
		return res.status(500).send({
			success: false,
			status: 500,
			message: "خطایی رخ داده است",
			error: error.message,
		});
	}
});

router.post("/send-otp", validate(sendOtpSchema), async (req, res) => {
	try {
		const { email } = req.body;
		const existingUser = await userModel
			.findOne({ email })
			.select("+otp +otpExpiresAt");

		if (!existingUser) {
			return res.status(400).send({
				success: false,
				status: 400,
				message: "کابری با این ایمیل وجود ندارد",
			});
		}

		if (existingUser.verified) {
			return res.status(400).send({
				success: false,
				status: 400,
				message: "کابر با این ایمیل از قبل تایید شده است",
			});
		}

		if (existingUser.otp && existingUser.otpExpiresAt) {
			const now = new Date();
			if (existingUser.otpExpiresAt > now) {
				return res.status(400).send({
					success: false,
					status: 400,
					message: "کد اعتبار سنجی قبلی هنوز معتبر است. لطفاً صبر کنید",
				});
			}
		}

		const otp = createOtp();
		const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

		await sendOtp(email, otp);

		await userModel.findOneAndUpdate(
			{ email },
			{ $set: { otp, otpExpiresAt } },
			{ new: true }
		);

		return res.status(200).send({
			success: true,
			status: 200,
			message: "کد اعتبار سنجی با موفقیت ارسال شد",
		});
	} catch (error) {
		return res.status(500).send({
			success: false,
			status: 500,
			message: "خطایی رخ داده است",
			error: error.message,
		});
	}
});

router.post("/verify-otp", async (req, res) => {
	try {
		const { email, otp } = req.body;
		const existingUser = await userModel
			.findOne({ email })
			.select("+otp +otpExpiresAt");

		if (!existingUser) {
			return res.status(400).send({
				success: false,
				status: 400,
				message: "کابری با این ایمیل وجود ندارد",
			});
		}

		if (existingUser.verified) {
			return res.status(400).send({
				success: false,
				status: 400,
				message: "کابر با این ایمیل از قبل تایید شده است",
			});
		}

		const now = new Date();
		if (existingUser.otpExpiresAt < now) {
			return res.status(400).send({
				success: false,
				status: 400,
				message: "کد اعتبار سنجی منقضی شده",
			});
		}
		if (existingUser.otp !== otp) {
			return res.status(400).send({
				success: false,
				status: 400,
				message: "کد اعتبار سنجی معتبر نیست",
			});
		}

		await userModel.findOneAndUpdate(
			{ email },
			{ $set: { verified: true } },
			{ new: true }
		);

		const accessToken = jwt.sign(
			{ userId: existingUser._id },
			process.env.ACCESS_SECRET,
			{ expiresIn: "1h" }
		);
		const refreshToken = jwt.sign(
			{ userId: existingUser._id },
			process.env.REFRESH_SECRET,
			{ expiresIn: "7d" }
		);

		const refreshTokenExpiresAt = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000
		);
		await refreshTokenModel.create({
			userId: existingUser._id,
			token: refreshToken,
			expiresAt: refreshTokenExpiresAt,
		});

		return res.status(200).send({
			success: true,
			status: 200,
			message: "کابر با موفقیت تایید شد",
			data: {
				accessToken,
				refreshToken,
			},
		});
	} catch (error) {
		return res.status(500).send({
			success: false,
			status: 500,
			message: "خطایی رخ داده است",
			error: error.message,
		});
	}
});

router.post("/login", validate(loginSchema), async (req, res) => {
	try {
		const { email, password } = req.body;
		const existingUser = await userModel.findOne({ email }).select("+password");
		if (!existingUser) {
			return res.status(400).send({
				success: false,
				status: 400,
				message: "کابری با این ایمیل وجد ندارد",
			});
		}
		if (!existingUser.verified) {
			return res.status(400).send({
				success: false,
				status: 400,
				message: "کابر با این ایمیل تایید نشده است",
			});
		}
		const isPasswordValid = await bcrypt.compare(
			password,
			existingUser.password
		);
		if (!isPasswordValid) {
			return res.status(400).send({
				success: false,
				status: 400,
				message: "رمز عبور معتبر نیست",
			});
		}
		const accessToken = jwt.sign(
			{ userId: existingUser._id },
			process.env.ACCESS_SECRET,
			{ expiresIn: "1h" }
		);
		const refreshToken = jwt.sign(
			{ userId: existingUser._id },
			process.env.REFRESH_SECRET,
			{ expiresIn: "7d" }
		);

		const refreshTokenExpiresAt = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000
		);
		await refreshTokenModel.create({
			userId: existingUser._id,
			token: refreshToken,
			expiresAt: refreshTokenExpiresAt,
		});

		return res.status(200).send({
			success: true,
			status: 200,
			message: "کابر با موفقیت وارد شد",
			data: {
				accessToken,
				refreshToken,
			},
		});
	} catch (error) {
		return res.status(500).send({
			success: false,
			status: 500,
			message: "خطایی رخ داده است",
			error: error.message,
		});
	}
});

export { router as authRouter };
