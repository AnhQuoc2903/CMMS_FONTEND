/* eslint-disable react-hooks/set-state-in-effect */
import { Table, Button, Tag, Modal, Input, Space, message } from "antd";
import { useEffect, useState } from "react";
import {
  getTenantRequests,
  buildingApprove,
  mspReview,
  finalApprove,
  rejectTenantRequest,
} from "../api/tenant.api";

const STATUS_COLOR = {
  BUILDING_APPROVED: "cyan",
  MSP_REVIEWED: "purple",
  FINAL_APPROVED: "green",
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
            title: "Description",
            dataIndex: "description",
            ellipsis: true,
          },
          {
            title: "Tenant Name",
            dataIndex: "tenantName",
          },
          {
            title: "Tenant Email",
            dataIndex: "tenantEmail",
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
                {/* BUILDING APPROVE */}
                {r.status === "SUBMITTED" && (
                  <Button
                    type="primary"
                    size="small"
                    onClick={async () => {
                      await buildingApprove(r._id);
                      message.success("Building approved");
                      loadData();
                    }}
                  >
                    Building Approve
                  </Button>
                )}

                {/* MSP REVIEW */}
                {r.status === "BUILDING_APPROVED" && (
                  <Button
                    type="primary"
                    size="small"
                    onClick={async () => {
                      await mspReview(r._id);
                      message.success("MSP reviewed");
                      loadData(); // ✅ BẮT BUỘC
                    }}
                  >
                    MSP Review
                  </Button>
                )}

                {/* FINAL APPROVE */}
                {r.status === "MSP_REVIEWED" && (
                  <Button
                    type="primary"
                    size="small"
                    onClick={async () => {
                      await finalApprove(r._id);
                      message.success("Work Order created");
                      loadData();
                    }}
                  >
                    Final Approve
                  </Button>
                )}

                {/* REJECT (chung) */}
                {["SUBMITTED", "BUILDING_APPROVED", "MSP_REVIEWED"].includes(
                  r.status
                ) && (
                  <Button
                    danger
                    size="small"
                    onClick={() => {
                      setSelected(r);
                      setOpenReject(true);
                    }}
                  >
                    Reject
                  </Button>
                )}
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
