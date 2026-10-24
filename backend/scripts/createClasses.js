require("dotenv").config();

const mongoose = require("mongoose");
const Class = require("../models/Class");
const School = require("../models/School");

const createClasses = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("MongoDB Connected");

		const Schools = await School.find({
			name: {
				$in: [
					"SunRise Public School",
					"Green Valley School",
					"Bright Future School"
				],
			},
		});

		if (Schools.length !== 3) {
			throw new Error("Expected 3 schools, Please run createSchools.js first");
		};

		const classData = [
			{ name: "8", section: "A" },
			{ name: "9", section: "A" },
			{ name: "10", section: "B" }
		];

		for (const school of Schools) {
			for (const item of classData) {
				const existingClass = await Class.findOne({
					schoolId: school._id,
					name: item.name,
					section: item.section,
					academicYear: "2026-2027"
				});

				if (existingClass) {
					console.log(`${school.name} - Class ${item.name}-${item.section} already exists`);
					continue;
				}

				await Class.create({
					...item,
					schoolId: school._id,
					academicYear: "2026-2027"
				});

				console.log(
					`${school.name} - Class ${item.name}-${item.section} created`
				);
			}
		}

		console.log("Class setup completed");

	} catch (error) {
		console.log("Setup failed: ", error.message);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
};

createClasses();