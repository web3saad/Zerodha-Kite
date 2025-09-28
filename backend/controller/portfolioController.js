const PortfolioModel = require("../model/PortfolioModel");

const getPortfolioData = async (req, res) => {
  try {
    
    let portfolioData = await PortfolioModel.findOne();
    
    if (!portfolioData) {
      // Create default portfolio data if none exists
      portfolioData = new PortfolioModel({
        metrics: {
          invested: 2732193.78,
          present: 3012712.02,
          xirrUrl: "#"
        },
        accountMix: [
          { label: "Equity", color: "#1d4ed8", pct: 0.5391 },
          { label: "Debt", color: "#64748b", pct: 0.2902 },
          { label: "Gold", color: "#f59e0b", pct: 0.1016 },
          { label: "Equity (MF)", color: "#a855f7", pct: 0.0691 }
        ],
        sectors: [
          { label: "Etf", color: "#0b5bd3", pct: 0.4066 },
          { label: "Debt", color: "#7c8b97", pct: 0.3935 },
          { label: "Financials", color: "#2563eb", pct: 0.0782 },
          { label: "Information Tech", color: "#3b82f6", pct: 0.0575 },
          { label: "Materials", color: "#60a5fa", pct: 0.0332 },
          { label: "Consumer Durables", color: "#22c55e", pct: 0.0239 },
          { label: "Communication", color: "#0ea5e9", pct: 0.0062 }
        ],
        stocks: {
          capMix: [
            { label: "Large Cap", color: "#3b82f6", pct: 0.7234 },
            { label: "Mid Cap", color: "#10b981", pct: 0.1702 },
            { label: "Small Cap", color: "#f59e0b", pct: 0.1064 }
          ],
          rows: [
            { instrument: "NIFTY BEES", qty: 700, avgPrice: 208.89, ltp: 224.21, pnl: 10724.00, netChg: 6.82, dayChg: 3.15 },
            { instrument: "GOLDBEES", qty: 300, avgPrice: 44.73, ltp: 45.92, pnl: 357.00, netChg: 2.66, dayChg: 0.77 },
            { instrument: "RELIANCE", qty: 50, avgPrice: 2450.30, ltp: 2567.85, pnl: 5877.50, netChg: 4.80, dayChg: 1.96 },
            { instrument: "INFY", qty: 100, avgPrice: 1580.25, ltp: 1642.10, pnl: 6185.00, netChg: 3.91, dayChg: 2.43 },
            { instrument: "HDFC BANK", qty: 80, avgPrice: 1425.60, ltp: 1489.30, pnl: 5096.00, netChg: 4.47, dayChg: 3.02 }
          ]
        }
      });
      
      await portfolioData.save();
    }
    
    res.status(200).json(portfolioData);
  } catch (error) {
    console.error('Error in getPortfolioData:', error);
    res.status(500).json({ 
      message: "Error fetching portfolio data", 
      error: error.message 
    });
  }
};

const updatePortfolioData = async (req, res) => {
  try {
    console.log('Updating portfolio data...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    let portfolioData = await PortfolioModel.findOne();
    
    if (!portfolioData) {
      portfolioData = new PortfolioModel(req.body);
    } else {
      // Update the existing document
      Object.assign(portfolioData, req.body);
    }
    
    await portfolioData.save();
    console.log('Portfolio data updated successfully');
    
    res.status(200).json({
      message: "Portfolio data updated successfully",
      data: portfolioData
    });
  } catch (error) {
    console.error('Error updating portfolio data:', error);
    res.status(500).json({ 
      message: "Error updating portfolio data", 
      error: error.message 
    });
  }
};

module.exports = {
  getPortfolioData,
  updatePortfolioData
};
