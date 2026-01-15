import { Alert, List, Tag } from "antd";
import { useEffect, useState } from "react";
import { getLowStock } from "../api/inventory.api";

export default function LowStockAlert({ reload }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getLowStock().then((res) => setData(res.data));
  }, [reload]); // 👈 QUAN TRỌNG

  if (!data.length) return null; // ❗ không có thì không hiện

  return (
    <Alert
      type="warning"
      showIcon
      message="⚠️ Low Stock Warning"
      description={
        <List
          size="small"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <b>{item.name}</b>
              <Tag color="red" style={{ marginLeft: 8 }}>
                {item.quantity} left
              </Tag>
              <span style={{ marginLeft: 8 }}>(Min: {item.minStock})</span>
            </List.Item>
          )}
        />
      }
    />
  );
}
