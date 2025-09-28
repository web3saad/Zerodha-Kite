const { model } = require("mongoose");
const { PositionsDetailSchema } = require("../schemas/PositionsDetailSchema");

const PositionsDetailModel = model("positionsdetail", PositionsDetailSchema);

module.exports = { PositionsDetailModel };