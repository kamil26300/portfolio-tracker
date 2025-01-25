import axios from 'axios';
import { AppError } from '../utils/errorHandler.js';

const topStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'NFLX', name: 'Netflix, Inc.' },
  { symbol: 'INTC', name: 'Intel Corporation' },
  { symbol: 'CSCO', name: 'Cisco Systems, Inc.' },
];

class PriceService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://finnhub.io/api/v1';
  }

  async getStockPrice(symbol) {
    try {
      const response = await axios.get(`${this.baseUrl}/quote`, {
        params: {
          symbol: symbol,
          token: this.apiKey
        }
      });      
      const { c: currentPrice } = response.data;
      
      if (!currentPrice) {
        throw new AppError(`Unable to fetch price for ${symbol}`, 404);
      }

      return parseFloat(currentPrice);
    } catch (error) {
      throw new AppError(`Price fetch error: ${error.message}`, 500);
    }
  }

  async getRandomStocks() {
    return topStocks
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        quantity: 1,
      }));
  }
}

export default new PriceService(process.env.FINNHUB_API_KEY);