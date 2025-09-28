const { model } = require("mongoose");
const { HoldingsSchema } = require("../schemas/HoldingsDetailSchema");

const HoldingsDetailModel = model("holdingsdetail", HoldingsSchema);

module.exports = { HoldingsDetailModel };