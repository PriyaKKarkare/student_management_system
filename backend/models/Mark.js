const mongoose = require("mongoose");
const School = require("./School");

const markSchema = new mongoose.Schema(
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
		examId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Exam",
			required: true
		},
		subject: {
			type: String,
			required: true,
			trim: true
		},
		obtainedMark: {
			type: Number,
			required: true,
			min: 0
		},
		totalMarks: {
			type: Number,
			required: true,
			min: 1
		},
		enteredBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
	},
	{ timestamps: true }
);

markSchema.index(
	{ studentId: 1, examId: 1, subject: 1 },
	{ unique: true }
);

markSchema.pre("validate", function () {
	if (
		this.obtainedMark != null &&
		this.totalMarks != null &&
		this.obtainedMark > this.totalMarks
	) {
		this.invalidate(
			"obtainedMark",
			"Obtained marks cannot exceed total marks"
		);
	}
}
);

module.exports = mongoose.model("Mark", markSchema);