
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const ParentStudentRelationship = require("../models/ParentStudentRelationship");

const getParentAttendance = async (req, res) => {
	try {
		// 1. Parent active आहे का ते तपासा
		const parent = await User.findOne({
			_id: req.user.userId,
			role: "parent",
			isActive: true,
		});

		if (!parent) {
			return res.status(404).json({
				message: "Active parent not found",
			});
		}

		// 2. या Parent ची मुले शोधा
		const relationships = await ParentStudentRelationship.find({
			parentId: parent._id,
		}).select("studentId");

		const studentIds = relationships.map(
			(relationship) => relationship.studentId
		);

		if (studentIds.length === 0) {
			return res.status(200).json({
				message: "No children linked to this parent",
				count: 0,
				attendance: [],
			});
		}

		// 3. फक्त त्या मुलांची Attendance मिळवा
		const attendance = await Attendance.find({
			studentId: { $in: studentIds },
		})
			.populate("studentId", "name rollNumber admissionNumber")
			.populate("classId", "name section academicYear")
			.sort({ date: -1 });

		return res.status(200).json({
			message: "Parent attendance fetched successfully",
			count: attendance.length,
			attendance,
		});
	} catch (error) {
		console.error("Parent Attendance Error:", error);

		return res.status(500).json({
			message: "Failed to fetch attendance",
		});
	}
};

module.exports = { getParentAttendance };
