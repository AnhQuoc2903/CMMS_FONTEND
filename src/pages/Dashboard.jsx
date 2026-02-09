import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  Segmented,
} from "antd";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import {
  getDashboardSummary,
  getDashboardStatus,
  getDashboardSLA,
  getDashboardPM,
  getDashboardOverdue,
  getAssetDowntimeSummary,
} from "../api/report.api";

const COLORS = ["#1677ff", "#52c41a", "#faad14", "#ff4d4f"];

export default function Dashboard() {
  const [days, setDays] = useState(); // undefined = all
  const [summary, setSummary] = useState(null);
  const [sla, setSla] = useState(null);
  const [pm, setPm] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [assetDowntime, setAssetDowntime] = useState([]);

  const loadData = (d) => {
    getDashboardSummary(d).then((r) => setSummary(r.data));
    getDashboardSLA().then((r) => setSla(r.data));
    getDashboardPM().then((r) => setPm(r.data));
    getDashboardOverdue().then((r) => setOverdue(r.data));
    getDashboardStatus(d).then((r) => setStatusData(r.data));
  };

  useEffect(() => {
    loadData(days);
  }, [days]);

  useEffect(() => {
    getAssetDowntimeSummary().then((r) => setAssetDowntime(r.data));
  }, []);

  if (!summary || !sla || !pm) {
    return <Card loading style={{ minHeight: 300 }} />;
  }

  return (
    <>
      {/* FILTER */}
      <Card style={{ marginBottom: 16 }}>
        <Segmented
          options={[
            { label: "All", value: undefined },
            { label: "Last 7 days", value: 7 },
            { label: "Last 30 days", value: 30 },
          ]}
          value={days}
          onChange={setDays}
        />
      </Card>

      {/* KPI */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Work Orders" value={summary.totalWO} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Open Work Orders" value={summary.openWO} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Asset Down Rate"
              value={`${summary.assetDownRate}%`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Progress
              type="circle"
              percent={sla.slaRate}
              format={(p) => `${p}% SLA`}
            />
          </Card>
        </Col>
      </Row>

      {/* CHARTS */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Work Orders by Status (Pie)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="status" label>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Work Orders by Status (Bar)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1677ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* OVERDUE TABLE */}
      <Card title="Overdue Work Orders" style={{ marginTop: 24 }}>
        <Table
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          dataSource={overdue}
          columns={[
            { title: "Title", dataIndex: "title" },
            {
              title: "Priority",
              dataIndex: "priority",
              render: (p) => <Tag>{p}</Tag>,
            },
            {
              title: "Due",
              dataIndex: "slaDueAt",
              render: (d) => new Date(d).toLocaleString(),
            },
            { title: "Status", dataIndex: "status" },
          ]}
        />
      </Card>

      <Card title="Top Asset Downtime (hours)" style={{ marginTop: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={assetDowntime}>
            <XAxis dataKey="assetName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="downtimeHours" fill="#ff4d4f" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}
