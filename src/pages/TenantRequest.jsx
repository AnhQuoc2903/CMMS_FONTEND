/* eslint-disable react-hooks/set-state-in-effect */
import { Table, Button, Tag, Modal, Input, Space, message } from "antd";
import { useEffect, useState } from "react";
import {
  getTenantRequests,
  approveTenantRequest,
  rejectTenantRequest,
} from "../api/tenant.api";

const STATUS_COLOR = {
  OPEN: "blue",
  APPROVED: "green",
  REJECTED: "red",
};

export default function TenantRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selected, setSelected] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const res = await getTenantRequests();
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id) => {
    await approveTenantRequest(id);
    message.success("Approved & Work Order created");
    loadData();
  };

  const reject = async () => {
    if (!rejectReason.trim()) {
      return message.error("Reject reason is required");
    }

    await rejectTenantRequest(selected._id, rejectReason);
    message.success("Request rejected");
    setOpenReject(false);
    setRejectReason("");
    setSelected(null);
    loadData();
  };

  return (
    <>
      <Table
        loading={loading}
        rowKey="_id"
        dataSource={data}
        columns={[
          {
            title: "Title",
            dataIndex: "title",
          },
          {
            title: "Tenant",
            render: (_, r) => (
              <>
                <div>{r.tenantName}</div>
                <small>{r.tenantEmail}</small>
              </>
            ),
          },
          {
            title: "Status",
            render: (_, r) =>
              r.status === "REJECTED" ? (
                <Tag color="red" title={r.rejectReason}>
                  REJECTED
                </Tag>
              ) : (
                <Tag color={STATUS_COLOR[r.status]}>{r.status}</Tag>
              ),
          },
          {
            title: "Action",
            render: (_, r) => (
              <Space>
                <Button
                  type="primary"
                  size="small"
                  disabled={r.status !== "OPEN"}
                  onClick={() => approve(r._id)}
                >
                  Approve
                </Button>
                <Button
                  danger
                  size="small"
                  disabled={r.status !== "OPEN"}
                  onClick={() => {
                    setSelected(r);
                    setOpenReject(true);
                  }}
                >
                  Reject
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title="Reject Tenant Request"
        open={openReject}
        onCancel={() => {
          setOpenReject(false);
          setRejectReason("");
          setSelected(null);
        }}
        onOk={reject}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter reject reason..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </>
  );
}
