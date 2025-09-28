const { model } = require("mongoose");
const { FundsSchema } = require("../schemas/FundsSchema");

const FundsModel = new model("funds", FundsSchema);

module.exports = { FundsModel };