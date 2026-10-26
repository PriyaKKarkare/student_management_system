
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
	getParentAttendance,
} = require("../controllers/parentAttendanceController");

const router = express.Router();

router.get(
	"/attendance",
	authMiddleware,
	allowRoles("parent"),
	getParentAttendance
);

module.exports = router;
