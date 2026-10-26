
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const TeacherClassAssignment = require("../models/TeacherClassAssignment");
const Student = require("../models/Student");

router.get("/students", authMiddleware, async (req, res) => {
	try {
		if (req.user.role !== "teacher") {
			return res.status(403).json({
				message: "Access denied. Teachers only.",
			});
		}

		const teacherId = req.user.userId ;

		if (!teacherId) {
			return res.status(401).json({
				message: "Teacher ID missing in token",
			});
		}

		const assignments = await TeacherClassAssignment.find({
			teacherId,
		}).select("classId schoolId");

		if (assignments.length === 0) {
			return res.status(404).json({
				message: "No class assigned to this teacher",
			});
		}

		const classIds = assignments.map((assignment) => assignment.classId);

		const students = await Student.find({
			classId: { $in: classIds },
			isActive: true,
		}).populate("classId", "name section academicYear");

		return res.status(200).json({
			message: "Students fetched successfully",
			count: students.length,
			students,
		});
	} catch (error) {
		console.error("Teacher students error:", error);

		return res.status(500).json({
			message: "Failed to fetch students",
		});
	}
});

module.exports = router;
