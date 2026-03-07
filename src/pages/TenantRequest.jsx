/* eslint-disable react-hooks/set-state-in-effect */
import { Table, Button, Tag, Modal, Input, Space, message, Image } from "antd";
import { useEffect, useState } from "react";
import {
  getTenantRequests,
  buildingApprove,
  mspReview,
  finalApprove,
  rejectTenantRequest,
} from "../api/tenant.api";

import { useAuth } from "../auth/AuthContext";

const STATUS_COLOR = {
  BUILDING_APPROVED: "cyan",
  MSP_REVIEWED: "purple",
  FINAL_APPROVED: "green",
  REJECTED: "red",
};

export default function TenantRequests() {
  const { user } = useAuth();
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
            title: "Images",
            render: (_, r) =>
              r.imageUrl?.length ? (
                <Space>
                  {r.imageUrl.map((img, i) => (
                    <Image
                      key={i}
                      src={img.url}
                      width={50}
                      height={50}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  ))}
                </Space>
              ) : (
                "-"
              ),
          },

          {
            title: "Status",
            render: (_, r) =>
              r.status === "REJECTED" ? (
                <>
                  <Tag color="red">REJECTED</Tag>
                  <div style={{ color: "#ff4d4f", fontSize: 12 }}>
                    {r.rejectReason}
                  </div>
                </>
              ) : (
                <Tag color={STATUS_COLOR[r.status]}>{r.status}</Tag>
              ),
          },
          {
            title: "Action",
            render: (_, r) => (
              <Space>
                {r.status === "SUBMITTED" &&
                  user.role === "BUILDING_MANAGER" && (
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
                {r.status === "BUILDING_APPROVED" &&
                  user.role === "MSP_SUPERVISOR" && (
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
                {r.status === "MSP_REVIEWED" &&
                  ["SUPER_ADMIN"].includes(user.role) && (
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
                {/* REJECT - BUILDING MANAGER */}
                {r.status === "SUBMITTED" &&
                  user.role === "BUILDING_MANAGER" && (
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

                {/* REJECT - MSP SUPERVISOR */}
                {r.status === "BUILDING_APPROVED" &&
                  user.role === "MSP_SUPERVISOR" && (
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

                {/* REJECT - SUPER ADMIN */}
                {r.status === "MSP_REVIEWED" && user.role === "SUPER_ADMIN" && (
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
