import React, { useState, useEffect, useCallback } from "react";

import WacthListItem from "./WatchListItem";
import BuyActionWindow from "./BuyActionWindow";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeSearchTab, setActiveSearchTab] = useState("#");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [orderType, setOrderType] = useState('BUY');



  // Static data for different tabs
  const tabData = {
    "#": [
      // Major Indices and Stocks
      { symbol: "^NSEI", name: "NIFTY 50", fullName: "NIFTY 50", type: "INDICES", exchange: "NSE" },
      { symbol: "^BSESN", name: "SENSEX", fullName: "SENSEX", type: "INDICES", exchange: "BSE" },
      { symbol: "^NSEMDCP100", name: "NIFTY MIDCAP 100", fullName: "NIFTY MIDCAP 100", type: "INDICES", exchange: "NSE" },
      { symbol: "^BSEBANKEX", name: "BANKEX", fullName: "BSE INDEX BANKEX", type: "INDICES", exchange: "BSE" },
      { symbol: "RELIANCE.NS", name: "RELIANCE", fullName: "Reliance Industries Ltd", type: "EQ", exchange: "NSE" },
      { symbol: "TCS.NS", name: "TCS", fullName: "Tata Consultancy Services Ltd", type: "EQ", exchange: "NSE" },
      { symbol: "HDFCBANK.NS", name: "HDFCBANK", fullName: "HDFC Bank Ltd", type: "EQ", exchange: "NSE" },
      { symbol: "INFY.NS", name: "INFY", fullName: "Infosys Ltd", type: "EQ", exchange: "NSE" },
    ],
    "MF": [
      { name: "Zerodha ELSS Tax Saver Nifty LargeMidcap 250 Index Fund", description: "Equity, ELSS, Direct plan", type: "MF", icon: "🔵" },
      { name: "Zerodha Nifty LargeMidcap 250 Index Fund", description: "Others, Index Funds/ETFs, Direct plan", type: "MF", icon: "🔵" },
      { name: "Zerodha Overnight Fund", description: "Debt, Overnight, Direct plan", type: "MF", icon: "🔵" },
      { name: "Zerodha Gold ETF FoF", description: "Others, Fund of Funds, Direct plan", type: "MF", icon: "🔵" },
      { name: "Zerodha Silver ETF FoF", description: "Others, Fund of Funds, Direct plan", type: "MF", icon: "🔵" },
      { name: "Zerodha Multi Asset Passive FoF", description: "Others, Fund of Funds, Direct plan", type: "MF", icon: "🔵" },
    ],
    "IPO": [
      { name: "CHTRBOX", fullName: "Chatterbox Technologies", date: "Open 25 Sep 2025 — 30 Sep 2025", type: "OPEN" },
      { name: "JKIPL", fullName: "Jinkushal Industries", date: "Open 25 Sep 2025 — 29 Sep 2025", type: "OPEN" },
      { name: "BHAVIK", fullName: "Bhavik Enterprises", date: "Open 25 Sep 2025 — 30 Sep 2025", type: "OPEN" },
      { name: "EARKART", fullName: "Earkart", date: "Open 25 Sep 2025 — 29 Sep 2025", type: "OPEN" },
      { name: "TRUALT", fullName: "Trualt Bioenergy", date: "Open 25 Sep 2025 — 29 Sep 2025", type: "OPEN" },
      { name: "GPAPL", fullName: "Gujarat Peanut & Agri Products", date: "Open 25 Sep 2025 — 29 Sep 2025", type: "OPEN" },
    ],
    "Events": [
      { name: "STARHFL", description: "Rights - 7:9 — 30 Sep 2025", type: "EQ" },
      { name: "DRONACHRYA", description: "Quarterly Results — 27 Sep 2025", type: "EQ" },
      { name: "TRUSTEDGE", description: "Rights - 49:85 — 1 Oct 2025", type: "EQ" },
    ],
    "ETF": [
      { name: "TOP100CASE", description: "ZERODHA", type: "ETF", icon: "🔵" },
      { name: "SML100CASE", description: "ZERODHA", type: "ETF", icon: "🔵" },
      { name: "SILVERCASE", description: "ZERODHA", type: "ETF", icon: "🔵" },
      { name: "MID150CASE", description: "ZERODHA", type: "ETF", icon: "🔵" },
      { name: "LTGILTCASE", description: "ZERODHA", type: "ETF", icon: "🔵" },
      { name: "LIQUIDCASE", description: "ZERODHA", type: "ETF", icon: "🔵" },
    ],
    "G-Secs": [
      { name: "GILT10YRBOND", description: "10 Year Government Bond", type: "G-SEC" },
      { name: "GILT5YRBOND", description: "5 Year Government Bond", type: "G-SEC" },
      { name: "GILT2YRBOND", description: "2 Year Government Bond", type: "G-SEC" },
      { name: "SDL2030", description: "State Development Loan 2030", type: "SDL" },
      { name: "SDL2028", description: "State Development Loan 2028", type: "SDL" },
    ]
  };

  // Comprehensive search database of Indian stocks and indices
  const searchDatabase = [
    // Major Indices
    { symbol: "^NSEI", name: "NIFTY 50", fullName: "NIFTY 50", type: "INDICES", exchange: "NSE" },
    { symbol: "^BSESN", name: "SENSEX", fullName: "SENSEX", type: "INDICES", exchange: "BSE" },
    { symbol: "^NSEMDCP100", name: "NIFTY MIDCAP 100", fullName: "NIFTY MIDCAP 100", type: "INDICES", exchange: "NSE" },
    { symbol: "^BSEBANKEX", name: "BANKEX", fullName: "BSE INDEX BANKEX", type: "INDICES", exchange: "BSE" },
    { symbol: "^NSEBANK", name: "NIFTY BANK", fullName: "NIFTY BANK", type: "INDICES", exchange: "NSE" },
    { symbol: "^BSEALLCAP", name: "ALLCAP", fullName: "BSE INDEX ALLCAP", type: "INDICES", exchange: "BSE" },
    { symbol: "^CNXIT", name: "NIFTY 100", fullName: "NIFTY 100", type: "INDICES", exchange: "NSE" },
    { symbol: "^NSEDIV", name: "NIFTY DIV OPPS 50", fullName: "NIFTY DIV OPPS 50", type: "INDICES", exchange: "NSE" },
    { symbol: "^NSECOM", name: "NIFTY COMMODITIES", fullName: "NIFTY COMMODITIES", type: "INDICES", exchange: "NSE" },
    { symbol: "^NSECONS", name: "NIFTY CONSUMPTION", fullName: "NIFTY CONSUMPTION", type: "INDICES", exchange: "NSE" },
    { symbol: "^NSEFIN", name: "NIFTY FIN SERVICE", fullName: "NIFTY FIN SERVICE", type: "INDICES", exchange: "NSE" },
    { symbol: "^NIFTY50PR2X", name: "NIFTY50 PR 2X LEV", fullName: "NIFTY50 PR 2X LEV", type: "INDICES", exchange: "NSE" },
    { symbol: "^NIFTY50PR1X", name: "NIFTY50 PR 1X INV", fullName: "NIFTY50 PR 1X INV", type: "INDICES", exchange: "NSE" },
    { symbol: "^NIFTY50TR2X", name: "NIFTY50 TR 2X LEV", fullName: "NIFTY50 TR 2X LEV", type: "INDICES", exchange: "NSE" },
    { symbol: "^NIFTY50TR1X", name: "NIFTY50 TR 1X INV", fullName: "NIFTY50 TR 1X INV", type: "INDICES", exchange: "NSE" },
    { symbol: "^NIFTYIT", name: "NIFTY IT", fullName: "NIFTY IT", type: "INDICES", exchange: "NSE" },
    { symbol: "^NSEMDCP50", name: "NIFTY MIDCAP 50", fullName: "NIFTY MIDCAP 50", type: "INDICES", exchange: "NSE" },

    // NIFTY Futures
    { symbol: "NIFTY25SEPFUT", name: "NIFTY SEP FUT", fullName: "NIFTY 50 SEP 2025 FUT", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25OCTFUT", name: "NIFTY OCT FUT", fullName: "NIFTY 50 OCT 2025 FUT", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25NOVFUT", name: "NIFTY NOV FUT", fullName: "NIFTY 50 NOV 2025 FUT", type: "NFO", exchange: "NSE" },
    
    // NIFTY Next 50 Futures
    { symbol: "NIFTYNXT5025SEPFUT", name: "NIFTYNXT50 SEP FUT", fullName: "NIFTY NEXT 50 SEP 2025 FUT", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTYNXT5025OCTFUT", name: "NIFTYNXT50 OCT FUT", fullName: "NIFTY NEXT 50 OCT 2025 FUT", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTYNXT5025NOVFUT", name: "NIFTYNXT50 NOV FUT", fullName: "NIFTY NEXT 50 NOV 2025 FUT", type: "NFO", exchange: "NSE" },
    
    // NIFTY Options (CE & PE)
    { symbol: "NIFTY25SEP24650CE", name: "NIFTY SEP 24650 CE", fullName: "NIFTY 50 SEP 2025 24650 CE", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25SEP24650PE", name: "NIFTY SEP 24650 PE", fullName: "NIFTY 50 SEP 2025 24650 PE", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25SEP24700CE", name: "NIFTY SEP 24700 CE", fullName: "NIFTY 50 SEP 2025 24700 CE", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25SEP24700PE", name: "NIFTY SEP 24700 PE", fullName: "NIFTY 50 SEP 2025 24700 PE", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25SEP24600CE", name: "NIFTY SEP 24600 CE", fullName: "NIFTY 50 SEP 2025 24600 CE", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25SEP24600PE", name: "NIFTY SEP 24600 PE", fullName: "NIFTY 50 SEP 2025 24600 PE", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25SEP24750CE", name: "NIFTY SEP 24750 CE", fullName: "NIFTY 50 SEP 2025 24750 CE", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25SEP24750PE", name: "NIFTY SEP 24750 PE", fullName: "NIFTY 50 SEP 2025 24750 PE", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25SEP24550CE", name: "NIFTY SEP 24550 CE", fullName: "NIFTY 50 SEP 2025 24550 CE", type: "NFO", exchange: "NSE" },
    { symbol: "NIFTY25SEP24550PE", name: "NIFTY SEP 24550 PE", fullName: "NIFTY 50 SEP 2025 24550 PE", type: "NFO", exchange: "NSE" },
    
    // Bank NIFTY Futures and Options
    { symbol: "BANKNIFTY25SEPFUT", name: "BANKNIFTY SEP FUT", fullName: "BANK NIFTY SEP 2025 FUT", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25OCTFUT", name: "BANKNIFTY OCT FUT", fullName: "BANK NIFTY OCT 2025 FUT", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25NOVFUT", name: "BANKNIFTY NOV FUT", fullName: "BANK NIFTY NOV 2025 FUT", type: "NFO", exchange: "NSE" },
    
    // BANKNIFTY Options with various strike prices
    { symbol: "BANKNIFTY25SEP54400CE", name: "BANKNIFTY SEP 54400 CE", fullName: "BANK NIFTY SEP 2025 54400 CE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP54400PE", name: "BANKNIFTY SEP 54400 PE", fullName: "BANK NIFTY SEP 2025 54400 PE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP54300CE", name: "BANKNIFTY SEP 54300 CE", fullName: "BANK NIFTY SEP 2025 54300 CE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP54300PE", name: "BANKNIFTY SEP 54300 PE", fullName: "BANK NIFTY SEP 2025 54300 PE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP54200CE", name: "BANKNIFTY SEP 54200 CE", fullName: "BANK NIFTY SEP 2025 54200 CE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP54200PE", name: "BANKNIFTY SEP 54200 PE", fullName: "BANK NIFTY SEP 2025 54200 PE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP54100CE", name: "BANKNIFTY SEP 54100 CE", fullName: "BANK NIFTY SEP 2025 54100 CE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP54100PE", name: "BANKNIFTY SEP 54100 PE", fullName: "BANK NIFTY SEP 2025 54100 PE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP54000CE", name: "BANKNIFTY SEP 54000 CE", fullName: "BANK NIFTY SEP 2025 54000 CE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP54000PE", name: "BANKNIFTY SEP 54000 PE", fullName: "BANK NIFTY SEP 2025 54000 PE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP52000CE", name: "BANKNIFTY SEP 52000 CE", fullName: "BANK NIFTY SEP 2025 52000 CE", type: "NFO", exchange: "NSE" },
    { symbol: "BANKNIFTY25SEP52000PE", name: "BANKNIFTY SEP 52000 PE", fullName: "BANK NIFTY SEP 2025 52000 PE", type: "NFO", exchange: "NSE" },

    // Major Stocks
    { symbol: "RELIANCE.NS", name: "RELIANCE", fullName: "Reliance Industries Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "TCS.NS", name: "TCS", fullName: "Tata Consultancy Services Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "HDFCBANK.NS", name: "HDFCBANK", fullName: "HDFC Bank Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "INFY.NS", name: "INFY", fullName: "Infosys Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "HINDUNILVR.NS", name: "HINDUNILVR", fullName: "Hindustan Unilever Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "ICICIBANK.NS", name: "ICICIBANK", fullName: "ICICI Bank Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "SBIN.NS", name: "SBIN", fullName: "State Bank of India", type: "EQ", exchange: "NSE" },
    { symbol: "BHARTIARTL.NS", name: "BHARTIARTL", fullName: "Bharti Airtel Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "ITC.NS", name: "ITC", fullName: "ITC Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "KOTAKBANK.NS", name: "KOTAKBANK", fullName: "Kotak Mahindra Bank Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "LT.NS", name: "LT", fullName: "Larsen & Toubro Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "HCLTECH.NS", name: "HCLTECH", fullName: "HCL Technologies Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "MARUTI.NS", name: "MARUTI", fullName: "Maruti Suzuki India Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "SUNPHARMA.NS", name: "SUNPHARMA", fullName: "Sun Pharmaceutical Industries Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "TATAMOTORS.NS", name: "TATAMOTORS", fullName: "Tata Motors Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "ONGC.NS", name: "ONGC", fullName: "Oil & Natural Gas Corporation Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "NTPC.NS", name: "NTPC", fullName: "NTPC Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "ASIANPAINT.NS", name: "ASIANPAINT", fullName: "Asian Paints Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "WIPRO.NS", name: "WIPRO", fullName: "Wipro Ltd", type: "EQ", exchange: "NSE" },
    { symbol: "TECHM.NS", name: "TECHM", fullName: "Tech Mahindra Ltd", type: "EQ", exchange: "NSE" },
  ];

  const fetchStockData = useCallback(async () => {
    // Stock symbols for Indian market (NSE)
    const stockSymbols = [
      { symbol: "HDFCBANK.NS", name: "HDFCBANK", exchange: "BSE" },
      { symbol: "INFY.NS", name: "INFY", exchange: "" },
      { symbol: "TCS.NS", name: "TCS", exchange: "BSE" },
      { symbol: "ONGC.NS", name: "ONGC", exchange: "" },
      { symbol: "HINDUNILVR.NS", name: "HINDUNILVR", exchange: "BSE" },
      { symbol: "GOLDBEES.NS", name: "GOLDBEES", exchange: "" },
      { symbol: "TATASTEEL.NS", name: "TATASTEEL", exchange: "" },
      { symbol: "NHPC.NS", name: "NHPC", exchange: "" },
      { symbol: "IREDA.NS", name: "IREDA", exchange: "" },
      { symbol: "URJA.NS", name: "URJA", exchange: "" },
      { symbol: "ACC.NS", name: "ACC", exchange: "" },
      { symbol: "TAJGVK.NS", name: "TAJGVK", exchange: "" },
      { symbol: "TATAMOTORS.NS", name: "TATAMOTORS", exchange: "" },
      { symbol: "YESBANK.NS", name: "YESBANK", exchange: "" },
      { symbol: "IOC.NS", name: "IOC", exchange: "" },
      { symbol: "BANKBARODA.NS", name: "BANKBARODA", exchange: "" },
    ];

    try {
      setLoading(true);
      const promises = stockSymbols.map(async (stock) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/stocks/stock/${stock.symbol}`);
          const data = await response.json();
          
          if (data.chart?.result?.[0]) {
            const result = data.chart.result[0];
            const currentPrice = result.meta.regularMarketPrice || result.meta.previousClose;
            const previousClose = result.meta.previousClose;
            const change = currentPrice - previousClose;
            const changePercent = (change / previousClose) * 100;

            return {
              symbol: stock.symbol,
              name: stock.name,
              exchange: stock.exchange,
              price: currentPrice.toFixed(2),
              change: change.toFixed(2),
              percent: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
              isDown: change < 0
            };
          }
        } catch (error) {
          console.error(`Error fetching data for ${stock.symbol}:`, error);
        }
        
        // Return fallback data if API fails
        return {
          symbol: stock.symbol,
          name: stock.name,
          exchange: stock.exchange,
          price: (Math.random() * 1000 + 100).toFixed(2),
          change: (Math.random() * 20 - 10).toFixed(2),
          percent: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(2)}%`,
          isDown: Math.random() > 0.5
        };
      });

      const results = await Promise.all(promises);
      setWatchlist(results.filter(Boolean));
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search functionality
  const handleSearchClick = () => {
    setShowSearchOverlay(true);
    // Show all popular stocks initially
    setSearchResults(searchDatabase.slice(0, 15));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length === 0) {
      setSearchResults(searchDatabase.slice(0, 15));
    } else {
      const filtered = searchDatabase.filter(stock => 
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.fullName.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 15));
    }
  };

  const handleSearchClose = () => {
    setShowSearchOverlay(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleBuyStock = (stock) => {
    setSelectedStock(stock);
    setOrderType('BUY');
    setShowBuyModal(true);
  };

  const handleSellStock = (stock) => {
    setSelectedStock(stock);
    setOrderType('SELL');
    setShowBuyModal(true);
  };

  const handleCloseModal = () => {
    setShowBuyModal(false);
    setSelectedStock(null);
  };

  const handleOrderSubmit = async (orderData) => {
    console.log('Order submitted:', orderData);
    
    try {
      // Only add to positions if it's a BUY order
      if (orderData.orderType === 'BUY') {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/positions/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stock: orderData.stock,
            orderType: orderData.orderType,
            quantity: orderData.quantity,
            price: orderData.price,
            exchange: orderData.exchange
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Position added successfully:', result);
          alert(`${orderData.orderType} order placed successfully!\n\nStock: ${orderData.stock.name}\nQuantity: ${orderData.quantity}\nPrice: ₹${orderData.price.toFixed(2)}\nTotal: ₹${orderData.total}\n\nPosition added to your portfolio!`);
        } else {
          console.error('Failed to add position');
          alert(`${orderData.orderType} order placed successfully!\n\nStock: ${orderData.stock.name}\nQuantity: ${orderData.quantity}\nPrice: ₹${orderData.price.toFixed(2)}\nTotal: ₹${orderData.total}\n\nNote: Failed to add to positions.`);
        }
      } else {
        // For SELL orders, just show success message
        alert(`${orderData.orderType} order placed successfully!\n\nStock: ${orderData.stock.name}\nQuantity: ${orderData.quantity}\nPrice: ₹${orderData.price.toFixed(2)}\nTotal: ₹${orderData.total}`);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`${orderData.orderType} order placed successfully!\n\nStock: ${orderData.stock.name}\nQuantity: ${orderData.quantity}\nPrice: ₹${orderData.price.toFixed(2)}\nTotal: ₹${orderData.total}\n\nNote: Error adding to positions.`);
    }
    
    setShowBuyModal(false);
    setSelectedStock(null);
  };

  const handleAnalyticsClick = (stock) => {
    // Navigate to chart page in a new tab
    const chartUrl = `/chart/${stock.symbol}`;
    window.open(chartUrl, '_blank');
  };

  // Function to get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return watchlist.slice(startIndex, endIndex);
  };

  const addToWatchlist = async (stock) => {
    try {
      // Fetch real data for the stock
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/stocks/stock/${stock.symbol}`);
      const data = await response.json();
      
      let newStock;
      if (data.chart?.result?.[0]) {
        const result = data.chart.result[0];
        const currentPrice = result.meta.regularMarketPrice || result.meta.previousClose;
        const previousClose = result.meta.previousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        newStock = {
          symbol: stock.symbol,
          name: stock.name,
          exchange: stock.exchange,
          price: currentPrice.toFixed(2),
          change: change.toFixed(2),
          percent: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
          isDown: change < 0
        };
      } else {
        // Fallback data
        newStock = {
          symbol: stock.symbol,
          name: stock.name,
          exchange: stock.exchange,
          price: (Math.random() * 1000 + 100).toFixed(2),
          change: (Math.random() * 20 - 10).toFixed(2),
          percent: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(2)}%`,
          isDown: Math.random() > 0.5
        };
      }

      // Check if stock already exists
      const exists = watchlist.some(item => item.name === stock.name);
      if (!exists) {
        setWatchlist(prev => [...prev, newStock]);
      }
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchStockData();
    };
    
    loadData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchStockData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchStockData]);

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input 
          type="text" 
          name="search" 
          id="search" 
          placeholder="Search eg: infy bse, nifty fut, index fund, etc" 
          className="search"
          value={searchQuery}
          onClick={handleSearchClick}
          onChange={handleSearchChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <span className="counts"> {watchlist.length} / 250</span>
      </div>

      {/* Search Overlay */}
      {showSearchOverlay && (
        <div className="search-overlay">
          <div className="search-overlay-header">
            <div className="search-tabs">
              {Object.keys(tabData).map((tab) => (
                <span 
                  key={tab}
                  className={`search-tab ${activeSearchTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveSearchTab(tab)}
                  style={{ cursor: 'pointer' }}
                >
                  {tab}
                </span>
              ))}
            </div>
            <button className="search-close" onClick={handleSearchClose}>×</button>
          </div>
          
          {/* Search input for # tab only */}
          {activeSearchTab === '#' && (
            <div className="search-input-container" style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
              <input
                type="text"
                placeholder="Search stocks, instruments..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          )}
          
          <div className="search-results">
            {activeSearchTab === '#' ? (
              // Show search results for stocks
              searchResults.map((stock, index) => (
                <div key={index} className="search-result-item">
                  <div className="stock-info">
                    <div className="stock-name">{stock.name}</div>
                    <div className="stock-details">
                      <span className="stock-full-name">{stock.fullName}</span>
                      <span className="stock-type">{stock.type}</span>
                    </div>
                  </div>
                  <div className="stock-actions">
                    <button 
                      className="action-btn buy-btn"
                      onClick={() => handleBuyStock(stock)}
                      title="Buy"
                    >
                      B
                    </button>
                    <button 
                      className="action-btn sell-btn"
                      onClick={() => handleSellStock(stock)}
                      title="Sell"
                    >
                      S
                    </button>
                    <button 
                      className="action-btn chart-btn"
                      onClick={() => handleAnalyticsClick(stock)}
                      title="Analytics"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
                      </svg>
                    </button>
                    <button 
                      className="action-btn add-btn"
                      onClick={() => addToWatchlist(stock)}
                      title="Add to watchlist"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // Show static content for other tabs
              tabData[activeSearchTab].map((item, index) => (
                <div key={index} className="tab-content-item" style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  {activeSearchTab === 'MF' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ 
                          width: '8px', 
                          height: '8px', 
                          backgroundColor: '#387ED1', 
                          borderRadius: '50%', 
                          marginRight: '8px' 
                        }}></span>
                        <div style={{ fontWeight: '500', fontSize: '13px' }}>{item.name}</div>
                      </div>
                      <div style={{ color: '#666', fontSize: '12px', marginLeft: '16px' }}>
                        {item.description}
                      </div>
                    </div>
                  )}
                  
                  {activeSearchTab === 'IPO' && (
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '13px' }}>{item.name}</div>
                      <div style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>
                        {item.fullName}
                      </div>
                      <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '2px' }}>
                        {item.date}
                      </div>
                    </div>
                  )}
                  
                  {activeSearchTab === 'Events' && (
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '13px' }}>{item.name}</div>
                      <div style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>
                        {item.description}
                      </div>
                    </div>
                  )}
                  
                  {activeSearchTab === 'ETF' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ 
                          width: '8px', 
                          height: '8px', 
                          backgroundColor: '#387ED1', 
                          borderRadius: '50%', 
                          marginRight: '8px' 
                        }}></span>
                        <div style={{ fontWeight: '500', fontSize: '13px' }}>{item.name}</div>
                      </div>
                      <div style={{ color: '#666', fontSize: '12px', marginLeft: '16px' }}>
                        {item.description}
                      </div>
                    </div>
                  )}
                  
                  {activeSearchTab === 'G-Secs' && (
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '13px' }}>{item.name}</div>
                      <div style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="watchlist-header">
        <span className="default-group">Default ({watchlist.length}) - Page {currentPage}</span>
        <button className="new-group-btn">+ New group</button>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Loading real market data...
        </div>
      ) : (
        <ul className="list">
          {getCurrentPageItems().map((stock, index) => {
            return <WacthListItem stock={stock} key={index} />;
          })}
        </ul>
      )}

      {/* Pagination */}
      {watchlist.length > itemsPerPage && (
        <div className="pagination">
          {Array.from({ length: Math.ceil(watchlist.length / itemsPerPage) }, (_, i) => (
            <span 
              key={i + 1}
              className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
              style={{ cursor: 'pointer' }}
            >
              {i + 1}
            </span>
          ))}
        </div>
      )}

      {/* Buy/Sell Modal */}
      {showBuyModal && selectedStock && (
        <BuyActionWindow
          stock={selectedStock}
          orderType={orderType}
          onClose={handleCloseModal}
          onSubmit={handleOrderSubmit}
        />
      )}

      {/* <DoughnutChart data={data} /> */}
    </div>
  );
};

// Icon components


export default WatchList;
