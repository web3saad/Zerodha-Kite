const DashboardModel = require("../model/DashboardModel");

// Get dashboard data
const getDashboardData = async (req, res) => {
  try {
    let dashboardData = await DashboardModel.findOne();
    
    // If no data exists, create default data
    if (!dashboardData) {
      dashboardData = new DashboardModel({
        equity: {
          marginAvailable: "1L",
          marginsUsed: "0",
          openingBalance: "1L"
        },
        commodity: {
          marginAvailable: "50k",
          marginsUsed: "0",
          openingBalance: "50k"
        },
        holdings: {
          count: 17,
          pnl: "2.24k",
          pnlPercentage: "+16.90%",
          currentValue: "15.46k",
          investment: "13.23k",
          totalValue: "₹15,463.77"
        },
        positions: {
          count: 8,
          list: [
            { label: 'USDINR 23JUN FUT (NRML)', percentage: '88%' },
            { label: '11th 23MAY 18700 CE (NRML)', percentage: '80%' },
            { label: 'USDINR 23MAY FUT (NRML)', percentage: '74%' },
            { label: '11th 23MAY 18750 CE (NRML)', percentage: '63%' },
            { label: '11th 23MAY 17300 PE (MIS)', percentage: '50%' },
            { label: 'IDFCFIRSTB (CNC)', percentage: '40%' },
            { label: 'HDFCBANK (CNC)', percentage: '32%' },
            { label: 'TCS (CNC)', percentage: '24%' }
          ]
        },
        userInfo: {
          name: "Sayad",
          greeting: "Hi, Sayad"
        }
      });
      await dashboardData.save();
    }
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update dashboard data
const updateDashboardData = async (req, res) => {
  try {
    const updateData = req.body;
    
    let dashboardData = await DashboardModel.findOne();
    
    if (!dashboardData) {
      dashboardData = new DashboardModel(updateData);
    } else {
      // Update fields
      if (updateData.equity) {
        dashboardData.equity = { ...dashboardData.equity, ...updateData.equity };
      }
      if (updateData.commodity) {
        dashboardData.commodity = { ...dashboardData.commodity, ...updateData.commodity };
      }
      if (updateData.holdings) {
        dashboardData.holdings = { ...dashboardData.holdings, ...updateData.holdings };
      }
      if (updateData.positions) {
        dashboardData.positions = { ...dashboardData.positions, ...updateData.positions };
      }
      if (updateData.userInfo) {
        dashboardData.userInfo = { ...dashboardData.userInfo, ...updateData.userInfo };
      }
    }
    
    await dashboardData.save();
    res.json({ message: "Dashboard data updated successfully", data: dashboardData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update specific section
const updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const updateData = req.body;
    
    let dashboardData = await DashboardModel.findOne();
    
    if (!dashboardData) {
      dashboardData = new DashboardModel();
    }
    
    // Update specific section
    if (dashboardData[section]) {
      dashboardData[section] = { ...dashboardData[section], ...updateData };
      await dashboardData.save();
      res.json({ message: `${section} updated successfully`, data: dashboardData[section] });
    } else {
      res.status(400).json({ message: "Invalid section" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardData,
  updateDashboardData,
  updateSection
};