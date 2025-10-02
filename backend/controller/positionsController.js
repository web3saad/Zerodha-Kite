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

module.exports.sellPosition = async (req, res) => {
  try {
    const { stock, quantity, price } = req.body;
    
    console.log('Selling position:', req.body);
    
    // Get current positions data
    let positionsData = await PositionsModel.findOne();
    
    if (!positionsData || !positionsData.positions || positionsData.positions.length === 0) {
      return res.status(404).json({
        error: 'No positions found to sell'
      });
    }
    
    // Find the position to sell
    const existingPositionIndex = positionsData.positions.findIndex(
      pos => pos.instrument === stock.name || pos.instrument === stock.symbol
    );
    
    if (existingPositionIndex === -1) {
      return res.status(404).json({
        error: `No position found for ${stock.name || stock.symbol}`
      });
    }
    
    const existingPosition = positionsData.positions[existingPositionIndex];
    
    if (existingPosition.qty < quantity) {
      return res.status(400).json({
        error: `Insufficient quantity. You hold ${existingPosition.qty} shares, trying to sell ${quantity}`
      });
    }
    
    if (existingPosition.qty === quantity) {
      // Remove the position completely
      positionsData.positions.splice(existingPositionIndex, 1);
      
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
        dayPnl: Math.random() * 1000 - 500
      };
      
      await positionsData.save();
      
      return res.status(200).json({
        message: `Position for ${stock.name || stock.symbol} completely sold and removed`,
        data: positionsData
      });
    } else {
      // Reduce the quantity
      const newQty = existingPosition.qty - quantity;
      
      positionsData.positions[existingPositionIndex] = {
        ...existingPosition,
        qty: newQty,
        ltp: price, // Update LTP to current price
        cur_val: newQty * price,
        pnl: (price - existingPosition.avg) * newQty,
        net_chg: ((price - existingPosition.avg) / existingPosition.avg * 100).toFixed(2) + '%',
        day_chg: Math.random() * 2 - 1
      };
      
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
        dayPnl: Math.random() * 1000 - 500
      };
      
      await positionsData.save();
      
      return res.status(200).json({
        message: `Sold ${quantity} shares of ${stock.name || stock.symbol}. ${newQty} shares remaining`,
        data: positionsData
      });
    }
    
  } catch (error) {
    console.error('Error selling position:', error);
    res.status(500).json({
      message: 'Error selling position',
      error: error.message
    });
  }
};
