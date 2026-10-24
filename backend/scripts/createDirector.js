require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const SchoolGroup = require("../models/SchoolGroup");

const createDirector = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("MongoDb Connected");

		const name = process.env.DIRECTOR_NAME;
		const email = process.env.DIRECTOR_EMAIL?.toLowerCase();
		const password = process.env.DIRECTOR_PASSWORD;

		if (!name || !email || !password) {
			throw new Error(
				"Set DIRECTOR_NAME, DIRECTOR_EMAIL and DIREACTOR_PASSWORD in .env"
			);
		}
		if (password.length < 12) {
			throw new Error("Director password must be atleast 12 characters");
		}
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new Error("This Email is already registered");
		}

		const hashPassword = await bcrypt.hash(password, 12);

		const director = await User.create({
			name,
			email,
			password: hashPassword,
			role: "director"
		});
		try {
			await SchoolGroup.create({
				name: "Main School Group",
				directorId: director._id,
			});
		} catch (error) {
			await User.deleteOne({ _id: director._id });
			throw error;
		}
		console.log("Director and School Group are created successfully");
		console.log("Director email: ", email);
	} catch (error) {
		console.log("SetUp failed: ", error.message);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
};

createDirector();