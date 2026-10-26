
const Attendance = require("../models/Attendance");
const SchoolGroup = require("../models/SchoolGroup");
const School = require("../models/School");

const getAttendanceReport = async (req, res) => {
	try {
		if (req.user.role !== "director") {
			return res.status(403).json({
				message: "Director access only"
			});
		}

		const { date } = req.query;

		if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			return res.status(400).json({
				message: "Valid date is required (YYYY-MM-DD)"
			});
		}

		const reportDate = new Date(`${date}T00:00:00.000Z`);

		if (
			Number.isNaN(reportDate.getTime()) ||
			reportDate.toISOString().slice(0, 10) !== date
		) {
			return res.status(400).json({
				message: "Invalid date"
			});
		}

		const nextDate = new Date(reportDate);
		nextDate.setUTCDate(nextDate.getUTCDate() + 1);

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

		const report = await Attendance.aggregate([
			{
				$match: {
					schoolId: { $in: schoolIds },
					date: {
						$gte: reportDate,
						$lt: nextDate
					}
				}
			},
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 }
				}
			}
		]);

		const summary = {
			present: 0,
			absent: 0,
			leave: 0,
			late: 0
		};

		report.forEach((item) => {
			summary[item._id] = item.count;
		});

		return res.status(200).json({
			message: "Attendance report fetched successfully",
			date,
			totalSchools: schools.length,
			totalRecords: Object.values(summary).reduce(
				(total, count) => total + count,
				0
			),
			summary
		});
	} catch (error) {
		console.error("Attendance Report Error:", error);

		return res.status(500).json({
			message: "Failed to fetch attendance report"
		});
	}
};

module.exports = { getAttendanceReport };
