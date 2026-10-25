const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { directorProfile, getDashboard } = require("../controllers/directorController");

const router = express.Router();

router.get("/profile", authMiddleware, allowRoles("director"), directorProfile);

router.get("/dashboard", authMiddleware, allowRoles('director'), getDashboard)

module.exports = router;