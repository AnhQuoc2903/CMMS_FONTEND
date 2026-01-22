import { Card, Table, Tag, Spin } from "antd";
import { useEffect, useState } from "react";
import { getSLATechnicianRanking } from "../api/sla.api";

export default function SLATechnicianRanking() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSLATechnicianRanking()
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "rank",
      width: 60,
    },
    {
      title: "Technician",
      dataIndex: ["technician", "name"],
    },
    {
      title: "Total WO",
      dataIndex: "total",
    },
    {
      title: "On Time",
      dataIndex: "onTime",
      render: (v) => <Tag color="green">{v}</Tag>,
    },
    {
      title: "Late",
      dataIndex: "late",
      render: (v) => <Tag color="red">{v}</Tag>,
    },
    {
      title: "SLA %",
      dataIndex: "slaRate",
      render: (v) => (
        <Tag color={v >= 90 ? "green" : v >= 70 ? "orange" : "red"}>{v}%</Tag>
      ),
    },
  ];

  return (
    <Card title="SLA Technician Ranking">
      {loading ? (
        <Spin />
      ) : (
        <Table
          rowKey="rank"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      )}
    </Card>
  );
}
