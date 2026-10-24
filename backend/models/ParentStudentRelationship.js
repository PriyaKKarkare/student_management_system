const mongoose = require("mongoose");

const ParentStudentRelationshipSchema = new mongoose.Schema({
	parentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	studentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Student",
		required: true
	},
	relationship: {
		type: String,
		enum: ["father", "mother", "guardian"],
		required: true
	},
}, { timestamps: true }
);

ParentStudentRelationshipSchema.index(
	{ parentId: 1, studentId: 1 },
	{ unique: true }
);

module.exports = mongoose.model("ParentStudentRelationship", ParentStudentRelationshipSchema);