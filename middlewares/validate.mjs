export const validate = (schema) => {
	return (req, res, next) => {
		const { error } = schema.safeParse(req.body);
		if (error) {
			return res
				.status(400)
				.send({ error: error.issues.map((issue) => issue.message).join(", ") });
		}
		next();
	};
};
