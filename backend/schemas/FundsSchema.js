const { Schema } = require("mongoose");

const FundsSchema = new Schema({
  equity: {
    availableMargin: { type: String, default: "100000" },
    usedMargin: { type: String, default: "0" },
    availableCash: { type: String, default: "100000" },
    openingBalance: { type: String, default: "100000" },
    payin: { type: String, default: "0" },
    payout: { type: String, default: "0" },
    span: { type: String, default: "0" },
    deliveryMargin: { type: String, default: "0" },
    exposure: { type: String, default: "0" },
    optionsPremium: { type: String, default: "0" },
    collateralLiquidFunds: { type: String, default: "0" },
    collateralEquity: { type: String, default: "0" },
    totalCollateral: { type: String, default: "0" }
  },
  commodity: {
    availableMargin: { type: String, default: "50000" },
    usedMargin: { type: String, default: "0" },
    availableCash: { type: String, default: "50000" },
    openingBalance: { type: String, default: "50000" },
    payin: { type: String, default: "0" },
    payout: { type: String, default: "0" },
    span: { type: String, default: "0" },
    deliveryMargin: { type: String, default: "0" },
    exposure: { type: String, default: "0" },
    optionsPremium: { type: String, default: "0" },
    collateralLiquidFunds: { type: String, default: "0" },
    collateralEquity: { type: String, default: "0" },
    totalCollateral: { type: String, default: "0" }
  }
});

module.exports = { FundsSchema };