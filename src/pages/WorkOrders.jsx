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
          render: (s, r) => {
            let color = "blue";

            if (s === "ON_HOLD") color = "orange";
            if (s === "CANCELLED") color = "red";
            if (["COMPLETED", "CLOSED"].includes(s)) color = "green";
            if (s === "IN_PROGRESS") color = "gold";
            if (s === "PENDING_APPROVAL") color = "purple";

            return (
              <>
                <Tag color={color}>{s}</Tag>

                {r.maintenancePlan && <Tag color="magenta">PM</Tag>}

                {r.slaDueAt && new Date(r.slaDueAt) < new Date() && (
                  <Tag color="red">SLA</Tag>
                )}
              </>
            );
          },
        },
      ]}
    />
  );
}
