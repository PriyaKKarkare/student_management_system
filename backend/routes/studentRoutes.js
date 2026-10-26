
const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");

// Create Student API
router.post("/", authMiddleware, async (req, res) => {
	try {
		const {
			name,
			rollNumber,
			dateOfBirth,
			schoolId,
			classId,
			admissionNumber
		} = req.body;

		if (
			!name ||
			!rollNumber ||
			!schoolId ||
			!classId ||
			!admissionNumber
		) {
			return res.status(400).json({
				message: "Required fields are missing"
			});
		}

		const student = await Student.create({
			name,
			rollNumber,
			dateOfBirth,
			schoolId,
			classId,
			admissionNumber
		});

		return res.status(201).json({
			message: "Student created successfully",
			student
		});
	} catch (error) {
		console.error("Create Student Error:", error);

		return res.status(500).json({
			message: "Failed to create student",
			error: error.message
		});
	}
});

module.exports = router;
