import { Table, Tag, Card } from "antd";
import { useEffect, useState } from "react";
import { getInventoryLogs } from "../api/inventoryLog.api";

export default function InventoryHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getInventoryLogs();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Card title="📊 Inventory History">
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={data}
        columns={[
          {
            title: "Time",
            dataIndex: "createdAt",
            render: (v) => new Date(v).toLocaleString(),
          },
          {
            title: "Spare Part",
            render: (_, r) => r.sparePart?.name || "-",
          },
          {
            title: "Type",
            dataIndex: "type",
            render: (t) => <Tag color={t === "OUT" ? "red" : "green"}>{t}</Tag>,
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
          },
          {
            title: "Before → After",
            render: (_, r) => `${r.beforeQty} → ${r.afterQty}`,
          },
          {
            title: "Work Order",
            render: (_, r) => {
              if (r.workOrder) {
                return <b>W0-{r.workOrder.title}</b>;
              }

              if (r.type === "IN") {
                return <Tag color="blue">Manual</Tag>;
              }

              return "-";
            },
          },

          {
            title: "Performed By",
            render: (_, r) =>
              r.performedBy ? (
                <>
                  <b>{r.performedBy.name}</b>
                  <br />
                  <small>{r.performedBy.email}</small>
                </>
              ) : (
                "-"
              ),
          },
        ]}
      />
    </Card>
  );
}
