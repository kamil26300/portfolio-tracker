import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Button, message } from "antd";
import { DollarOutlined, StockOutlined, PlusOutlined } from "@ant-design/icons";
import { stockService } from "../services/stockService";
import StockForm from "./StockForm";
import StockList from "./StockList";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [metrics, setMetrics] = useState({
    totalValue: 0,
    stockCount: 0,
    topPerformingStock: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchStocks = async () => {
    try {
      const { stocks, metrics } = await stockService.getAllStocks();
      setStocks(stocks);
      setMetrics(metrics);
    } catch (error) {
      console.error("Error fetching stocks", error);
    }
  };

  const initializePortfolio = async () => {
    try {
      await stockService.initializePortfolio();
      await fetchStocks();
      message.success("Portfolio Resetted Successfully!");
    } catch (error) {
      console.error("Error initializing portfolio", error);
      message.error("Failed to reset portfolio");
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Portfolio Value"
              value={metrics.totalValue}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Number of Stocks"
              value={metrics.stockCount}
              valueStyle={{ color: "#cf1322" }}
              prefix={<StockOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Top Performing Stock"
              value={metrics.topPerformingStock}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      <div className="flex justify-between items-center mb-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsFormVisible(true)}
        >
          Add Stock
        </Button>
        <Button type="dashed" onClick={initializePortfolio}>
          Reset Portfolio
        </Button>
      </div>

      <StockForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onStockAdded={fetchStocks}
      />

      <StockList
        stocks={stocks}
        onStockUpdated={fetchStocks}
        onStockDeleted={fetchStocks}
      />
    </div>
  );
};

export default Dashboard;
