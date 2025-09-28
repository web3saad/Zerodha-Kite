const { Router } = require("express");
const {
  getPositionsData,
  updatePositionsList,
  updateDayHistory,
  updateBreakdown,
  updatePositionsTotals,
  updateCompletePositions
} = require("../controller/positionsDetailController");

const router = Router();

// Get positions data
router.get("/", getPositionsData);

// Update specific sections
router.put("/list", updatePositionsList);
router.put("/dayhistory", updateDayHistory);
router.put("/breakdown", updateBreakdown);
router.put("/totals", updatePositionsTotals);

// Update complete positions data
router.put("/", updateCompletePositions);

module.exports = router;