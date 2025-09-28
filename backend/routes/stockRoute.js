const express = require("express");
const router = express.Router();

// Proxy endpoint for Yahoo Finance data
router.get("/stock/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const fetch = require('node-fetch');
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stock data',
      message: error.message 
    });
  }
});

// Get multiple stocks data
router.post("/stocks", async (req, res) => {
  try {
    const { symbols } = req.body;
    const fetch = require('node-fetch');
    
    const promises = symbols.map(async (symbol) => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
        const response = await fetch(url);
        const data = await response.json();
        return { symbol, data };
      } catch (error) {
        return { symbol, error: error.message };
      }
    });
    
    const results = await Promise.all(promises);
    res.json(results);
  } catch (error) {
    console.error('Error fetching multiple stocks:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stocks data',
      message: error.message 
    });
  }
});

module.exports = router;