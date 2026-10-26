const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const directorRoutes = require("./routes/directorRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const parentRoutes = require("./routes/parentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/director", directorRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/parent", parentRoutes);


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