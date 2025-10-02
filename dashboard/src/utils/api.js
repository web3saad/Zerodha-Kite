// API configuration utility
export const getApiBase = () => {
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : (process.env.REACT_APP_API_URL || 'https://zerodha-kite-890j.onrender.com');
};

export const API_BASE_URL = getApiBase();