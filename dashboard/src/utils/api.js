// API configuration utility
export const getApiBase = () => {
  // Always use production backend for deployed app
  return process.env.REACT_APP_API_URL || 'https://zerodha-kite-890j.onrender.com';
};

export const API_BASE_URL = getApiBase();