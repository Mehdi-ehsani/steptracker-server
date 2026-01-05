import z from "zod";

export const userSchema = z.object({
	name: z
		.string("Name is required")
		.min(3, "Name must be at least 3 characters long")
		.max(20, "Name must be less than 20 characters long"),
	email: z.string("Email is required").email("Invalid email"),
	password: z
		.string("Password is required")
		.min(8, "Password must be at least 8 characters long"),
});
