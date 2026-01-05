import nodemailer from "nodemailer";

export const sendOtp = async (email, otp) => {
	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		await transporter.verify();

		const mailOptions = {
			from: `"Step Tracker" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: "کد تأیید OTP",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl; text-align: right;">
					<h2 style="color: #333;">تأیید کد یکبار مصرف</h2>
					<p style="color: #666; font-size: 16px;">کد تأیید شما:</p>
					<div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
						<h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
					</div>
					<p style="color: #666; font-size: 14px;">این کد تا 2 دقیقه معتبر است. لطفاً این کد را با کسی به اشتراک نگذارید.</p>
				</div>
			`,
		};

		const info = await transporter.sendMail(mailOptions);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Error sending OTP email:", error);
		throw new Error("Failed to send OTP email");
	}
};
