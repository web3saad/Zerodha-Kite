require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3002;
const url = process.env.MONGO_URL;

const holdingsRoute = require("./routes/holdingsRoute");
const positionsRoute = require("./routes/positionsRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const adminRoute = require("./routes/adminRoute");
const stockRoute = require("./routes/stockRoute");
const holdingsDetailRoute = require("./routes/holdingsDetailRoute");
const positionsDetailRoute = require("./routes/positionsDetailRoute");
const fundsRoute = require("./routes/fundsRoute");
const adminOrdersRoute = require("./routes/adminOrdersRoute");
const ordersPageRoute = require("./routes/ordersPageRoute");
const accountRoute = require("./routes/accountRoute");
const consoleRoute = require("./routes/consoleRoute");
const portfolioRoute = require("./routes/portfolioRoute");

app.use(cors());
app.use(bodyParser.json());

app.use("/holdings", holdingsRoute);
app.use("/positions", positionsRoute);
app.use("/user", userRoute);
app.use("/orders", orderRoute);
app.use("/admin", adminRoute);
app.use("/api/stocks", stockRoute);
app.use("/api/holdings", holdingsDetailRoute);
app.use("/api/positions", positionsDetailRoute);
app.use("/api/funds", fundsRoute);
app.use("/api/admin/orders", adminOrdersRoute);
app.use("/api/admin/orders-page", ordersPageRoute);
app.use("/api/orders-page", ordersPageRoute);
app.use("/api/account", accountRoute);
app.use("/api/console", consoleRoute);
app.use("/api/portfolio", portfolioRoute);

app.listen(port, async () => {
  // console.log(`App Is listening On ${port}`);
  await mongoose.connect(url);
});
