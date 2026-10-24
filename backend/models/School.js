const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		address: {
			type: String,
			required: true,
			trim: true,
		},
		groupId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "SchoolGroup",
			required: true
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("School", schoolSchema);