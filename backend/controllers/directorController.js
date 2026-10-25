
const School = require("../models/School");
const SchoolGroup = require("../models/SchoolGroup");

const directorProfile = (req, res) => {
	return res.status(200).json({
		message: "Director Profile fetched successfully",
		user: {
			userId: req.user.userId,
			role: req.user.role
		},
	});
};

const getDashboard = async (req, res) => {
	try {
		const group = await SchoolGroup.findOne({
			directorId: req.user.userId,
		});

		if (!group) {
			return res.status(404).json({
				message: "School group not found"
			});
		}

		const schools = await School.find({
			groupId: group._id,
		}).select("name address");

		return res.status(200).json({
			message: "Director dashboard fetched successfully",
			totalSchools: schools.length,
			schools,
		});
	} catch (error) {
		console.error("Director dashboard error : ", error.message);
		return res.status(500).json({
			message: "Interval server error"
		});
	}
};

module.exports = { directorProfile, getDashboard }