
const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");
const TeacherClassAssignment = require("../models/TeacherClassAssignment");

// Mark Attendance
router.post("/", authMiddleware, async (req, res) => {
	try {
		if (req.user.role !== "teacher") {
			return res.status(403).json({
				message: "Access denied. Teachers only."
			});
		}
		const {
			studentId,
			classId,
			schoolId,
			date,
			status,
			remarks
		} = req.body;

		if (!studentId || !classId || !schoolId || !date || !status) {
			return res.status(400).json({
				message: "Required fields are missing"
			});
		}

		const student = await Student.findOne({
			_id: studentId,
			classId,
			schoolId,
			isActive: true
		});

		if (!student) {
			return res.status(404).json({
				message: "Active student not found in this class"
			});
		}

		const assignment = await TeacherClassAssignment.findOne({
			teacherId: req.user.userId,
			classId,
			schoolId
		});

		if (!assignment) {
			return res.status(403).json({
				message: "You are not assigned to this class"
			});
		}

		const attendance = await Attendance.create({
			studentId,
			classId,
			schoolId,
			teacherId: req.user.userId,
			date,
			status,
			remarks
		});

		return res.status(201).json({
			message: "Attendance marked successfully",
			attendance
		});
	} catch (error) {
		if (error.code === 11000) {
			return res.status(409).json({
				message: "Attendance already exists for this student and date"
			});
		}

		console.error("Mark Attendance Error:", error);

		return res.status(500).json({
			message: "Failed to mark attendance",
			error: error.message
		});
	}
});

// Get Attendance by Class and Date
router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "teacher") {
            return res.status(403).json({
                message: "Access denied. Teachers only."
            });
        }

        const { classId, date } = req.query;

        if (!classId || !date) {
            return res.status(400).json({
                message: "classId and date are required"
            });
        }

        const assignment = await TeacherClassAssignment.findOne({
            teacherId: req.user.userId,
            classId
        });

        if (!assignment) {
            return res.status(403).json({
                message: "You are not assigned to this class"
            });
        }

        const startDate = new Date(`${date}T00:00:00.000Z`);
        const endDate = new Date(`${date}T23:59:59.999Z`);

        const attendance = await Attendance.find({
            classId,
            schoolId: assignment.schoolId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate("studentId", "name rollNumber admissionNumber");

        return res.status(200).json({
            message: "Attendance fetched successfully",
            count: attendance.length,
            attendance
        });
    } catch (error) {
        console.error("Fetch Attendance Error:", error);

        return res.status(500).json({
            message: "Failed to fetch attendance",
            error: error.message
        });
    }
});

// Update Attendance
router.patch("/:attendanceId", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "teacher") {
            return res.status(403).json({
                message: "Access denied. Teachers only."
            });
        }

        const { attendanceId } = req.params;
        const { status, remarks } = req.body;

        const allowedStatuses = ["present", "absent", "leave", "late"];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Valid status is required"
            });
        }

        const attendance = await Attendance.findById(attendanceId);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance not found"
            });
        }

        const assignment = await TeacherClassAssignment.findOne({
            teacherId: req.user.userId,
            classId: attendance.classId,
            schoolId: attendance.schoolId
        });

        if (!assignment || attendance.teacherId.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to update this attendance"
            });
        }

        attendance.status = status;

        if (remarks !== undefined) {
            attendance.remarks = remarks;
        }

        await attendance.save();

        return res.status(200).json({
            message: "Attendance updated successfully",
            attendance
        });
    } catch (error) {
        console.error("Update Attendance Error:", error);

        return res.status(500).json({
            message: "Failed to update attendance",
            error: error.message
        });
    }
});

module.exports = router;
