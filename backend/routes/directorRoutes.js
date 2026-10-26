const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { directorProfile, getDashboard } = require("../controllers/directorController");
const { assignTeacherToClass } = require("../controllers/teacherAssignmentController");
const { getAllAttendance } = require("../controllers/directorAttendanceController");
const {
	getAttendanceReport
} = require("../controllers/attendanceReportController");

const router = express.Router();

router.get("/profile", authMiddleware, allowRoles("director"), directorProfile);

router.get("/dashboard", authMiddleware, allowRoles('director'), getDashboard);

router.post("/assign-teacher", authMiddleware, allowRoles("director"), assignTeacherToClass);
router.get(
	"/attendance",
	authMiddleware,
	allowRoles("director"),
	getAllAttendance
);
router.get(
	"/attendance-report",
	authMiddleware,
	allowRoles("director"),
	getAttendanceReport
);

module.exports = router;