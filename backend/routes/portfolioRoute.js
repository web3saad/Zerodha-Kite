const express = require("express");
const { getPortfolioData, updatePortfolioData } = require("../controller/portfolioController");

const router = express.Router();

router.get("/", getPortfolioData);
router.put("/", updatePortfolioData);

module.exports = router;
