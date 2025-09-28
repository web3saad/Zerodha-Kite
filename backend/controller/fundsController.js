const { FundsModel } = require("../model/FundsModel");

const getFunds = async (req, res) => {
  try {
    let funds = await FundsModel.findOne();
    
    if (!funds) {
      // Create default funds data if none exists
      funds = new FundsModel({
        equity: {
          availableMargin: "100000",
          usedMargin: "0",
          availableCash: "100000",
          openingBalance: "100000",
          payin: "0",
          payout: "0",
          span: "0",
          deliveryMargin: "0",
          exposure: "0",
          optionsPremium: "0",
          collateralLiquidFunds: "0",
          collateralEquity: "0",
          totalCollateral: "0"
        },
        commodity: {
          availableMargin: "50000",
          usedMargin: "0",
          availableCash: "50000",
          openingBalance: "50000",
          payin: "0",
          payout: "0",
          span: "0",
          deliveryMargin: "0",
          exposure: "0",
          optionsPremium: "0",
          collateralLiquidFunds: "0",
          collateralEquity: "0",
          totalCollateral: "0"
        }
      });
      await funds.save();
    }
    
    res.json(funds);
  } catch (error) {
    console.error('Error fetching funds:', error);
    res.status(500).json({ error: 'Failed to fetch funds data' });
  }
};

const updateFunds = async (req, res) => {
  try {
    const { section, data } = req.body;
    
    let funds = await FundsModel.findOne();
    if (!funds) {
      funds = new FundsModel();
    }
    
    if (section === 'equity') {
      funds.equity = { ...funds.equity, ...data };
    } else if (section === 'commodity') {
      funds.commodity = { ...funds.commodity, ...data };
    } else {
      return res.status(400).json({ error: 'Invalid section. Must be equity or commodity.' });
    }
    
    await funds.save();
    res.json({ message: 'Funds updated successfully', funds });
  } catch (error) {
    console.error('Error updating funds:', error);
    res.status(500).json({ error: 'Failed to update funds data' });
  }
};

module.exports = {
  getFunds,
  updateFunds
};