const TeacherClassAssignment = require("../models/TeacherClassAssignment");
const User = require("../models/User");
const Class = require("../models/Class");
const SchoolGroup = require("../models/SchoolGroup");

const assignTeacherToClass = async (req, res) => {
	try {
		const { teacherId, classId } = req.body;


		if (!teacherId || !classId) {
			return res.status(400).json({
				message: "teacherId and ClassId are required"
			});
		}

		const teacher = await User.findOne({
			_id: teacherId,
			role: "teacher",
			isActive: true
		});

		if (!teacher) {
			return res.status(404).json({
				message: "Active teacher not found"
			})
		}

		const schoolClass = await Class.findById(classId);

		if (!schoolClass) {
			return res.status(404).json({
				message: "Class not found"
			});
		}

		const group = await SchoolGroup.findOne({
			directorId: req.user.userId
		});

		console.log("req.user", req);

		if (!group) {
			return res.status(404).json({
				message: "Director School group not found"
			});
		}

		const school = await require("../models/School").findOne({
			_id: schoolClass.schoolId,
			groupId: group._id
		});

		if (!school) {
			return res.status(403).json({
				message: "you cannot assign teacher to another school group",
			})
		}

		const existingAssignment = await TeacherClassAssignment.findOne({
			teacherId,
			classId
		});

		if (existingAssignment) {
			return res.status(409).json({
				message: "Teacher is already assigned to this class"
			});
		}
		const assignment = await TeacherClassAssignment.create({
			teacherId,
			classId,
			schoolId: schoolClass.schoolId,
		});

		return res.status(201).json({
			message: "Teacher assigned to this class successfully",
			assignment,
		});

	} catch (error) {
		if (error.code === 11000) {
			return res.status(409).json({
				message: "Teacher already assigned to this class"
			});
		}
	};
}

module.exports = { assignTeacherToClass };