/* eslint-disable react-hooks/set-state-in-effect */
import { Card, Statistic, Row, Col, Progress, Spin, Alert } from "antd";
import { useEffect, useState } from "react";
import { getSLAReport } from "../api/report.api";
import SLAMonthlyChart from "../components/SLAMonthlyChart";

export default function SLADashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSLAReport()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin />;

  if (!data) return <Alert type="info" message="No SLA data available" />;

  return (
    <>
      <Card title="SLA Performance Report">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="Total Closed Work Orders" value={data.total} />
          </Col>

          <Col span={6}>
            <Statistic
              title="On-Time"
              value={data.onTime}
              valueStyle={{ color: "green" }}
            />
          </Col>

          <Col span={6}>
            <Statistic
              title="Late"
              value={data.late}
              valueStyle={{ color: "red" }}
            />
          </Col>

          <Col span={6}>
            <Progress
              type="circle"
              percent={data.onTimeRate}
              status={data.onTimeRate < 90 ? "exception" : "success"}
              format={(p) => `${p}% SLA`}
            />
          </Col>
        </Row>
      </Card>
      <SLAMonthlyChart />
    </>
  );
}
