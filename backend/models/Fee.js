const mongoose = require("mongoose")

const feeSchema = new mongoose.Schema({
	studentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Student",
		required: true,
	},
	schoolId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "School",
		required: true
	},
	academicYear: {
		type: String,
		required: true
	},
	totalFees: {
		type: Number,
		required: true,
		min: 0
	},
	paidAmount: {
		type: Number,
		default: "",
		min: 0
	},
	dueDate: {
		type: Date
	},
	status: {
		type: String,
		enum: ["pending", "partial", "paid"],
		default: "pending"
	},
},
	{ timestamps: true }
);

feeSchema.index(
	{ studentId: 1, academicYear: 1 },
	{ unique: true }
);

feeSchema.pre("validate", function () {
	if (
		this.paidAmount != null &&
		this.totalFees != null &&
		this.paidAmount > this.totalFees
	) {
		this.invalidate("paidAmount", "Paid amount cannot axceed total fees");
	}

	if (this.paidAmount === this.totalFees && this.totalFees != null) {
		this.status = "paid";
	} else if (this.paidAmount > 0) {
		this.status = "partial";
	} else {
		this.status = "pending"
	}
});

module.exports = mongoose.model("Fee", feeSchema);