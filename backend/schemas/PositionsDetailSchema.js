const { Schema } = require("mongoose");

const PositionItemSchema = new Schema({
  product: { type: String, required: true, default: "NRML" },
  instrument: { type: String, required: true, default: "USDINR 23JUN FUT" },
  exchange: { type: String, required: true, default: "CDS" },
  qty: { type: Number, required: true, default: -1 },
  avg: { type: String, required: true, default: "82.0375" },
  ltp: { type: String, required: true, default: "82.5275" },
  pnl: { type: String, required: true, default: "-490.00" },
  chg: { type: String, required: true, default: "0.60%" },
  holding: { type: Boolean, default: false },
  dim: { type: Boolean, default: false }
});

const PositionsDetailSchema = new Schema({
  count: { type: Number, required: true, default: 8 },
  positions: { type: [PositionItemSchema], default: [
    {
      product: "NRML",
      instrument: "USDINR 23JUN FUT",
      exchange: "CDS",
      qty: -1,
      avg: "82.0375",
      ltp: "82.5275",
      pnl: "-490.00",
      chg: "0.60%"
    },
    {
      product: "NRML",
      instrument: "USDINR 23MAY FUT",
      exchange: "CDS",
      qty: 1,
      avg: "82.1625",
      ltp: "82.4225",
      pnl: "+260.00",
      chg: "0.32%"
    },
    {
      product: "NRML",
      instrument: "GOLDPETAL 23MAY FUT",
      exchange: "MCX",
      qty: 1,
      avg: "6,134.00",
      ltp: "6,059.00",
      pnl: "-75.00",
      chg: "-1.22%"
    },
    {
      product: "NRML",
      instrument: "11th 23MAY 18700 CE",
      exchange: "NFO",
      qty: -50,
      avg: "1.65",
      ltp: "1.65",
      pnl: "-50.00",
      chg: "0.00%"
    },
    {
      product: "NRML",
      instrument: "11th 23MAY 18750 CE",
      exchange: "NFO",
      qty: 50,
      avg: "1.45",
      ltp: "1.20",
      pnl: "-12.50",
      chg: "-17.24%"
    }
  ] },
  dayHistory: {
    count: { type: Number, required: true, default: 7 },
    expanded: { type: Boolean, default: false }
  },
  breakdown: { type: [String], default: [
    "USDINR 23JUN FUT (NRML)",
    "11th 23MAY 18700 CE (NRML)",
    "USDINR 23MAY FUT (NRML)",
    "11th 23MAY 18750 CE (NRML)",
    "11th 23MAY 17300 PE (MIS)",
    "IDFCFIRSTB (CNC)",
    "GOLDPETAL 23MAY FUT (NRML)",
    "11th 23MAY 18650 CE (NRML)"
  ] },
  totals: {
    totalPnl: { type: String, required: true, default: "-337.75" }
  }
}, {
  timestamps: true
});

module.exports = { PositionsDetailSchema };