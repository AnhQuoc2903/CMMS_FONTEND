/* eslint-disable react-hooks/set-state-in-effect */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { getSLAMonthlyReport } from "../api/report.api";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function SLAMonthlyChart() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSLAMonthlyReport(year)
      .then((r) => {
        setData(
          r.data.map((d) => ({
            ...d,
            name: MONTHS[d.month - 1],
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [year]);

  return (
    <Card
      title="SLA Performance by Month"
      extra={
        <Select
          value={year}
          onChange={setYear}
          style={{ width: 120 }}
          options={[
            { value: 2024, label: "2024" },
            { value: 2025, label: "2025" },
            { value: 2026, label: "2026" },
          ]}
        />
      }
    >
      {loading ? (
        <Spin />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="onTime" name="On Time" fill="#52c41a" />
            <Bar dataKey="late" name="Late" fill="#ff4d4f" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
