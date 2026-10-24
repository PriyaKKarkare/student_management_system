require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const SchoolGroup = require("../models/SchoolGroup");
const School = require("../models/School");

const createSchools = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("MongoDB Connected");

		const directorEmail = process.env.DIRECTOR_EMAIL?.toLowerCase();

		const director = await User.findOne({
			email: directorEmail,
			role: "director"
		});

		if (!director) {
			throw new Error("Director not Found. Check DIRECTOR_EMAIL in .env");
		}

		const group = await SchoolGroup.findOne({
			directorId: director._id,
		});

		if (!group) {
			throw new Error("School group not found");
		}
		const schoolData = [
			{
				name: "SunRise Public School",
				address: "Thane, Maharashtra"
			}, {
				name: "Green Valley School",
				address: "Navi Mumbai , Maharashtra"
			}, {
				name: "Bright Future School",
				address: "Kalyan Maharashtra"
			},
		]

		for (const item of schoolData) {
			const existingSchool = await School.findOne({
				name: item.name,
				groupId: group._id
			});

			if (existingSchool) {
				console.log(`${item.name} already exists. skipping`);
				continue;
			}
			await School.create({
				...item,
				groupId: group._id
			});
			console.log(`${item.name} created successfully`)
		}
		console.log("School Setup Completed");
	} catch (error) {
		console.error("Setup failed: ", error.message);
		process.exitcode = 1;
	} finally {
		await mongoose.disconnect();
	}
};

createSchools();