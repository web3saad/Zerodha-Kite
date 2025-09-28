const { Schema } = require("mongoose");

const DashboardSchema = new Schema({
  // Equity Section
  equity: {
    marginAvailable: { type: String, default: "1L" },
    marginsUsed: { type: String, default: "0" },
    openingBalance: { type: String, default: "1L" }
  },
  
  // Commodity Section
  commodity: {
    marginAvailable: { type: String, default: "50k" },
    marginsUsed: { type: String, default: "0" },
    openingBalance: { type: String, default: "50k" }
  },
  
  // Holdings Section
  holdings: {
    count: { type: Number, default: 17 },
    pnl: { type: String, default: "2.24k" },
    pnlPercentage: { type: String, default: "+16.90%" },
    currentValue: { type: String, default: "15.46k" },
    investment: { type: String, default: "13.23k" },
    totalValue: { type: String, default: "₹15,463.77" }
  },
  
  // Positions Section
  positions: {
    count: { type: Number, default: 8 },
    list: [{
      label: { type: String },
      percentage: { type: String }
    }]
  },
  
  // User Info
  userInfo: {
    name: { type: String, default: "Sayad" },
    greeting: { type: String, default: "Hi, Sayad" }
  },
  
  // Created and updated timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
DashboardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = DashboardSchema;