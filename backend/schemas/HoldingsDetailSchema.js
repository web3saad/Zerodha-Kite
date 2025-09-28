const { Schema } = require("mongoose");

const HoldingsDetailSchema = new Schema({
  instrument: { type: String, required: true, default: "BHARTIARTL" },
  qty: { type: Number, required: true, default: 2 },
  avgCost: { type: String, required: true, default: "538.05" },
  ltp: { type: String, required: true, default: "541.15" },
  curVal: { type: String, required: true, default: "1,082.30" },
  pnl: { type: String, required: true, default: "6.20" },
  netChg: { type: String, required: true, default: "+0.58%" },
  dayChg: { type: String, required: true, default: "+2.99%" }
});

const HoldingsSchema = new Schema({
  count: { type: Number, required: true, default: 13 },
  metrics: {
    totalInvestment: { type: String, required: true, default: "29,875.55" },
    currentValue: { type: String, required: true, default: "31,428.95" },
    daysPnl: { type: String, required: true, default: "0.55%" },
    totalPnl: { type: String, required: true, default: "1,553.40" },
    totalPnlPercentage: { type: String, required: true, default: "5.20%" }
  },
  holdings: { type: [HoldingsDetailSchema], default: [
    {
      instrument: "BHARTIARTL",
      qty: 2,
      avgCost: "538.05",
      ltp: "541.15",
      curVal: "1,082.30",
      pnl: "6.20",
      netChg: "+0.58%",
      dayChg: "+2.99%"
    },
    {
      instrument: "HDFCBANK",
      qty: 2,
      avgCost: "1383.40",
      ltp: "1522.35",
      curVal: "3,044.70",
      pnl: "277.90",
      netChg: "+10.04%",
      dayChg: "+0.11%"
    },
    {
      instrument: "HINDUNILVR",
      qty: 1,
      avgCost: "2335.85",
      ltp: "2417.40",
      curVal: "2,417.40",
      pnl: "81.55",
      netChg: "+3.49%",
      dayChg: "+0.21%"
    },
    {
      instrument: "INFY",
      qty: 1,
      avgCost: "1350.50",
      ltp: "1555.45",
      curVal: "1,555.45",
      pnl: "204.95",
      netChg: "+15.18%",
      dayChg: "-1.60%"
    },
    {
      instrument: "ITC",
      qty: 5,
      avgCost: "202.00",
      ltp: "207.90",
      curVal: "1,039.50",
      pnl: "29.50",
      netChg: "+2.92%",
      dayChg: "+0.80%"
    }
  ] },
  totals: {
    totalCurrentValue: { type: String, required: true, default: "31,428.95" },
    totalPnl: { type: String, required: true, default: "1,553.40" },
    totalNetChg: { type: String, required: true, default: "5.20%" },
    totalDayChg: { type: String, required: true, default: "0.55%" }
  }
}, {
  timestamps: true
});

module.exports = { HoldingsSchema };