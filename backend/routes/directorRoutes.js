const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { directorProfile } = require("../controllers/directorController");

const router = express.Router();

router.get("/profile", authMiddleware, allowRoles("director"), directorProfile);

module.exports = router;