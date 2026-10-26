const mongoose = require("mongoose");

const schoolGroupSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		directorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("SchoolGroup", schoolGroupSchema);

