const mongoose = require("mongoose");

const TeacherClassAssignmentSchema = new mongoose.Schema(
	{
		teacherId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		classId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class",
			required: true
		},
		schoolId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "School",
			required: true
		},
	},
	{ timestamps: true }
);

TeacherClassAssignmentSchema.index(
	{
		teacherId: 1, classId: 1
	}, { unique: true }
);

module.exports = mongoose.model("TeacherClassAssignment", TeacherClassAssignmentSchema)