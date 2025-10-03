const { PositionsModel } = require("../model/PositionsModel");
const { PositionsDetailModel } = require("../model/PositionsDetailModel");

module.exports.index = async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
};

module.exports.addPosition = async (req, res) => {
  try {
    const { stock, orderType, quantity, price, exchange } = req.body;
    
    console.log('Adding new position for stock:', stock.name || stock.symbol);
    
    // Get current positions data from PositionsDetailModel (the one used by the UI)
    let positionsData = await PositionsDetailModel.findOne();
    
    if (!positionsData) {
      // Create initial positions structure using PositionsDetailModel format
      positionsData = new PositionsDetailModel({});
      await positionsData.save();
    }
    
    // Check if position already exists - use exact match for the specific stock
    const stockIdentifier = stock.name || stock.symbol;
    console.log('Looking for position with identifier:', stockIdentifier);
    console.log('Current positions:', positionsData.positions.map(p => ({ instrument: p.instrument, qty: p.qty })));
    
    const existingPositionIndex = positionsData.positions.findIndex(
      pos => pos.instrument === stockIdentifier
    );
    
    console.log('Found position at index:', existingPositionIndex);
    
    if (existingPositionIndex >= 0) {
      // Update existing position - PRESERVE the original instrument name
      console.log('UPDATING existing position at index', existingPositionIndex);
      const existingPosition = positionsData.positions[existingPositionIndex];
      console.log('Original instrument name:', existingPosition.instrument);
      
      const currentAvg = parseFloat(existingPosition.avg.replace(/,/g, ''));
      const currentQty = existingPosition.qty;
      const newTotalQty = currentQty + quantity;
      const newAvgPrice = ((currentAvg * Math.abs(currentQty)) + (price * quantity)) / Math.abs(newTotalQty);
      
      // Calculate P&L
      const pnlValue = (price - newAvgPrice) * Math.abs(newTotalQty);
      const chgPercent = ((price - newAvgPrice) / newAvgPrice * 100);
      
      // Update only specific fields while preserving the rest
      const position = positionsData.positions[existingPositionIndex];
      position.qty = newTotalQty;
      position.avg = newAvgPrice.toFixed(2);
      position.ltp = price.toFixed(2);
      position.pnl = pnlValue > 0 ? `+${pnlValue.toFixed(2)}` : pnlValue.toFixed(2);
      position.chg = `${chgPercent.toFixed(2)}%`;
      // DO NOT MODIFY instrument - it should stay the same!
      
      console.log('After update - instrument name is still:', position.instrument);
      
      // Explicitly mark the position as modified
      positionsData.markModified('positions');
    } else {
      // Add new position using PositionsDetailModel format
      const newPosition = {
        product: "NRML",
        instrument: stock.name || stock.symbol,
        exchange: exchange || "NSE",
        qty: quantity,
        avg: price.toFixed(2),
        ltp: price.toFixed(2),
        pnl: "0.00", // No P&L initially
        chg: "0.00%",
        holding: false,
        dim: false
      };
      
      positionsData.positions.push(newPosition);
      positionsData.count = positionsData.positions.length;
    }
    
    // Update totals if they exist
    if (positionsData.totals) {
      let totalPnl = 0;
      positionsData.positions.forEach(pos => {
        const pnlValue = parseFloat(pos.pnl.replace(/[+,]/g, ''));
        totalPnl += pnlValue;
      });
      positionsData.totals.totalPnl = totalPnl.toFixed(2);
    }
    
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
