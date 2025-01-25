import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import { stockService } from "../services/stockService";

const StockForm = ({
  visible,
  onClose,
  onStockAdded,
  initialValues = {},
  isEditing = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = isEditing
        ? await stockService.updateStock(values.symbol, values)
        : await stockService.addStock(values);

      if (response.status >= 400 && response.status <= 600) message.error(response.data.message);
      else
        message.success(
          isEditing
            ? "Stock updated Successfully!"
            : "Stock submission successful!"
        );

      onStockAdded(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Stock submission failed", error);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Stock" : "Add New Stock"}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="symbol"
          label="Stock Symbol"
          rules={[{ required: true, message: "Please input stock symbol!" }]}
        >
          <Input placeholder="e.g. AAPL" disabled={isEditing} />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Please input stock name!" }]}
          name="name"
          label="Stock Name"
        >
          <Input placeholder="Apple Inc." />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, type: "number", min: 1 }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StockForm;
