require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function resetDirectorPassword() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("MONGODB Connected");

		const email = process.env.DIRECTOR_EMAIL?.trim().toLowerCase();
		const password = process.env.DIRECTOR_PASSWORD;

		if (!email || !password) {
			throw new Error("DIRECTOR_EMAIL and DIRECTOR_PASSWORD is missing");
		}

		if (password.length < 12) {
			throw new Error("Director password must be at least 12 characters");
		}

		const user = await User.findOne({ email, role: "director" });

		if (!user) {
			throw new Error("Directir account not found");
		}

		user.password = await bcrypt.hash(password, 12);
		await user.save();
		console.log("Director Password hashed and updated successfully");
	} catch (error) {
		console.error("Password reset failed: ", error);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
} resetDirectorPassword();