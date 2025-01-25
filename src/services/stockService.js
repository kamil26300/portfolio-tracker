import axios from "axios";

const API_URL = "http://localhost:5000/api/stocks";

export const stockService = {
  initializePortfolio: async () => {
    try {
      const response = await axios.post(`${API_URL}/initialize`);
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  getAllStocks: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  addStock: async (stockData) => {
    try {
      const response = await axios.post(API_URL, stockData);
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  updateStock: async (symbol, stockData) => {
    try {
      const response = await axios.put(`${API_URL}/${symbol}`, stockData);
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  deleteStock: async (symbol) => {
    try {
      await axios.delete(`${API_URL}/${symbol}`);
    } catch (error) {
      return error.response;
    }
  },
};
