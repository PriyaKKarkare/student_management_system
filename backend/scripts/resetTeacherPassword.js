
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const resetTeacherPassword = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("MongoDB Connected");

		const email = "teacher.test2@example.com";
		const newPassword = "Teacher@123456";

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		const teacher = await User.findOneAndUpdate(
			{
				email,
				role: "teacher",
			},
			{
				$set: { password: hashedPassword },
			},
			{
				new: true,
			}
		);

		if (!teacher) {
			console.log("Teacher not found");
			return;
		}

		console.log("Teacher password reset successfully");
		console.log("Teacher email:", teacher.email);
	} catch (error) {
		console.log("Password reset failed:", error.message);
	} finally {
		await mongoose.disconnect();
	}
};

resetTeacherPassword();
