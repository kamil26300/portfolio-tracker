import express from "express";
import {
  initializePortfolio,
  getAllStocks,
  addStock,
  updateStock,
  deleteStock,
} from "../controllers/stockController.js";

const router = express.Router();

router.post("/initialize", initializePortfolio);
router.get("/", getAllStocks);
router.post("/", addStock);
router.put("/:symbol", updateStock);
router.delete("/:symbol", deleteStock);

export default router;
