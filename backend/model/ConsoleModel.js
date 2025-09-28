const mongoose = require("mongoose");
const { ConsoleSchema } = require("../schemas/ConsoleSchema");

const ConsoleModel = mongoose.model("console", ConsoleSchema);

module.exports = { ConsoleModel };