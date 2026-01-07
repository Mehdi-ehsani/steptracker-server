import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Step Tracker API",
			version: "1.0.0",
			description: "API documentation for Step Tracker Server",
			contact: {
				name: "API Support",
			},
		},
		tags: [
			{
				name: "General",
				description: "روت‌های عمومی",
			},
			{
				name: "Authentication",
				description: "روت‌های احراز هویت و مدیریت کاربر",
			},
			{
				name: "Profile",
				description: "روت های پروفایل کاربر",
			},
		],
		servers: [
			{
				url: `http://localhost:${process.env.PORT || 3000}`,
				description: "Development server",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				Error: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: false,
						},
						status: {
							type: "number",
							example: 400,
						},
						message: {
							type: "string",
							example: "خطایی رخ داده است",
						},
						error: {
							type: "string",
							example: "Error message",
						},
					},
				},
				Success: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: true,
						},
						status: {
							type: "number",
							example: 200,
						},
						message: {
							type: "string",
							example: "عملیات با موفقیت انجام شد",
						},
					},
				},
				User: {
					type: "object",
					properties: {
						_id: {
							type: "string",
							example: "507f1f77bcf86cd799439011",
						},
						name: {
							type: "string",
							example: "علی احمدی",
						},
						email: {
							type: "string",
							example: "ali@example.com",
						},
						verified: {
							type: "boolean",
							example: true,
						},
						createdAt: {
							type: "string",
							format: "date-time",
						},
						updatedAt: {
							type: "string",
							format: "date-time",
						},
					},
				},
				RegisterRequest: {
					type: "object",
					required: ["name", "email", "password"],
					properties: {
						name: {
							type: "string",
							minLength: 3,
							maxLength: 20,
							example: "علی احمدی",
							description: "نام کاربر (حداقل 3 و حداکثر 20 کاراکتر)",
						},
						email: {
							type: "string",
							format: "email",
							example: "ali@example.com",
							description: "ایمیل کاربر",
						},
						password: {
							type: "string",
							minLength: 8,
							example: "password123",
							description: "رمز عبور (حداقل 8 کاراکتر)",
						},
					},
				},
				RegisterResponse: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: true,
						},
						status: {
							type: "number",
							example: 201,
						},
						message: {
							type: "string",
							example: "کابر با موفقیت ساخته شد",
						},
						data: {
							$ref: "#/components/schemas/User",
						},
					},
				},
				SendOtpRequest: {
					type: "object",
					required: ["email"],
					properties: {
						email: {
							type: "string",
							format: "email",
							example: "ali@example.com",
							description: "ایمیل کاربر",
						},
					},
				},
				SendOtpResponse: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: true,
						},
						status: {
							type: "number",
							example: 200,
						},
						message: {
							type: "string",
							example: "کد اعتبار سنجی با موفقیت ارسال شد",
						},
					},
				},
				VerifyOtpRequest: {
					type: "object",
					required: ["email", "otp"],
					properties: {
						email: {
							type: "string",
							format: "email",
							example: "ali@example.com",
							description: "ایمیل کاربر",
						},
						otp: {
							type: "string",
							example: "123456",
							description: "کد اعتبار سنجی",
						},
					},
				},
				VerifyOtpResponse: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: true,
						},
						status: {
							type: "number",
							example: 200,
						},
						message: {
							type: "string",
							example: "کابر با موفقیت تایید شد",
						},
						data: {
							type: "object",
							properties: {
								accessToken: {
									type: "string",
									example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
								},
								refreshToken: {
									type: "string",
									example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
								},
							},
						},
					},
				},
				LoginRequest: {
					type: "object",
					required: ["email", "password"],
					properties: {
						email: {
							type: "string",
							format: "email",
							example: "ali@example.com",
							description: "ایمیل کاربر",
						},
						password: {
							type: "string",
							example: "password123",
							description: "رمز عبور",
						},
					},
				},
				LoginResponse: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: true,
						},
						status: {
							type: "number",
							example: 200,
						},
						message: {
							type: "string",
							example: "کابر با موفقیت وارد شد",
						},
						data: {
							type: "object",
							properties: {
								accessToken: {
									type: "string",
									example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
								},
								refreshToken: {
									type: "string",
									example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
								},
							},
						},
					},
				},
				RefreshTokenRequest: {
					type: "object",
					required: ["refreshToken"],
					properties: {
						refreshToken: {
							type: "string",
							example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
							description: "توکن رفرش برای دریافت توکن دسترسی جدید",
						},
					},
				},
				RefreshTokenResponse: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: true,
						},
						status: {
							type: "number",
							example: 200,
						},
						message: {
							type: "string",
							example: " توکن دسترسی گرفته شد",
						},
						data: {
							type: "object",
							properties: {
								accessToken: {
									type: "string",
									example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
								},
								refreshToken: {
									type: "string",
									example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
								},
							},
						},
					},
				},
				ProfileResponse: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: true,
						},
						status: {
							type: "number",
							example: 200,
						},
						message: {
							type: "string",
							example: "پروفایل دریافت شده",
						},
						data: {
							$ref: "#/components/schemas/User",
						},
					},
				},
				LogoutResponse: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: true,
						},
						status: {
							type: "number",
							example: 200,
						},
						message: {
							type: "string",
							example: "کاربر با موفقیت از همه دستگاه‌ها خارج شد",
						},
					},
				},
			},
		},
	},
	apis: [join(rootDir, "routes", "*.mjs"), join(rootDir, "src", "index.mjs")],
};

export const swaggerSpec = swaggerJsdoc(options);
