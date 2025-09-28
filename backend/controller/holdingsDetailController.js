const { HoldingsDetailModel } = require("../model/HoldingsDetailModel");

// Get holdings data
const getHoldingsData = async (req, res) => {
  console.log('Holdings API endpoint called');
  try {
    let holdingsData = await HoldingsDetailModel.findOne();

    if (!holdingsData) {
      // Create default holdings data if none exists
      holdingsData = new HoldingsDetailModel({});
      await holdingsData.save();
    } else if (!holdingsData.holdings || holdingsData.holdings.length === 0) {
      // If holdings is empty, populate with defaults
      holdingsData.holdings = [
        {
          instrument: "BHARTIARTL",
          qty: 2,
          avgCost: "538.05",
          ltp: "541.15",
          curVal: "1,082.30",
          pnl: "6.20",
          netChg: "+0.58%",
          dayChg: "+2.99%"
        },
        {
          instrument: "HDFCBANK",
          qty: 2,
          avgCost: "1383.40",
          ltp: "1522.35",
          curVal: "3,044.70",
          pnl: "277.90",
          netChg: "+10.04%",
          dayChg: "+0.11%"
        },
        {
          instrument: "HINDUNILVR",
          qty: 1,
          avgCost: "2335.85",
          ltp: "2417.40",
          curVal: "2,417.40",
          pnl: "81.55",
          netChg: "+3.49%",
          dayChg: "+0.21%"
        },
        {
          instrument: "INFY",
          qty: 1,
          avgCost: "1350.50",
          ltp: "1555.45",
          curVal: "1,555.45",
          pnl: "204.95",
          netChg: "+15.18%",
          dayChg: "-1.60%"
        },
        {
          instrument: "ITC",
          qty: 5,
          avgCost: "202.00",
          ltp: "207.90",
          curVal: "1,039.50",
          pnl: "29.50",
          netChg: "+2.92%",
          dayChg: "+0.80%"
        }
      ];
      holdingsData.count = 5;
      await holdingsData.save();
    }

    res.json(holdingsData);
  } catch (error) {
    console.error('Error fetching holdings data:', error);
    res.status(500).json({ message: 'Error fetching holdings data', error: error.message });
  }
};

// Update holdings metrics
const updateHoldingsMetrics = async (req, res) => {
  try {
    const { totalInvestment, currentValue, daysPnl, totalPnl, totalPnlPercentage } = req.body;
    
    let holdingsData = await HoldingsDetailModel.findOne();
    if (!holdingsData) {
      holdingsData = new HoldingsDetailModel({});
    }
    
    holdingsData.metrics = {
      totalInvestment: totalInvestment || holdingsData.metrics.totalInvestment,
      currentValue: currentValue || holdingsData.metrics.currentValue,
      daysPnl: daysPnl || holdingsData.metrics.daysPnl,
      totalPnl: totalPnl || holdingsData.metrics.totalPnl,
      totalPnlPercentage: totalPnlPercentage || holdingsData.metrics.totalPnlPercentage
    };
    
    await holdingsData.save();
    res.json(holdingsData);
  } catch (error) {
    console.error('Error updating holdings metrics:', error);
    res.status(500).json({ message: 'Error updating holdings metrics', error: error.message });
  }
};

// Update holdings list
const updateHoldingsList = async (req, res) => {
  try {
    const { holdings } = req.body;
    
    let holdingsData = await HoldingsDetailModel.findOne();
    if (!holdingsData) {
      holdingsData = new HoldingsDetailModel({});
    }
    
    holdingsData.holdings = holdings;
    holdingsData.count = holdings.length;
    
    await holdingsData.save();
    res.json(holdingsData);
  } catch (error) {
    console.error('Error updating holdings list:', error);
    res.status(500).json({ message: 'Error updating holdings list', error: error.message });
  }
};

// Update totals
const updateHoldingsTotals = async (req, res) => {
  try {
    const { totalCurrentValue, totalPnl, totalNetChg, totalDayChg } = req.body;
    
    let holdingsData = await HoldingsDetailModel.findOne();
    if (!holdingsData) {
      holdingsData = new HoldingsDetailModel({});
    }
    
    holdingsData.totals = {
      totalCurrentValue: totalCurrentValue || holdingsData.totals.totalCurrentValue,
      totalPnl: totalPnl || holdingsData.totals.totalPnl,
      totalNetChg: totalNetChg || holdingsData.totals.totalNetChg,
      totalDayChg: totalDayChg || holdingsData.totals.totalDayChg
    };
    
    await holdingsData.save();
    res.json(holdingsData);
  } catch (error) {
    console.error('Error updating holdings totals:', error);
    res.status(500).json({ message: 'Error updating holdings totals', error: error.message });
  }
};

// Update complete holdings data
const updateCompleteHoldings = async (req, res) => {
  try {
    const updateData = req.body;
    
    let holdingsData = await HoldingsDetailModel.findOne();
    if (!holdingsData) {
      holdingsData = new HoldingsDetailModel(updateData);
    } else {
      Object.assign(holdingsData, updateData);
    }
    
    await holdingsData.save();
    res.json(holdingsData);
  } catch (error) {
    console.error('Error updating complete holdings:', error);
    res.status(500).json({ message: 'Error updating complete holdings', error: error.message });
  }
};

module.exports = {
  getHoldingsData,
  updateHoldingsMetrics,
  updateHoldingsList,
  updateHoldingsTotals,
  updateCompleteHoldings
};