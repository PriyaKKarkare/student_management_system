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

const register = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		if (!name || !password || !role || !email) {
			return res.status(400).json({
				message: "Name, email, password and role are required"
			});
		}

		if (!["teacher", "parent"].includes(role)) {
			return res.status(403).json({
				message: "Only teachers and parents registration allowed",
			});
		}

		if (typeof password !== "string" || password.length < 8) {
			return res.status(400).json({
				message: "Password must be atleast 8 charachters",
			});
		}

		const normalizedName = name.trim();
		const normalizedEmail = email.trim().toLowerCase();

		console.log("Register email received:", normalizedEmail);

		if (!normalizedName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
			return res.status(400).json({
				message: "Please enter a valid name and email",
			});
		}

		const existingUser = await User.findOne({
			email: normalizedEmail,
		});

		console.log("Existing user found:", !!existingUser);

		if (existingUser) {
			return res.status(409).json({
				message: "Email is already registered",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await User.create({
			name: normalizedName,
			email: normalizedEmail,
			password: hashedPassword,
			role
		});

		return res.status(201).json({
			message: "Registration successful",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role
			}
		})
	} catch (error) {

		if (error.code === 11000) {
			return res.status(409).json({
				message: "Email is already registered"
			});
		}

		console.error("Registration Error: ", error.message);

		return res.status.json({
			message: "Interval server error"
		})
	}
}
module.exports = { login, register };