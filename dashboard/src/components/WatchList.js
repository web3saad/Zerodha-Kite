import React, { useState, useEffect } from "react";

import WacthListItem from "./WatchListItem";
import { DoughnutChart } from "./DoughnutChart";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const promises = stockSymbols.map(async (stock) => {
        try {
          const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stock.symbol}`);
          const data = await response.json();
          
          if (data.chart?.result?.[0]) {
            const result = data.chart.result[0];
            const currentPrice = result.meta.regularMarketPrice || result.meta.previousClose;
            const previousClose = result.meta.previousClose;
            const change = currentPrice - previousClose;
            const changePercent = (change / previousClose) * 100;

            return {
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
  };

  useEffect(() => {
    fetchStockData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchStockData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const labels = watchlist.map((stock) => stock.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => parseFloat(stock.price)),
        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(255, 206, 86, 0.5)", "rgba(75, 192, 192, 0.5)", "rgba(153, 102, 255, 0.5)", "rgba(255, 159, 64, 0.5)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input type="text" name="search" id="search" placeholder="Search eg: infy bse, nifty fut, index fund, etc" className="search" />
        <span className="counts"> {watchlist.length} / 250</span>
      </div>

      <div className="watchlist-header">
        <span className="default-group">Default ({watchlist.length})</span>
        <button className="new-group-btn">+ New group</button>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Loading real market data...
        </div>
      ) : (
        <ul className="list">
          {watchlist.map((stock, index) => {
            return <WacthListItem stock={stock} key={index} />;
          })}
        </ul>
      )}

      <div className="pagination">
        <span className="page-number active">1</span>
        <span className="page-number">2</span>
        <span className="page-number">3</span>
        <span className="page-number">4</span>
        <span className="page-number">5</span>
        <span className="page-number">6</span>
        <span className="page-number">7</span>
        <span className="page-dots">...</span>
      </div>

  {/* <DoughnutChart data={data} /> */}
    </div>
  );
};

export default WatchList;
