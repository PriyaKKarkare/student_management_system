const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send("School Management System API is running");
})

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	await connectDB();

	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}
startServer();