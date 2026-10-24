const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
	{

		name:
		{
			type: String,
			required: true,
			trim: true
		},
		section: {
			type: String,
			required: true,
			trim: true
		},
		schoolId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "School",
			required: true
		},
		academicYear: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

classSchema.index(
	{
		schoolId: 1, name: 1, section: 1, academicYear: 1
	},
	{ unique: true }
);
module.exports = mongoose.model("Class", classSchema);