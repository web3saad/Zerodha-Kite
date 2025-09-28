const OrdersPage = require("../model/OrdersPageModel");

// Get orders page data
const getOrdersPageData = async (req, res) => {
  try {
    let data = await OrdersPage.findOne();
    
    if (!data) {
      // Create default data if it doesn't exist
      const defaultOpenOrders = [
        {
          id: 1,
          t: '13:39:12',
          type: 'sell',
          inst: 'PNB',
          ex: 'NSE',
          prod: 'CO',
          qty: '0 / 1',
          ltp: '49.30',
          price: '0.00 / 48.50 trg.',
          status: 'open'
        },
        {
          id: 2,
          t: '13:39:12',
          type: 'buy',
          inst: 'INFY',
          ex: 'NSE',
          prod: 'CO',
          qty: '0 / 1',
          ltp: '49.30',
          price: '49.50 / 48.50 trg.',
          status: 'open'
        },
        {
          id: 3,
          t: '13:35:15',
          type: 'buy',
          inst: 'USDINR 23MAY FUT',
          ex: 'CDS',
          prod: 'NRML',
          qty: '0 / 3',
          ltp: '82.4225',
          price: '81.0000',
          status: 'open'
        },
        {
          id: 4,
          t: '13:34:15',
          type: 'buy',
          inst: 'USDINR 23MAY FUT',
          ex: 'CDS',
          prod: 'MIS',
          qty: '0 / 1',
          ltp: '82.4225',
          price: '81.0000',
          status: 'open'
        },
        {
          id: 5,
          t: '13:32:12',
          type: 'buy',
          inst: 'SBIN',
          ex: 'BSE',
          prod: 'MIS',
          qty: '0 / 1',
          ltp: '586.50',
          price: '585.00 / 585.00 trg.',
          status: 'open'
        },
        {
          id: 6,
          t: '13:29:52',
          type: 'buy',
          inst: 'VEDL',
          ex: 'NSE',
          prod: 'CNC',
          qty: '0 / 1',
          ltp: '279.45',
          price: '0.00 / 290.00 trg.',
          status: 'open'
        }
      ];

      const defaultExecutedOrders = [
        {
          id: 7,
          t: '13:45:09',
          type: 'buy',
          inst: '11th 23MAY 18300 CE',
          ex: 'NFO',
          prod: 'MIS',
          qty: '0 / 50',
          avg: '0.00',
          status: 'rejected'
        },
        {
          id: 8,
          t: '13:44:50',
          type: 'buy',
          inst: '11th 23MAY 18300 CE',
          ex: 'NRML',
          prod: 'MIS',
          qty: '0 / 50',
          avg: '0.00',
          status: 'rejected'
        },
        {
          id: 9,
          t: '13:39:08',
          type: 'sell',
          inst: 'PNB',
          ex: 'NSE',
          prod: 'CNC',
          qty: '0 / 1',
          avg: '51.20',
          status: 'cancelled'
        },
        {
          id: 10,
          t: '13:37:34',
          type: 'buy',
          inst: 'INFY',
          ex: 'NSE',
          prod: 'CNC',
          qty: '1 / 1',
          avg: '50.75',
          status: 'complete'
        },
        {
          id: 11,
          t: '13:28:52',
          type: 'buy',
          inst: 'VEDL',
          ex: 'NSE',
          prod: 'MIS',
          qty: '1 / 1',
          avg: '283.40',
          status: 'complete'
        }
      ];

      data = new OrdersPage({
        openOrders: defaultOpenOrders,
        executedOrders: defaultExecutedOrders
      });
      await data.save();
    }
    
    res.json(data);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: "Error fetching orders page data: " + error.message });
  }
};

// Update orders page data
const updateOrdersPageData = async (req, res) => {
  try {
    const { openOrders, executedOrders } = req.body;
    
    let data = await OrdersPage.findOne();
    if (!data) {
      data = new OrdersPage({
        openOrders: [],
        executedOrders: []
      });
    }
    
    // Make sure the data is in the correct format
    data.openOrders = Array.isArray(openOrders) ? openOrders : [];
    data.executedOrders = Array.isArray(executedOrders) ? executedOrders : [];
    
    await data.save();
    res.json(data);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: "Error updating orders page data: " + error.message });
  }
};

module.exports = {
  getOrdersPageData,
  updateOrdersPageData,
};