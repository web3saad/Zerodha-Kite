const { HoldingsDetailModel } = require("../model/HoldingsDetailModel");

// Get holdings data
const getHoldingsData = async (req, res) => {
  console.log('Holdings API endpoint called');
  try {
    console.log('Attempting to fetch holdings data...');
    let holdingsData = await HoldingsDetailModel.findOne();
    console.log('Holdings data found:', !!holdingsData);
    
    if (!holdingsData) {
      console.log('No holdings data found, creating default...');
      // Create default holdings data if none exists
      holdingsData = new HoldingsDetailModel({});
      await holdingsData.save();
      console.log('Default holdings data created');
    }
    
    console.log('Sending holdings data response');
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