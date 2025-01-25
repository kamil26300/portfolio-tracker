import React, { useState } from "react";
import { Table, Button, Space, Tag, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { stockService } from "../services/stockService";
import StockForm from "./StockForm";

const StockList = ({ stocks, onStockUpdated, onStockDeleted }) => {
  const [editingStock, setEditingStock] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleDelete = async (symbol) => {
    Modal.confirm({
      title: "Are you sure you want to delete this stock?",
      content: "This action cannot be undone",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          await stockService.deleteStock(symbol);
          message.success("Stock deleted successfully");
          onStockDeleted();
        } catch (error) {
          message.error("Failed to delete stock");
          console.error("Stock deletion failed", error);
        }
      },
    });
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setIsEditModalVisible(true);
  };

  const handleUpdateStock = async (updatedStock) => {
    try {
      await stockService.updateStock(editingStock.symbol, updatedStock);
      message.success("Stock updated successfully");
      onStockUpdated();
      setIsEditModalVisible(false);
    } catch (error) {
      message.error("Failed to update stock");
      console.error("Stock update failed", error);
    }
  };

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => <Tag color="blue">{symbol}</Tag>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: "Current Price",
      dataIndex: "currentPrice",
      key: "currentPrice",
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: "Total Value",
      key: "totalValue",
      render: (_, record) =>
        `$${(record.currentPrice * record.quantity).toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            onClick={() => handleDelete(record.symbol)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={stocks} rowKey="symbol" />

      {editingStock && (
        <StockForm
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onStockAdded={handleUpdateStock}
          initialValues={editingStock}
          isEditing={true}
        />
      )}
    </>
  );
};

export default StockList;
