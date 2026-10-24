const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
	{
		title: {
			type: String, required: true, trim: true
		},
		message: {
			type: String, required: true, trim: true
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		groupId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "SchoolGroup", default: null
		},
		schoolId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "School", default: null
		},
		classId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class", default: null
		},
		audience: {
			type: String,
			enum: ["all_schools", "school", "class"],
			required: true
		},
		expiresAt: {
			type: Date,
			default: null
		},
		isActive: {
			type: Boolean,
			default: true
		},
	},
	{ timestamps: true }
);

noticeSchema.index(
	{
		groupId: 1,
		schoolId: 1,
		classId: 1,
		createdAt: -1
	}
);

module.exports = mongoose.model("Notice", noticeSchema);