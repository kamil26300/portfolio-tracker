import React, { useState } from "react";
import { Table, Button, Space, Tag, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { stockService } from "../services/stockService";
import StockForm from "./StockForm";
import { useMediaQuery } from "react-responsive";

const StockList = ({ stocks, onStockUpdated, onStockDeleted }) => {
  const [editingStock, setEditingStock] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Delete Stock",
      content: "Are you sure you want to delete this stock?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await stockService.deleteStock(id);
          message.success("Stock deleted");
          onStockDeleted();
        } catch (error) {
          message.error("Delete failed");
        }
      },
    });
  };

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      fixed: "left",
      width: isSmallScreen ? 20 : 100,
      render: (symbol, record) => {
        const currentPrice = record.currentPrice;
        const purchasePrice = parseFloat(record.purchasePrice);
        return (
          <Tag
            color={`${
              currentPrice !== purchasePrice
                ? currentPrice > purchasePrice
                  ? "green"
                  : "red"
                : "blue"
            }`}
          >
            {symbol}
          </Tag>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: isSmallScreen ? 30 : 100,
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
      width: isSmallScreen ? 70 : 150,
    },
    {
      title: "Current Price",
      dataIndex: "currentPrice",
      key: "currentPrice",
      render: (price) => `$${price.toFixed(2)}`,
      width: isSmallScreen ? 70 : 150,
    },
    {
      title: "Total Value",
      key: "totalValue",
      render: (_, record) =>
        `$${(record.currentPrice * record.quantity).toFixed(2)}`,
      width: isSmallScreen ? 30 : 150,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: isSmallScreen ? 20 : 100,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => {
              setEditingStock(record);
              setIsEditModalVisible(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <Table
        columns={columns}
        dataSource={stocks}
        rowKey="id"
        scroll={{ x: 1000 }}
        pagination={{
          responsive: true,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} stocks`,
        }}
        className="w-full"
      />

      {editingStock && (
        <StockForm
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onStockAdded={async (updatedStock) => {
            try {
              await stockService.updateStock(editingStock.id, updatedStock);
              message.success("Stock updated");
              onStockUpdated();
              setIsEditModalVisible(false);
            } catch (error) {
              message.error("Update failed");
            }
          }}
          initialValues={editingStock}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default StockList;
