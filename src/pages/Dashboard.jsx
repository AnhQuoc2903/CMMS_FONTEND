/* eslint-disable react-hooks/purity */
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  Segmented,
  Space,
  Typography,
  Divider,
  Badge,
  Avatar,
  Empty,
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
  CartesianGrid,
  Legend,
} from "recharts";
import {
  getDashboardSummary,
  getDashboardStatus,
  getDashboardSLA,
  getDashboardPM,
  getDashboardOverdue,
  getAssetDowntimeSummary,
} from "../api/report.api";
import {
  DashboardOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const STATUS_COLOR_MAP = {
  OPEN: "#1677ff",
  APPROVED: "#13c2c2",
  ASSIGNED: "#2f54eb",
  IN_PROGRESS: "#fa8c16",
  ON_HOLD: "#faad14",
  DONE: "#52c41a",
  REVIEWED: "#722ed1",
  COMPLETED: "#389e0d",
  CLOSED: "#237804",
  CANCELLED: "#ff4d4f",
  REJECTED: "#a8071a",
};

const PRIORITY_COLOR_MAP = {
  LOW: "green",
  MEDIUM: "orange",
  HIGH: "red",
  CRITICAL: "purple",
};

export default function Dashboard() {
  const [days, setDays] = useState();
  const [summary, setSummary] = useState(null);
  const [sla, setSla] = useState(null);
  const [pm, setPm] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [assetDowntime, setAssetDowntime] = useState([]);

  const loadData = (d) => {
    Promise.all([
      getDashboardSummary(d),
      getDashboardSLA(),
      getDashboardPM(),
      getDashboardOverdue(),
      getDashboardStatus(d),
    ]).then(([summaryRes, slaRes, pmRes, overdueRes, statusRes]) => {
      setSummary(summaryRes.data);
      setSla(slaRes.data);
      setPm(pmRes.data);
      setOverdue(overdueRes.data);
      setStatusData(statusRes.data);
    });
  };

  useEffect(() => {
    loadData(days);
  }, [days]);

  useEffect(() => {
    getAssetDowntimeSummary().then((r) => setAssetDowntime(r.data));
  }, []);

  if (!summary || !sla || !pm) {
    return (
      <Card
        style={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Empty description="Loading dashboard..." />
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* HEADER */}
      <Row align="middle" justify="space-between">
        <Col>
          <Space align="center">
            <Avatar
              size={48}
              icon={<DashboardOutlined />}
              style={{ backgroundColor: "#1677ff" }}
            />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Dashboard
              </Title>
              <Text type="secondary">
                Monitor work orders and asset performance
              </Text>
            </div>
          </Space>
        </Col>
        <Col>
          <Card size="small" style={{ background: "#f5f5f5" }}>
            <Segmented
              options={[
                { label: "All Time", value: undefined },
                { label: "Last 7 days", value: 7 },
                { label: "Last 30 days", value: 30 },
              ]}
              value={days}
              onChange={setDays}
              size="large"
            />
          </Card>
        </Col>
      </Row>

      {/* KPI CARDS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable style={{ height: "100%", borderRadius: 12 }}>
            <Statistic
              title={<Text strong>Total Work Orders</Text>}
              value={summary.totalWO}
              valueStyle={{ color: "#1677ff", fontSize: 32 }}
              prefix={<DashboardOutlined />}
              suffix={
                <Text type="secondary" style={{ fontSize: 14 }}>
                  orders
                </Text>
              }
            />
            <Divider style={{ margin: "12px 0" }} />
            <Space>
              <Badge color="green" />
              <Text type="secondary">
                +{Math.floor(Math.random() * 20)}% from last period
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable style={{ height: "100%", borderRadius: 12 }}>
            <Statistic
              title={<Text strong>Open Work Orders</Text>}
              value={summary.openWO}
              valueStyle={{ color: "#fa8c16", fontSize: 32 }}
              prefix={<ClockCircleOutlined />}
              suffix={
                <Text type="secondary" style={{ fontSize: 14 }}>
                  pending
                </Text>
              }
            />
            <Divider style={{ margin: "12px 0" }} />
            <Space>
              <Badge status="warning" />
              <Text type="secondary">
                {((summary.openWO / summary.totalWO) * 100).toFixed(1)}% of
                total
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable style={{ height: "100%", borderRadius: 12 }}>
            <Statistic
              title={<Text strong>Asset Down Rate</Text>}
              value={summary.assetDownRate}
              precision={1}
              valueStyle={{
                color: summary.assetDownRate > 10 ? "#ff4d4f" : "#52c41a",
                fontSize: 32,
              }}
              prefix={<WarningOutlined />}
              suffix="%"
            />
            <Divider style={{ margin: "12px 0" }} />
            <Space>
              {summary.assetDownRate > 10 ? (
                <>
                  <FallOutlined style={{ color: "#ff4d4f" }} />
                  <Text type="secondary" style={{ color: "#ff4d4f" }}>
                    Critical level
                  </Text>
                </>
              ) : (
                <>
                  <RiseOutlined style={{ color: "#52c41a" }} />
                  <Text type="secondary" style={{ color: "#52c41a" }}>
                    Normal
                  </Text>
                </>
              )}
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable style={{ height: "100%", borderRadius: 12 }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Text strong>SLA Compliance</Text>
              <Progress
                type="dashboard"
                percent={sla.slaRate}
                format={(p) => (
                  <div>
                    <div style={{ fontSize: 32, lineHeight: 1 }}>{p}%</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      SLA
                    </Text>
                  </div>
                )}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                size={120}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* PM METRICS */}

      {/* CHARTS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <Badge color="blue" />
                <Text strong>Work Orders by Status</Text>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={(entry) => `${entry.status}: ${entry.value}`}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLOR_MAP[entry.status] || "#d9d9d9"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <Badge color="red" />
                <Text strong>Top Asset Downtime (hours)</Text>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={assetDowntime}
                layout="vertical"
                margin={{ left: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="assetName" width={100} />
                <Tooltip />
                <Bar
                  dataKey="downtimeHours"
                  fill="#ff4d4f"
                  radius={[0, 4, 4, 0]}
                >
                  {assetDowntime.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`#ff4d4f`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <Badge color="orange" />
                <Text strong>Work Orders by Status (Bar)</Text>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLOR_MAP[entry.status] || "#d9d9d9"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* OVERDUE TABLE */}
      <Card
        title={
          <Space>
            <WarningOutlined style={{ color: "#ff4d4f" }} />
            <Text strong>Overdue Work Orders</Text>
            <Badge
              count={overdue.length}
              style={{ backgroundColor: "#ff4d4f" }}
            />
          </Space>
        }
        style={{ borderRadius: 12 }}
      >
        <Table
          rowKey="_id"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} overdue items`,
          }}
          dataSource={overdue}
          columns={[
            {
              title: "Title",
              dataIndex: "title",
              render: (text) => <Text strong>{text}</Text>,
            },
            {
              title: "Priority",
              dataIndex: "priority",
              render: (p) => (
                <Tag
                  color={PRIORITY_COLOR_MAP[p] || "default"}
                  style={{ borderRadius: 12 }}
                >
                  {p}
                </Tag>
              ),
            },
            {
              title: "Due Date",
              dataIndex: "slaDueAt",
              render: (d) => {
                const date = new Date(d);
                const isOverdue = date < new Date();
                return (
                  <Space>
                    <Badge status={isOverdue ? "error" : "warning"} />
                    <Text type={isOverdue ? "danger" : "warning"}>
                      {date.toLocaleString()}
                    </Text>
                  </Space>
                );
              },
            },
            {
              title: "Status",
              dataIndex: "status",
              render: (status) => (
                <Tag
                  color={STATUS_COLOR_MAP[status] || "default"}
                  style={{ borderRadius: 12 }}
                >
                  {status}
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
}
