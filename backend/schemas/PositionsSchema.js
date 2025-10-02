const { Schema } = require("mongoose");

const PositionsSchema = new Schema({
  positions: [{
    product: String,
    instrument: String,
    qty: Number,
    avg: Number,
    ltp: Number,
    cur_val: Number,
    pnl: Number,
    net_chg: String,
    day_chg: Number,
    isLoss: Boolean,
  }],
  breakdown: {
    totalPnl: Number,
    totalValue: Number,
    totalInvestment: Number,
    dayPnl: Number,
  }
}, {
  timestamps: true
});

module.exports = { PositionsSchema };
