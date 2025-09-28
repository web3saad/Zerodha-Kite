const express = require("express");
const router = express.Router();
const { getDashboardData, updateDashboardData, updateSection } = require("../controller/adminController");

// Get dashboard data
router.get("/dashboard", getDashboardData);

// Update all dashboard data
router.put("/dashboard", updateDashboardData);

// Update specific section (equity, commodity, holdings, positions, userInfo)
router.put("/dashboard/:section", updateSection);

module.exports = router;