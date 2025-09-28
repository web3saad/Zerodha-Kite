const { OrdersModel } = require("../model/OrdersModel");

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrdersModel.find({});
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Add timestamp if not provided
    if (!orderData.time) {
      orderData.time = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    // Calculate filled/pending quantities based on status
    if (orderData.status === 'COMPLETE') {
      orderData.filledQty = orderData.qty;
      orderData.pendingQty = 0;
      orderData.avgPrice = orderData.price;
    } else {
      orderData.filledQty = 0;
      orderData.pendingQty = orderData.qty;
      orderData.avgPrice = 0;
    }

    const newOrder = new OrdersModel(orderData);
    const savedOrder = await newOrder.save();
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = req.body;

    // Calculate filled/pending quantities based on status
    if (orderData.status === 'COMPLETE') {
      orderData.filledQty = orderData.qty;
      orderData.pendingQty = 0;
      orderData.avgPrice = orderData.price;
    } else if (orderData.status === 'CANCELLED' || orderData.status === 'REJECTED') {
      orderData.filledQty = 0;
      orderData.pendingQty = 0;
      orderData.avgPrice = 0;
    } else {
      orderData.filledQty = 0;
      orderData.pendingQty = orderData.qty;
      orderData.avgPrice = 0;
    }

    const updatedOrder = await OrdersModel.findByIdAndUpdate(id, orderData, { new: true });
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order" });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await OrdersModel.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
};

// Get orders statistics
const getOrdersStats = async (req, res) => {
  try {
    const totalOrders = await OrdersModel.countDocuments({});
    const completeOrders = await OrdersModel.countDocuments({ status: 'COMPLETE' });
    const openOrders = await OrdersModel.countDocuments({ status: 'OPEN' });
    const cancelledOrders = await OrdersModel.countDocuments({ 
      $or: [{ status: 'CANCELLED' }, { status: 'REJECTED' }] 
    });

    res.json({
      total: totalOrders,
      complete: completeOrders,
      open: openOrders,
      cancelled: cancelledOrders
    });
  } catch (error) {
    console.error("Error fetching orders stats:", error);
    res.status(500).json({ message: "Error fetching orders stats" });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersStats,
};