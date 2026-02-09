import { Card, Table, Tag, Button, Statistic } from "antd";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAssetDetail,
  getAssetHistory,
  getAssetPMHistory,
  getAssetDowntimeDetail,
} from "../api/asset.api";

export default function AssetDetail() {
  const { id } = useParams();

  const [asset, setAsset] = useState(null);
  const [logs, setLogs] = useState([]);
  const [pmHistory, setPmHistory] = useState([]);
  const [downtime, setDowntime] = useState(null);

  useEffect(() => {
    getAssetDetail(id).then((r) => setAsset(r.data));
    getAssetHistory(id).then((r) => setLogs(r.data));
  }, [id]);
  useEffect(() => {
    getAssetPMHistory(id).then((r) => setPmHistory(r.data));
  }, [id]);

  useEffect(() => {
    const fetchDowntime = () => {
      getAssetDowntimeDetail(id).then((r) => setDowntime(r.data));
    };

    fetchDowntime(); // gọi ngay khi load

    const timer = setInterval(fetchDowntime, 30000); // 30s

    return () => clearInterval(timer);
  }, [id]);

  if (!asset) return null;

  const renderDowntime = (ms) => {
    if (!ms || ms <= 0) return "0 min";

    const totalMinutes = Math.floor(ms / 1000 / 60);

    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    }

    const hours = Math.floor((totalMinutes / 60) * 10) / 10;
    return `${hours} h`;
  };

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
                  ASSIGNED: { text: "Assigned to Work Order", color: "blue" },

                  START_MAINTENANCE: {
                    text: "Maintenance Started",
                    color: "orange",
                  },

                  PAUSE_MAINTENANCE: {
                    text: "Maintenance Paused",
                    color: "gold",
                  },

                  RESUME_MAINTENANCE: {
                    text: "Maintenance Resumed",
                    color: "orange",
                  },

                  END_MAINTENANCE: {
                    text: "Maintenance Completed",
                    color: "green",
                  },

                  CANCEL_MAINTENANCE: {
                    text: "Maintenance Cancelled",
                    color: "red",
                  },
                };

                return (
                  <Tag color={map[v]?.color || "default"}>
                    {map[v]?.text || v}
                  </Tag>
                );
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
      <Card title="Asset Downtime">
        <Statistic
          title="Total Downtime"
          value={renderDowntime(downtime?.totalDowntimeMs)}
        />

        <Table
          rowKey="_id"
          dataSource={downtime?.workOrders || []}
          columns={[
            { title: "Work Order", dataIndex: "title" },
            { title: "Status", dataIndex: "status" },
            {
              title: "Start",
              render: (_, w) =>
                w.startedAt ? new Date(w.startedAt).toLocaleString() : "-",
            },
          ]}
        />
      </Card>

      <h3>Downtime History</h3>

      <Table
        rowKey="_id"
        dataSource={downtime?.history || []}
        columns={[
          {
            title: "Work Order",
            render: (_, r) => r.workOrder?.title || "-",
          },
          {
            title: "Start",
            render: (_, r) =>
              r.startedAt ? new Date(r.startedAt).toLocaleString() : "-",
          },
          {
            title: "End",
            render: (_, r) =>
              r.endedAt ? new Date(r.endedAt).toLocaleString() : "-",
          },
          {
            title: "Hours",
            render: (_, r) => {
              if (!r.downtimeMs) return "0";

              const hours = r.downtimeMs / 1000 / 60 / 60;

              if (hours < 1) {
                const mins = Math.round(r.downtimeMs / 1000 / 60);
                return `${mins} min`;
              }

              return hours.toFixed(2);
            },
          },
        ]}
      />
    </>
  );
}
