const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		console.log("MONGODB Atlas connected successfully");
	} catch (error) {
		console.error("MongoDB connected Failed", error.message);
		process.exit();
	}
};

module.exports = connectDB;