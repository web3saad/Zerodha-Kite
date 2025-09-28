const { Router } = require("express");
const { 
  getOrdersPageData, 
  updateOrdersPageData 
} = require("../controller/ordersPageController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = Router();

// Routes for orders page data management
router.get("/", getOrdersPageData);
router.put("/", updateOrdersPageData);

module.exports = router;