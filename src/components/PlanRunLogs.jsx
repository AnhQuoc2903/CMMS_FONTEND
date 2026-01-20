import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getMaintenancePlanLogs } from "../api/maintenancePlan.api";
import { Link } from "react-router-dom";

export default function PlanRunLogs({ planId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const r = await getMaintenancePlanLogs(planId);
        if (mounted) setData(r.data);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [planId]);

  if (!data.length) return <i>No run history</i>;

  return (
    <Table
      size="small"
      rowKey="_id"
      loading={loading}
      pagination={false}
      dataSource={data}
      columns={[
        {
          title: "Run At",
          dataIndex: "runAt",
          render: (v) => new Date(v).toLocaleString(),
        },
        {
          title: "Status",
          dataIndex: "status",
          render: (s) => {
            const color =
              s === "SUCCESS"
                ? "green"
                : s === "SKIPPED_ASSET_BUSY"
                  ? "orange"
                  : "red";
            return <Tag color={color}>{s}</Tag>;
          },
        },
        {
          title: "Work Order",
          render: (_, r) =>
            r.createdWorkOrder ? (
              <Link to={`/work-orders/${r.createdWorkOrder._id}`}>
                {r.createdWorkOrder.title}
              </Link>
            ) : (
              "-"
            ),
        },
        {
          title: "Triggered By",
          render: (_, r) =>
            r.triggeredBy
              ? `${r.triggeredBy.name} (${r.triggeredBy.role})`
              : "SYSTEM",
        },
      ]}
    />
  );
}
