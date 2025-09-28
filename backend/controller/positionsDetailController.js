const { PositionsDetailModel } = require("../model/PositionsDetailModel");

// Get positions data
const getPositionsData = async (req, res) => {
  try {
    let positionsData = await PositionsDetailModel.findOne();
    
    if (!positionsData) {
      // Create default positions data if none exists
      positionsData = new PositionsDetailModel({});
      await positionsData.save();
    }
    
    res.json(positionsData);
  } catch (error) {
    console.error('Error fetching positions data:', error);
    res.status(500).json({ message: 'Error fetching positions data', error: error.message });
  }
};

// Update positions list
const updatePositionsList = async (req, res) => {
  try {
    console.log('Updating positions list...');
    const { positions } = req.body;
    
    let positionsData = await PositionsDetailModel.findOne();
    if (!positionsData) {
      positionsData = new PositionsDetailModel({});
    }
    
    positionsData.positions = positions;
    positionsData.count = positions.length;
    
    await positionsData.save();
    console.log('Positions list updated');
    res.json(positionsData);
  } catch (error) {
    console.error('Error updating positions list:', error);
    res.status(500).json({ message: 'Error updating positions list', error: error.message });
  }
};

// Update day history
const updateDayHistory = async (req, res) => {
  try {
    console.log('Updating day history...');
    const { count, expanded } = req.body;
    
    let positionsData = await PositionsDetailModel.findOne();
    if (!positionsData) {
      positionsData = new PositionsDetailModel({});
    }
    
    positionsData.dayHistory = {
      count: count || positionsData.dayHistory.count,
      expanded: expanded !== undefined ? expanded : positionsData.dayHistory.expanded
    };
    
    await positionsData.save();
    console.log('Day history updated');
    res.json(positionsData);
  } catch (error) {
    console.error('Error updating day history:', error);
    res.status(500).json({ message: 'Error updating day history', error: error.message });
  }
};

// Update breakdown
const updateBreakdown = async (req, res) => {
  try {
    console.log('Updating breakdown...');
    const { breakdown } = req.body;
    
    let positionsData = await PositionsDetailModel.findOne();
    if (!positionsData) {
      positionsData = new PositionsDetailModel({});
    }
    
    positionsData.breakdown = breakdown;
    
    await positionsData.save();
    console.log('Breakdown updated');
    res.json(positionsData);
  } catch (error) {
    console.error('Error updating breakdown:', error);
    res.status(500).json({ message: 'Error updating breakdown', error: error.message });
  }
};

// Update totals
const updatePositionsTotals = async (req, res) => {
  try {
    console.log('Updating positions totals...');
    const { totalPnl } = req.body;
    
    let positionsData = await PositionsDetailModel.findOne();
    if (!positionsData) {
      positionsData = new PositionsDetailModel({});
    }
    
    positionsData.totals = {
      totalPnl: totalPnl || positionsData.totals.totalPnl
    };
    
    await positionsData.save();
    console.log('Positions totals updated');
    res.json(positionsData);
  } catch (error) {
    console.error('Error updating positions totals:', error);
    res.status(500).json({ message: 'Error updating positions totals', error: error.message });
  }
};

// Update complete positions data
const updateCompletePositions = async (req, res) => {
  try {
    console.log('Updating complete positions data...');
    const updateData = req.body;
    
    let positionsData = await PositionsDetailModel.findOne();
    if (!positionsData) {
      positionsData = new PositionsDetailModel(updateData);
    } else {
      Object.assign(positionsData, updateData);
    }
    
    await positionsData.save();
    console.log('Complete positions data updated');
    res.json(positionsData);
  } catch (error) {
    console.error('Error updating complete positions:', error);
    res.status(500).json({ message: 'Error updating complete positions', error: error.message });
  }
};

module.exports = {
  getPositionsData,
  updatePositionsList,
  updateDayHistory,
  updateBreakdown,
  updatePositionsTotals,
  updateCompletePositions
};