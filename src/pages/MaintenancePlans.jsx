/* eslint-disable react-hooks/set-state-in-effect */
import { Table, Button, Tag, Space } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMaintenancePlans,
  toggleMaintenancePlan,
  getMaintenancePlanWorkOrders,
  runMaintenancePlan,
} from "../api/maintenancePlan.api";

import { getAssets } from "../api/asset.api";
import { getChecklistTemplates } from "../api/checklistTemplate.api";

import MaintenancePlanModal from "../components/MaintenancePlanModal";

/* ===== CHILD TABLE: WORK ORDERS ===== */
const PlanWorkOrders = ({ planId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMaintenancePlanWorkOrders(planId)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [planId]);

  if (!data.length) return <i>No work orders generated yet</i>;

  return (
    <Table
      size="small"
      rowKey="_id"
      loading={loading}
      pagination={false}
      dataSource={data}
      columns={[
        {
          title: "Work Order",
          render: (_, r) => <Link to={`/work-orders/${r._id}`}>{r.title}</Link>,
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
  );
};

/* ===== MAIN PAGE ===== */
export default function MaintenancePlans() {
  const [data, setData] = useState([]);
  const [assets, setAssets] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const res = await getMaintenancePlans();
    setData(res.data);
  };

  useEffect(() => {
    load();
    getAssets().then((r) => setAssets(r.data));
    getChecklistTemplates().then((r) =>
      setTemplates(r.data.filter((t) => t.isActive))
    );
  }, []);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Create Maintenance Plan
      </Button>

      <Table
        rowKey="_id"
        dataSource={data}
        style={{ marginTop: 16 }}
        expandable={{
          expandedRowRender: (record) => <PlanWorkOrders planId={record._id} />,
        }}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Frequency", dataIndex: "frequency" },
          {
            title: "Next Run",
            dataIndex: "nextRunAt",
            render: (v) => new Date(v).toLocaleDateString(),
          },
          {
            title: "Status",
            render: (_, r) => (
              <Tag color={r.isActive ? "green" : "red"}>
                {r.isActive ? "ACTIVE" : "INACTIVE"}
              </Tag>
            ),
          },
          {
            title: "Action",
            render: (_, r) => (
              <Space>
                <Button
                  size="small"
                  onClick={() => {
                    setEditing(r);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="small"
                  type="primary"
                  onClick={() => runMaintenancePlan(r._id).then(load)}
                >
                  Run Now
                </Button>

                <Button
                  size="small"
                  onClick={() => toggleMaintenancePlan(r._id).then(load)}
                >
                  Toggle
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <MaintenancePlanModal
        open={open}
        editing={editing}
        assets={assets}
        templates={templates}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSaved={load}
      />
    </>
  );
}
