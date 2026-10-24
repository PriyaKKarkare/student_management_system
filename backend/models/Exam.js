const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		schoolId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "School",
			required: true,
		},
		classId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class",
			required: true,
		},
		academicYear: {
			type: String,
			required: true
		},
		examDate: {
			type: Date
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User"
		},
		isActive: {
			type: Boolean,
			default: true
		},
	},
	{ timestamps: true }
);

examSchema.index(
	{ schoolId: 1, classId: 1, academicYear: 1 },
);

module.exports = mongoose.model("Exam", examSchema);