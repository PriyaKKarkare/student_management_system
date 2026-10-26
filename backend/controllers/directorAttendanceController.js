
const Attendance = require("../models/Attendance");
const School = require("../models/School");
const SchoolGroup = require("../models/SchoolGroup");

const getAllAttendance = async (req, res) => {
    try {
        const group = await SchoolGroup.findOne({
            directorId: req.user.userId
        });

        if (!group) {
            return res.status(404).json({
                message: "School group not found"
            });
        }

        const schools = await School.find({
            groupId: group._id
        }).select("_id name");

        const schoolIds = schools.map((school) => school._id);

        const attendance = await Attendance.find({
            schoolId: { $in: schoolIds }
        })
            .populate("studentId", "name rollNumber admissionNumber")
            .populate("teacherId", "name email")
            .populate("schoolId", "name");

        return res.status(200).json({
            message: "Attendance fetched successfully",
            totalSchools: schools.length,
            count: attendance.length,
            attendance
        });
    } catch (error) {
        console.error("Director Attendance Error:", error);

        return res.status(500).json({
            message: "Failed to fetch attendance"
        });
    }
};

module.exports = { getAllAttendance };
