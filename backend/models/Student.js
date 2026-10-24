const mongoose = require("mongoose")
const studentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		rollNumber: {
			type: String,
			required: true,
			trim: true
		},
		dateOfBirth: {
			type: Date
		},
		schoolId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "School",
			required: true
		},
		classId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class",
			required: true
		},
		admissionNumber: {
			type: String,
			required: true,
			trim: true
		},
		isActive: {
			type: Boolean,
			default: true
		},
	},
	{ timestamps: true }
);

studentSchema.index({
	schoolId: 1, admissionNumber: 1
}, { unique: true });

studentSchema.index({
	classId: 1, rollNumber: 1
}, { unique: 1 });

module.exports = mongoose.model("Student", studentSchema);