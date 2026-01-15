import { Card, Table, Tag, Button } from "antd";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAssetDetail,
  getAssetHistory,
  getAssetPMHistory,
} from "../api/asset.api";

export default function AssetDetail() {
  const { id } = useParams();

  const [asset, setAsset] = useState(null);
  const [logs, setLogs] = useState([]);
  const [pmHistory, setPmHistory] = useState([]);

  useEffect(() => {
    getAssetDetail(id).then((r) => setAsset(r.data));
    getAssetHistory(id).then((r) => setLogs(r.data));
  }, [id]);
  useEffect(() => {
    getAssetPMHistory(id).then((r) => setPmHistory(r.data));
  }, [id]);

  if (!asset) return null;

  return (
    <>
      <Button style={{ marginBottom: 16 }}>
        <Link to="/assets">← Back to Assets</Link>
      </Button>

      <Card title={`Asset: ${asset.name}`}>
        <p>
          <b>Code:</b> {asset.code}
        </p>
        <p>
          <b>Category:</b> {asset.category}
        </p>
        <p>
          <b>Location:</b> {asset.location}
        </p>

        <h3 style={{ marginTop: 24 }}>Asset History</h3>

        <Table
          rowKey="_id"
          dataSource={logs}
          columns={[
            {
              title: "Action",
              dataIndex: "action",
              render: (v) => {
                const map = {
                  ASSIGNED: { text: "Gán vào WO", color: "blue" },
                  UNASSIGNED: { text: "Gỡ khỏi WO", color: "orange" },
                  MAINTAINED: { text: "Đã bảo trì", color: "green" },
                  AVAILABLE: { text: "Sẵn sàng sử dụng", color: "green" },
                };
                return <Tag color={map[v]?.color}>{map[v]?.text}</Tag>;
              },
            },

            {
              title: "Work Order",
              render: (_, r) => r.workOrder?.title || "-",
            },
            {
              title: "Date",
              dataIndex: "createdAt",
              render: (v) => new Date(v).toLocaleString(),
            },
          ]}
        />

        <h3 style={{ marginTop: 24 }}>Preventive Maintenance History</h3>

        <Table
          rowKey="_id"
          dataSource={pmHistory}
          locale={{ emptyText: "No preventive maintenance yet" }}
          columns={[
            {
              title: "Work Order",
              render: (_, r) => (
                <Link to={`/work-orders/${r._id}`}>{r.title}</Link>
              ),
            },
            {
              title: "Maintenance Plan",
              render: (_, r) => r.maintenancePlan?.name,
            },
            {
              title: "Frequency",
              render: (_, r) => r.maintenancePlan?.frequency,
            },
            {
              title: "Status",
              dataIndex: "status",
              render: (s) => <Tag color="blue">{s}</Tag>,
            },
            {
              title: "Created At",
              dataIndex: "createdAt",
              render: (v) => new Date(v).toLocaleString(),
            },
          ]}
        />
      </Card>
    </>
  );
}
