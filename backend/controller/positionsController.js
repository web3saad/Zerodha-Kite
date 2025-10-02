const { PositionsModel } = require("../model/PositionsModel");

module.exports.index = async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
};

module.exports.addPosition = async (req, res) => {
  try {
    const { stock, orderType, quantity, price, exchange } = req.body;
    
    console.log('Adding new position:', req.body);
    
    // Get current positions data or create new if none exists
    let positionsData = await PositionsModel.findOne();
    
    if (!positionsData) {
      // Create initial positions structure
      positionsData = new PositionsModel({
        positions: [],
        breakdown: {
          totalPnl: 0,
          totalValue: 0,
          totalInvestment: 0,
          dayPnl: 0
        }
      });
    }
    
    // Check if position already exists
    const existingPositionIndex = positionsData.positions.findIndex(
      pos => pos.instrument === stock.name || pos.instrument === stock.symbol
    );
    
    if (existingPositionIndex >= 0) {
      // Update existing position
      const existingPosition = positionsData.positions[existingPositionIndex];
      const newTotalQty = existingPosition.qty + quantity;
      const newAvgPrice = ((existingPosition.avg * existingPosition.qty) + (price * quantity)) / newTotalQty;
      
      positionsData.positions[existingPositionIndex] = {
        ...existingPosition,
        qty: newTotalQty,
        avg: newAvgPrice,
        ltp: price, // Update LTP to current price
        cur_val: newTotalQty * price,
        pnl: (price - newAvgPrice) * newTotalQty,
        net_chg: ((price - newAvgPrice) / newAvgPrice * 100).toFixed(2) + '%',
        day_chg: Math.random() * 2 - 1 // Random day change
      };
    } else {
      // Add new position
      const newPosition = {
        instrument: stock.name || stock.symbol,
        qty: quantity,
        avg: price,
        ltp: price,
        cur_val: quantity * price,
        pnl: 0, // No P&L initially
        net_chg: '0.00%',
        day_chg: Math.random() * 2 - 1 // Random day change
      };
      
      positionsData.positions.push(newPosition);
    }
    
    // Recalculate totals
    let totalValue = 0;
    let totalInvestment = 0;
    let totalPnl = 0;
    
    positionsData.positions.forEach(pos => {
      totalValue += pos.cur_val;
      totalInvestment += pos.avg * pos.qty;
      totalPnl += pos.pnl;
    });
    
    positionsData.breakdown = {
      totalPnl: totalPnl,
      totalValue: totalValue,
      totalInvestment: totalInvestment,
      dayPnl: Math.random() * 1000 - 500 // Random day P&L
    };
    
    await positionsData.save();
    
    res.status(200).json({
      message: 'Position added successfully',
      data: positionsData
    });
    
  } catch (error) {
    console.error('Error adding position:', error);
    res.status(500).json({
      message: 'Error adding position',
      error: error.message
    });
  }
};
