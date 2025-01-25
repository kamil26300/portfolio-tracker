import React from "react";
import { ConfigProvider } from "antd";
import Dashboard from "./components/Dashboard";
import "antd/dist/reset.css";
import "./index.css";

function App() {
  return (
    <ConfigProvider>
      <Dashboard />
    </ConfigProvider>
  );
}

export default App;
