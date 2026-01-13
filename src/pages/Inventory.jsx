import { Table } from "antd";
import { useEffect, useState } from "react";
import { getInventory } from "../api/inventory.api";

export default function Inventory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getInventory().then((r) => setData(r.data));
  }, []);

  return (
    <Table
      rowKey="_id"
      dataSource={data}
      columns={[
        { title: "Name", dataIndex: "name" },
        { title: "Quantity", dataIndex: "quantity" },
      ]}
    />
  );
}
