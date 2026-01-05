import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		otp: {
			type: String,
			required: false,
            select: false,
		},
		otpExpiresAt: {
			type: Date,
			required: false,
			select: false,
		},
		verified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const userModel = mongoose.model("users", userSchema);
