const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Email and password required"
			});
		}

		const user = await User.findOne({
			email: email.trim().toLowerCase(),
			isActive: true
		}).
			select("+password");

		if (!user) {
			return res.status(401).json({
				message: "Invalid Email or Password"
			});
		}

		const isPasswordValid = await bcrypt.compare(
			password, user.password
		);

		console.log("Password valid:", isPasswordValid);


		if (!isPasswordValid) {
			return res.status(401).json({
				message: "Invalid Email or Password"
			})
		}

		if (!process.env.JWT_SECRET) {
			throw new Error("JWT_SECRET is missing in .env");
		}

		const token = jwt.sign(
			{
				userId: user._id.toString(),
				role: user.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		return res.status(200).json({
			message: "Login Successfully",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				groupId: user.groupId,
				schoolId: user.schoolId
			},
		});
		
	} catch (error) {
		console.error("Login Error: ", error.message);

		return res.status(500).json({
			message: "Internal Server Error"
		});
	}
};

module.exports = { login };