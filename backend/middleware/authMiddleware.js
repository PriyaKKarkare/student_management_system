const jwt = require("jsonwebtoken");

const authMiddlware = (req, res, next) => {

	const authHeader = req.headers.authorization;
	console.log("authHeader", authHeader);

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			message: "Authorization token missing",
		});
	}

	const token = authHeader.split(" ")[1];

	console.log("token", token);
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({
			message: "Invalid or expired token",
		});
	}
};

module.exports = authMiddlware;