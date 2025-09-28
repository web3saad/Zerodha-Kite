const express = require("express");
const { 
  getConsoleData, 
  updateConsoleData, 
  updatePLData, 
  updatePortfolioData 
} = require("../controller/consoleController");

const router = express.Router();

// Get all console data
router.get("/", getConsoleData);

// Update all console data
router.put("/", updateConsoleData);

// Update P&L data specifically
router.put("/pl", updatePLData);

// Update portfolio data specifically
router.put("/portfolio", updatePortfolioData);

module.exports = router;