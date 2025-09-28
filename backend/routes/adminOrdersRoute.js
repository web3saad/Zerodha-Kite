const { Router } = require("express");
const { 
  getAllOrders, 
  createOrder, 
  updateOrder, 
  deleteOrder, 
  getOrdersStats 
} = require("../controller/adminOrdersController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = Router();

// Admin routes for orders management
router.get("/", verifyToken, getAllOrders);
router.post("/", verifyToken, createOrder);
router.put("/:id", verifyToken, updateOrder);
router.delete("/:id", verifyToken, deleteOrder);
router.get("/stats", verifyToken, getOrdersStats);

module.exports = router;