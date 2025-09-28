const { Router } = require("express");
const {
  getHoldingsData,
  updateHoldingsMetrics,
  updateHoldingsList,
  updateHoldingsTotals,
  updateCompleteHoldings
} = require("../controller/holdingsDetailController");

const router = Router();

// Get holdings data
router.get("/", getHoldingsData);

// Update specific sections
router.put("/metrics", updateHoldingsMetrics);
router.put("/list", updateHoldingsList);
router.put("/totals", updateHoldingsTotals);

// Update complete holdings data
router.put("/", updateCompleteHoldings);

module.exports = router;