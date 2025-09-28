const { ConsoleModel } = require("../model/ConsoleModel");

const getConsoleData = async (req, res) => {
  try {
    let consoleData = await ConsoleModel.findOne();
    
    // If no data exists, create default data
    if (!consoleData) {
      consoleData = new ConsoleModel({
        realisedTotal: 5700000,
        charges: 483.14,
        otherCreditsDebits: -134.52,
        unrealisedPL: 0,
        portfolioData: [
          {
            symbol: "SBIN",
            qty: 10,
            buyAvg: 769.65,
            buyVal: 7696.50,
            sellAvg: 802.00,
            sellVal: 8020.00,
            realisedPL: "+₹8,55,000.00",
            realisedAmount: 855000,
            unrealisedPL: "—"
          },
          {
            symbol: "TATAMOTORS",
            qty: 24,
            buyAvg: 978.81,
            buyVal: 23491.35,
            sellAvg: 1068.30,
            sellVal: 25639.20,
            realisedPL: "+₹48,45,000.00",
            realisedAmount: 4845000,
            unrealisedPL: "—"
          }
        ],
        dateFrom: "2024-07-31",
        dateTo: "2025-09-27",
        equity: "Equity",
        plCombined: "Combined"
      });
      await consoleData.save();
    }
    
    res.json(consoleData);
  } catch (error) {
    console.error("Error fetching console data:", error);
    res.status(500).json({ message: "Error fetching console data", error: error.message });
  }
};

const updateConsoleData = async (req, res) => {
  try {
    const updateData = req.body;
    
    updateData.lastUpdated = new Date();
    
    // Validate portfolio data
    if (updateData.portfolioData) {
      updateData.portfolioData = updateData.portfolioData.map(item => ({
        symbol: item.symbol || "UNKNOWN",
        qty: item.qty || 0,
        buyAvg: item.buyAvg || 0,
        buyVal: item.buyVal || 0,
        sellAvg: item.sellAvg || 0,
        sellVal: item.sellVal || 0,
        realisedPL: item.realisedPL || "+₹0.00",
        realisedAmount: item.realisedAmount || 0,
        unrealisedPL: item.unrealisedPL || "—"
      }));
    }
    
    let consoleData = await ConsoleModel.findOne();
    
    if (!consoleData) {
      consoleData = new ConsoleModel(updateData);
    } else {
      Object.assign(consoleData, updateData);
    }
    
    await consoleData.save();
    res.json({ message: "Console data updated successfully", data: consoleData });
  } catch (error) {
    console.error("Error updating console data:", error);
    console.error("Error details:", error.stack);
    res.status(500).json({ message: "Error updating console data", error: error.message, details: error.stack });
  }
};

const updatePLData = async (req, res) => {
  try {
    const { realisedTotal, charges, otherCreditsDebits, unrealisedPL } = req.body;
    
    let consoleData = await ConsoleModel.findOne();
    if (!consoleData) {
      consoleData = new ConsoleModel();
    }
    
    if (realisedTotal !== undefined) consoleData.realisedTotal = realisedTotal;
    if (charges !== undefined) consoleData.charges = charges;
    if (otherCreditsDebits !== undefined) consoleData.otherCreditsDebits = otherCreditsDebits;
    if (unrealisedPL !== undefined) consoleData.unrealisedPL = unrealisedPL;
    
    consoleData.lastUpdated = new Date();
    await consoleData.save();
    
    res.json({ message: "P&L data updated successfully", data: consoleData });
  } catch (error) {
    console.error("Error updating P&L data:", error);
    res.status(500).json({ message: "Error updating P&L data", error: error.message });
  }
};

const updatePortfolioData = async (req, res) => {
  try {
    const { portfolioData } = req.body;
    
    let consoleData = await ConsoleModel.findOne();
    if (!consoleData) {
      consoleData = new ConsoleModel();
    }
    
    consoleData.portfolioData = portfolioData;
    consoleData.lastUpdated = new Date();
    await consoleData.save();
    
    res.json({ message: "Portfolio data updated successfully", data: consoleData });
  } catch (error) {
    console.error("Error updating portfolio data:", error);
    res.status(500).json({ message: "Error updating portfolio data", error: error.message });
  }
};

module.exports = {
  getConsoleData,
  updateConsoleData,
  updatePLData,
  updatePortfolioData
};