import Stock from "../models/Stock.js";
import priceService from "../services/priceService.js";
import { AppError } from "../utils/errorHandler.js";

export const initializePortfolio = async (req, res, next) => {
  try {
    await Stock.destroy({ where: {} });
    const randomStocks = await priceService.getRandomStocks();

    const stockPromises = randomStocks.map(async (stock) => {
      const currentPrice = await priceService.getStockPrice(stock.symbol);
      return Stock.create({
        symbol: stock.symbol,
        quantity: stock.quantity,
        name: stock.name,
        purchasePrice: currentPrice,
        currentPrice: currentPrice,
      });
    });
    const portfolio = await Promise.all(stockPromises);
    res.status(201).json(portfolio);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const getAllStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.findAll();

    const stocksWithPrices = await Promise.all(
      stocks.map(async (stock) => {
        const currentPrice = await priceService.getStockPrice(stock.symbol);
        stock.currentPrice = currentPrice;
        await stock.save();
        return stock;
      })
    );

    const portfolioMetrics = calculatePortfolioMetrics(stocksWithPrices);

    res.json({ stocks: stocksWithPrices, metrics: portfolioMetrics });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const addStock = async (req, res, next) => {
  try {
    const { name, symbol, quantity = 1 } = req.body;

    const existingStock = await Stock.findByPk(symbol);
    if (existingStock) {
      return res.status(400).json({ message: "Stock symbol already exists." });
    }

    // Validate symbol exists
    const currentPrice = await priceService.getStockPrice(symbol);

    const stock = await Stock.create({
      symbol,
      quantity,
      name,
      purchasePrice: currentPrice,
      currentPrice: currentPrice,
    });

    res.status(201).json(stock);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findByPk(symbol);

    if (!stock) {
      return next(new AppError("Stock not found", 404));
    }

    const currentPrice = await priceService.getStockPrice(stock.symbol);
    stock.currentPrice = currentPrice;

    const updatedStock = await stock.update({
      ...req.body,
      currentPrice,
    });

    res.json(updatedStock);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteStock = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const deleted = await Stock.destroy({ where: { symbol } });

    if (deleted) {
      res.status(204).send();
    } else {
      next(new AppError("Stock not found", 404));
    }
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const calculatePortfolioMetrics = (stocks) => {
  const totalValue = stocks.reduce(
    (sum, stock) => sum + stock.currentPrice * stock.quantity,
    0
  );

  const topPerformingStock = stocks.reduce(
    (top, stock) =>
      stock.currentPrice > (top?.currentPrice || 0) ? stock : top,
    {}
  );

  return {
    totalValue: totalValue.toFixed(2),
    stockCount: stocks.length,
    topPerformingStock: topPerformingStock.symbol || "N/A",
  };
};

export const getStockDetails = async (req, res, next) => {
  try {
    const { symbol } = req.params;

    const currentPrice = await priceService.getStockPrice(symbol);

    res.json({
      symbol,
      currentPrice,
    });
  } catch (error) {
    next(new AppError(error.message, 404));
  }
};
