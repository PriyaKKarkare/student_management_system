const directorProfile = (req, res) => {
	return res.status(200).json({
		message: "Director Profile fetched successfully",
		user: {
			userId: req.user.userId,
			role: req.user.role
		},
	});
};

module.exports = { directorProfile }