const { Schema } = require("mongoose");

const AccountMixSchema = new Schema({
  label: { type: String, required: true },
  color: { type: String, required: true },
  pct: { type: Number, required: true }
});

const SectorSchema = new Schema({
  label: { type: String, required: true },
  color: { type: String, required: true },
  pct: { type: Number, required: true }
});

const CapMixSchema = new Schema({
  label: { type: String, required: true },
  color: { type: String, required: true },
  pct: { type: Number, required: true }
});

const StockRowSchema = new Schema({
  instrument: { type: String, required: true },
  qty: { type: Number, required: true },
  avgPrice: { type: Number, required: true },
  ltp: { type: Number, required: true },
  pnl: { type: Number, required: true },
  netChg: { type: Number, required: true },
  dayChg: { type: Number, required: true }
});

const PortfolioSchema = new Schema({
  metrics: {
    invested: { type: Number, required: true },
    present: { type: Number, required: true },
    xirrUrl: { type: String, default: "#" }
  },
  accountMix: [AccountMixSchema],
  sectors: [SectorSchema],
  stocks: {
    capMix: [CapMixSchema],
    rows: [StockRowSchema]
  }
}, {
  timestamps: true
});

module.exports = PortfolioSchema;
