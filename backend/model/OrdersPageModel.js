const { Schema } = require("mongoose");
const { model } = require("mongoose");

const OrdersPageSchema = new Schema({
  openOrders: {
    type: Array,
    default: []
  },
  executedOrders: {
    type: Array, 
    default: []
  }
});

const OrdersPageModel = model("OrdersPage", OrdersPageSchema);

module.exports = OrdersPageModel;