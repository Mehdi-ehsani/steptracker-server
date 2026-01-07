import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
	try {
		let token = req.headers.authorization;
		if (!token) {
			return res.status(401).json({
				success: false,
				status: 401,
				message: "Unauthorized, Token is required",
			});
		}
		if (token.startsWith("Bearer ")) {
			token = token.slice(7, token.length).trimLeft();
		}
		const verified = jwt.verify(token, process.env.ACCESS_SECRET);
		if (!verified) {
			return res.status(401).json({
				success: false,
				status: 401,
				message: "Unauthorized, Token is not valid",
			});
		}
		req.userId = verified.userId;
		next();
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({
				success: false,
				status: 401,
				message: "Unauthorized, Invalid token",
				error: error.message,
			});
		}
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({
				success: false,
				status: 401,
				message: "Unauthorized, Token has expired",
				error: error.message,
			});
		}
		return res.status(500).json({
			success: false,
			status: 500,
			message: "Internal server error",
			error: error.message,
		});
	}
};
