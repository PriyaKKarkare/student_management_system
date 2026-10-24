const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
	{
		studentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Student",
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
		teacherId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		date: {
			type: Date,
			required: true
		},
		status: {
			type: String,
			enum: ["absent", "present", "leave", "late"],
			required: true
		},
		remarks: {
			type: String,
			trim: true,
			default: ""
		},
	},
	{ timestamps: true }
);

attendanceSchema.index(
	{ studentId: 1, date: 1 },
	{ unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);