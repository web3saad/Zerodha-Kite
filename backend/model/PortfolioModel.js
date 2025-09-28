const mongoose = require("mongoose");
const PortfolioSchema = require("../schemas/PortfolioSchema");

const PortfolioModel = mongoose.model("Portfolio", PortfolioSchema);

module.exports = PortfolioModel;
