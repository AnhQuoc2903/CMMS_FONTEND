import { Table, Tag, Empty } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkOrders } from "../api/workOrder.api";

export default function WorkOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    getWorkOrders()
      .then((r) => setData(r.data.data ?? r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Table
      loading={loading}
      rowKey="_id"
      dataSource={data}
      locale={{ emptyText: <Empty description="No work orders yet" /> }}
      onRow={(record) => ({
        onClick: () => nav(`/work-orders/${record._id}`),
      })}
      columns={[
        { title: "Title", dataIndex: "title" },
        {
          title: "Status",
          dataIndex: "status",
          render: (s) => <Tag color={s === "DONE" ? "green" : "blue"}>{s}</Tag>,
        },
      ]}
    />
  );
}
