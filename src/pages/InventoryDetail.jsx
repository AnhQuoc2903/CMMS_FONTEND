import { Tabs, Table } from "antd";
import { useEffect, useState } from "react";
import {
  getSparePartDetail,
  getInventoryBatches,
  getInventoryHistory,
} from "../api/inventory.api";
import { useParams } from "react-router-dom";

export default function InventoryDetail() {
  const { id } = useParams();

  const [detail, setDetail] = useState({});
  const [batches, setBatches] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const d = await getSparePartDetail(id);
      const b = await getInventoryBatches(id);
      const h = await getInventoryHistory(id);

      setDetail(d.data);
      setBatches(b.data);
      setHistory(h.data);
    };

    if (id) load();
  }, [id]);

  return (
    <Tabs
      items={[
        {
          key: "specs",
          label: "Specs",
          children: (
            <Table
              rowKey={(r, i) => i}
              dataSource={detail.specs || []}
              pagination={false}
              columns={[
                { title: "Key", dataIndex: "key" },
                { title: "Value", dataIndex: "value" },
                { title: "Unit", dataIndex: "unit" },
              ]}
            />
          ),
        },
        {
          key: "batches",
          label: "Batches",
          children: (
            <Table
              rowKey="_id"
              dataSource={batches}
              columns={[
                { title: "Quantity", dataIndex: "quantity" },
                { title: "Remaining", dataIndex: "remaining" },
                {
                  title: "Received",
                  dataIndex: "receivedAt",
                  render: (v) => (v ? new Date(v).toLocaleString() : "-"),
                },
              ]}
            />
          ),
        },
        {
          key: "history",
          label: "History",
          children: (
            <Table
              rowKey="_id"
              dataSource={history}
              columns={[
                { title: "Type", dataIndex: "type" },
                { title: "Quantity", dataIndex: "quantity" },
                { title: "Before", dataIndex: "beforeQty" },
                { title: "After", dataIndex: "afterQty" },
                {
                  title: "User",
                  dataIndex: ["performedBy", "name"],
                },
                {
                  title: "Time",
                  dataIndex: "createdAt",
                  render: (v) => new Date(v).toLocaleString(),
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
