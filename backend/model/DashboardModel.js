const { model } = require("mongoose");
const DashboardSchema = require("../schemas/DashboardSchema");

const DashboardModel = new model("dashboard", DashboardSchema);

module.exports = DashboardModel;