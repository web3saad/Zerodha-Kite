const { Schema } = require("mongoose");

const ConsoleSchema = new Schema({
  // P&L Data
  realisedTotal: {
    type: Number,
    default: 5700000
  },
  charges: {
    type: Number,
    default: 483.14
  },
  otherCreditsDebits: {
    type: Number,
    default: -134.52
  },
  unrealisedPL: {
    type: Number,
    default: 0
  },
  
  // Portfolio Holdings Data
  portfolioData: [{
    symbol: {
      type: String,
      default: ""
    },
    qty: {
      type: Number,
      default: 0
    },
    buyAvg: {
      type: Number,
      default: 0
    },
    buyVal: {
      type: Number,
      default: 0
    },
    sellAvg: {
      type: Number,
      default: 0
    },
    sellVal: {
      type: Number,
      default: 0
    },
    realisedPL: {
      type: String,
      default: "+"
    },
    realisedAmount: {
      type: Number,
      default: 0
    },
    unrealisedPL: {
      type: String,
      default: "—"
    }
  }],
  
  // Date range settings
  dateFrom: {
    type: String,
    default: "2024-07-31"
  },
  dateTo: {
    type: String,
    default: "2025-09-27"
  },
  
  // Display settings
  equity: {
    type: String,
    default: "Equity"
  },
  plCombined: {
    type: String,
    default: "Combined"
  },
  
  // Last updated
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = { ConsoleSchema };