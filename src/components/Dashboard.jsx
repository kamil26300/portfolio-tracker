import React, { useState, useEffect } from "react";
import { Card, Statistic, Button, Spin, Alert } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import StockForm from "./StockForm";
import StockList from "./StockList";
import { stockService } from "../services/stockService";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [metrics, setMetrics] = useState({
    totalValue: 0,
    stockCount: 0,
    topPerformingStock: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const { stocks, metrics } = await stockService.getAllStocks();
      setStocks(stocks);
      setMetrics(metrics);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          closable
          className="mb-4"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="shadow-card hover:scale-105 transition-transform duration-300"
          bordered={false}
        >
          <Statistic
            title="Total Portfolio Value"
            value={metrics.totalValue}
            prefix="$"
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>

        <Card
          className="shadow-card hover:scale-105 transition-transform duration-300"
          bordered={false}
        >
          <Statistic
            title="Number of Stocks"
            value={metrics.stockCount}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>

        <Card
          className="shadow-card hover:scale-105 transition-transform duration-300"
          bordered={false}
        >
          <Statistic
            title="Top Performing Stock"
            value={metrics.topPerformingStock}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex gap-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsFormVisible(true)}
            className="w-full sm:w-auto"
          >
            Add Stock
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchStocks}
            className="w-full sm:w-auto"
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <StockList
          stocks={stocks}
          onStockUpdated={fetchStocks}
          onStockDeleted={fetchStocks}
        />
      )}

      <StockForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onStockAdded={fetchStocks}
      />
    </div>
  );
};

export default Dashboard;
