/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card,
  Tag,
  Divider,
  message,
  Button,
  Select,
  Space,
  Alert,
  Modal,
  Input,
} from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getWorkOrderDetail,
  uploadSignature,
  updateChecklist,
  assignAssets,
  exportPDF,
  assignTechnicians,
  submitWorkOrder,
  approveWorkOrder,
  rejectWorkOrder,
  startWorkOrder,
  closeWorkOrder,
  applyChecklistTemplate,
  reviewWorkOrder,
  verifyWorkOrder,
  updatePriority,
  rejectReview,
  rejectVerification,
  getMyWorkOrderHistory,
  updateUsedParts,
} from "../api/workOrder.api";

import { getAssets } from "../api/asset.api";
import { getTechnicians } from "../api/user.api";
import { getInventory } from "../api/inventory.api";
import { getChecklistTemplates } from "../api/checklistTemplate.api";

import Checklist from "../components/Checklist";
import UploadPhoto from "../components/UploadPhoto";
import SignaturePad from "../components/SignaturePad";
import { can } from "../utils/workOrderPermissions";
import { useAuth } from "../auth/AuthContext";
import UsedPartsEditor from "../components/UsedPartsEditor";

export default function WorkOrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const role = user?.role;

  const [wo, setWo] = useState(null);
  const status = wo?.status;

  const [assets, setAssets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [openReview, setOpenReview] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectType, setRejectType] = useState(null);
  const [history, setHistory] = useState([]);
  const [inventory, setInventory] = useState([]);

  // "review" | "verify"

  /* ================= LOAD WORK ORDER ================= */
  const loadWO = async () => {
    const res = await getWorkOrderDetail(id);
    setWo(res.data);
  };

  useEffect(() => {
    loadWO();

    if (["ADMIN", "MANAGER"].includes(role)) {
      getTechnicians().then((r) => setTechnicians(r.data));
    }
  }, [id, role]);

  useEffect(() => {
    if (!wo) return;

    getAssets().then((r) => {
      const available = r.data.filter((a) => a.status === "AVAILABLE");
      const assigned = wo.assignedAssets || [];

      const merged = [
        ...available,
        ...assigned.filter((a) => !available.find((x) => x._id === a._id)),
      ];

      setAssets(merged);
    });
  }, [wo]);

  useEffect(() => {
    if (role === "ADMIN") {
      getChecklistTemplates().then((r) =>
        setTemplates(r.data.filter((t) => t.isActive))
      );
    }
  }, [role]);

  useEffect(() => {
    if (role === "TECHNICIAN") {
      getMyWorkOrderHistory(id).then((r) => setHistory(r.data));
    }
  }, [id, role]);

  useEffect(() => {
    if (role === "TECHNICIAN") {
      getInventory({ status: "ACTIVE" }).then((r) => setInventory(r.data));
    }
  }, [role]);

  if (!wo) return null;
  // ===== MERGE INVENTORY + USED PARTS (INACTIVE STILL VISIBLE) =====
  const activeInventory = inventory;

  const mergedInventory = [
    ...activeInventory,
    ...(wo.usedParts
      ?.map((p) => p.part)
      .filter((p) => p && !activeInventory.find((a) => a._id === p._id)) || []),
  ];

  const selectedAssets =
    wo.assignedAssets?.map((a) => (typeof a === "string" ? a : a._id)) || [];

  const selectedTechnicians =
    wo.assignedTechnicians?.map((t) => (typeof t === "string" ? t : t._id)) ||
    [];

  const canAssignTechnician =
    ["ADMIN", "MANAGER"].includes(role) &&
    ["APPROVED", "ASSIGNED"].includes(status);

  const isPM = !!wo.maintenancePlan;

  /* ================= HANDLERS ================= */

  const handleSignatureSave = async (base64) => {
    await uploadSignature(id, base64);
    message.success("Work order completed");
    loadWO();
  };

  const downloadPDF = async () => {
    const res = await exportPDF(id);
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `work-order-${id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const PRIORITY_COLORS = {
    LOW: "green",
    MEDIUM: "blue",
    HIGH: "orange",
    CRITICAL: "red",
  };

  const mergedTechnicians = [
    ...(wo.assignedTechnicians || []),
    ...technicians.filter(
      (t) => !(wo.assignedTechnicians || []).find((a) => a._id === t._id)
    ),
  ];

  const hasChecklist = wo.checklist && wo.checklist.length > 0;
  const canStartWork = can("start", status, role) && hasChecklist;

  const myTech = wo.assignedTechnicians?.find((t) => t._id === user?.id);

  const isInactiveTech = myTech && myTech.status !== "ACTIVE";

  const isTemplateInactive =
    wo.checklistTemplate &&
    !templates.some((t) => t._id === wo.checklistTemplate.templateId);

  const checklistTemplateInactive =
    wo.checklistTemplate && templates.length === 0;

  const loadInventory = async () => {
    const r = await getInventory({ status: "ACTIVE" });
    setInventory(r.data);
  };

  /* ================= UI ================= */
  return (
    <>
      {wo.maintenancePlan && (
        <Alert
          type="info"
          showIcon
          message="Preventive Maintenance Work Order"
          description={
            <>
              <div>
                <b>Plan:</b> {wo.maintenancePlan.name}
              </div>
              <div>
                <b>Frequency:</b> {wo.maintenancePlan.frequency}
              </div>
            </>
          }
          style={{ marginBottom: 12 }}
        />
      )}

      <Card
        title={wo.title}
        extra={
          ["COMPLETED", "REVIEWED", "VERIFIED", "CLOSED"].includes(status) && (
            <Button type="primary" onClick={downloadPDF}>
              Export PDF
            </Button>
          )
        }
      >
        {wo.assignedTechnicians?.some((t) => t.status === "INACTIVE") && (
          <Alert
            type="warning"
            showIcon
            message="This work order contains INACTIVE technicians"
            style={{ marginBottom: 12 }}
          />
        )}

        {status === "CLOSED" && (
          <Alert
            type="info"
            message="Work order is closed and read-only"
            showIcon
            className="mb-3"
          />
        )}

        {checklistTemplateInactive && (
          <Alert
            type="warning"
            showIcon
            message="Checklist template is INACTIVE"
            description="This checklist was created from an inactive template and cannot be modified."
            style={{ marginBottom: 12 }}
          />
        )}

        {isInactiveTech && (
          <Alert
            type="error"
            showIcon
            message="Your technician account is INACTIVE"
            description="You cannot update checklist or perform work."
            style={{ marginBottom: 12 }}
          />
        )}

        {isTemplateInactive && (
          <Alert
            type="warning"
            showIcon
            message="Checklist template is INACTIVE"
            description="Checklist is read-only."
            style={{ marginBottom: 12 }}
          />
        )}

        {wo.dueAt && new Date() > new Date(wo.dueAt) && (
          <Alert
            type="error"
            showIcon
            message="SLA VIOLATED (Overdue)"
            style={{ marginBottom: 12 }}
          />
        )}

        <p>{wo.description}</p>
        <Tag color="blue">{status}</Tag>
        <Space style={{ marginTop: 8 }}>
          {can("editPriority", status, role) ? (
            <Select
              value={wo.priority}
              style={{ width: 160 }}
              onChange={async (value) => {
                try {
                  await updatePriority(id, value);
                  message.success("Priority updated");
                  loadWO();
                } catch (e) {
                  message.error(
                    e?.response?.data?.message || "Cannot update priority"
                  );
                }
              }}
            >
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                <Select.Option key={p} value={p}>
                  <Tag color={PRIORITY_COLORS[p]}>{p}</Tag>
                </Select.Option>
              ))}
            </Select>
          ) : (
            <Tag color={PRIORITY_COLORS[wo.priority]}>{wo.priority}</Tag>
          )}

          {wo.slaHours && <Tag color="blue">SLA: {wo.slaHours}h</Tag>}
        </Space>

        {wo.dueAt && (
          <p style={{ marginTop: 8 }}>
            Due at: <b>{new Date(wo.dueAt).toLocaleString()}</b>
          </p>
        )}

        {wo.dueAt && new Date() > new Date(wo.dueAt) && (
          <Alert type="error" message="OVERDUE (SLA violated)" showIcon />
        )}

        {/* ===== ACTION BUTTONS ===== */}
        <Divider />
        <Space wrap>
          {can("submit", status, role) && (
            <Button onClick={() => submitWorkOrder(id).then(loadWO)}>
              Submit for Approval
            </Button>
          )}

          {can("approve", status, role) && (
            <Button
              type="primary"
              onClick={() => approveWorkOrder(id).then(loadWO)}
            >
              Approve
            </Button>
          )}

          {can("reject", status, role) && (
            <Button
              danger
              onClick={() =>
                rejectWorkOrder(id, { reason: "Rejected by manager" }).then(
                  loadWO
                )
              }
            >
              Reject
            </Button>
          )}

          {can("review", status, role) && (
            <Button type="primary" onClick={() => setOpenReview(true)}>
              Review
            </Button>
          )}

          {can("verify", status, role) && (
            <Button
              type="primary"
              onClick={() => verifyWorkOrder(id).then(loadWO)}
            >
              Verify
            </Button>
          )}

          {can("reviewReject", status, role) && (
            <Button
              danger
              onClick={() => {
                setRejectType("review");
                setOpenReject(true);
              }}
            >
              Reject Review
            </Button>
          )}

          {can("verifyReject", status, role) && (
            <Button
              danger
              onClick={() => {
                setRejectType("verify");
                setOpenReject(true);
              }}
            >
              Reject Verification
            </Button>
          )}

          {can("start", status, role) && !hasChecklist && (
            <Alert
              type="error"
              showIcon
              message="Checklist is required before starting work"
              style={{ marginBottom: 12 }}
            />
          )}

          {can("start", status, role) && (
            <Button
              type="primary"
              disabled={!canStartWork}
              onClick={async () => {
                await startWorkOrder(id);
                message.success("Work started");
                loadWO();
              }}
            >
              Start Work
            </Button>
          )}

          {can("close", status, role) && (
            <Button danger onClick={() => closeWorkOrder(id).then(loadWO)}>
              Close Work Order
            </Button>
          )}
        </Space>

        {/* ===== REVIEW / VERIFY INFO ===== */}
        <Divider />

        {wo.review && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 16 }}
            message="Reviewed"
            description={
              <>
                <div>
                  <b>Note:</b> {wo.review.note || "-"}
                </div>
                <div>
                  <b>Reviewed at:</b>{" "}
                  {new Date(wo.review.reviewedAt).toLocaleString()}
                </div>
              </>
            }
          />
        )}

        {role === "TECHNICIAN" &&
          status === "IN_PROGRESS" &&
          (wo.reviewRejections?.length > 0 ||
            wo.verificationRejections?.length > 0) && (
            <Alert
              type="error"
              showIcon
              message="This work order was rejected and requires rework"
              description={
                wo.reviewRejections?.at(-1)?.reason ||
                wo.verificationRejections?.at(-1)?.reason
              }
              style={{ marginBottom: 12 }}
            />
          )}

        {wo.verification && (
          <Alert
            type="success"
            showIcon
            style={{ marginTop: 12 }}
            message="Verified & Approved"
            description={
              <div>
                <b>Verified at:</b>{" "}
                {new Date(wo.verification.verifiedAt).toLocaleString()}
              </div>
            }
          />
        )}

        <Divider />
        <h3>Spare Parts Used</h3>

        <UsedPartsEditor
          parts={wo.usedParts || []}
          inventory={mergedInventory}
          disabled={!can("work", status, role)}
          onChange={async (list) => {
            const invalid = list.some(
              (p) => !p.part || !p.quantity || p.quantity < 1
            );
            if (invalid) return;

            const normalized = list.map((p) => ({
              part: typeof p.part === "string" ? p.part : p.part?._id,
              quantity: p.quantity,
            }));

            try {
              await updateUsedParts(id, normalized);
              await loadInventory();
              message.success("Spare parts updated");
              loadWO();
            } catch (e) {
              message.error(e?.response?.data?.message || "Update failed");
            }
          }}
        />

        {/* ===== ASSIGN TECHNICIANS ===== */}

        <Divider />
        <h3>Assigned Technicians</h3>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={selectedTechnicians}
          disabled={!can("assign", status, role)}
          onChange={async (values) => {
            try {
              await assignTechnicians(id, values);
              message.success("Technicians assigned");
              loadWO();
            } catch (e) {
              message.error(
                e?.response?.data?.message || "Cannot assign technicians"
              );
            }
          }}
        >
          {mergedTechnicians.map((t) => (
            <Select.Option
              key={t._id}
              value={t._id}
              disabled={t.status !== "ACTIVE"} // ❗ QUAN TRỌNG
            >
              {t.name}
              {t.status !== "ACTIVE" && " (INACTIVE)"}
            </Select.Option>
          ))}
        </Select>

        {/* ===== CHECKLIST ===== */}
        <Divider />
        <h3>Checklist</h3>

        {/* ADMIN – APPLY TEMPLATE */}
        {role === "ADMIN" && status === "APPROVED" && !isPM && (
          <Select
            style={{ width: "100%", marginBottom: 16 }}
            placeholder="Apply checklist template"
            onChange={async (templateId) => {
              try {
                await applyChecklistTemplate(id, templateId);
                message.success("Checklist template applied");
                loadWO();
              } catch (e) {
                message.error("Cannot apply checklist");
              }
            }}
          >
            {templates.map((t) => (
              <Select.Option key={t._id} value={t._id}>
                {t.name}
              </Select.Option>
            ))}
          </Select>
        )}

        {/* ⚠️ TEMPLATE INACTIVE */}
        {wo.checklistTemplate && role === "ADMIN" && (
          <Alert
            type="warning"
            showIcon
            message="Checklist template may be inactive"
            description={`This checklist was created from template "${wo.checklistTemplate.name}". Template status does not affect this work order.`}
            style={{ marginBottom: 12 }}
          />
        )}

        {/* ✅ CHECKLIST HỢP LỆ */}
        {wo.checklist?.length > 0 && (
          <Checklist
            data={wo.checklist}
            disabled={!can("work", status, role) || checklistTemplateInactive}
            onSave={async (list) => {
              try {
                await updateChecklist(id, list);
                message.success("Checklist saved");
                loadWO();
              } catch (e) {
                message.error(
                  e?.response?.data?.message || "Cannot update checklist"
                );
              }
            }}
          />
        )}

        {/* ===== ASSETS ===== */}
        <Divider />
        <h3>Assigned Assets</h3>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={selectedAssets}
          disabled={isPM || !can("assign", status, role)}
          onChange={async (values) => {
            try {
              await assignAssets(id, values);
              message.success("Assets assigned");
              loadWO();
            } catch (e) {
              message.error(
                e?.response?.data?.message || "Cannot assign assets"
              );
            }
          }}
        >
          {assets.map((a) => (
            <Select.Option
              key={a._id}
              value={a._id}
              disabled={a.status !== "AVAILABLE"}
            >
              {a.name} ({a.code}){a.status !== "AVAILABLE" && ` - ${a.status}`}
            </Select.Option>
          ))}
        </Select>

        {/* ===== PHOTOS ===== */}
        <Divider />
        <h3>Photos</h3>

        <div
          style={{
            minHeight: 170, // ❗ QUAN TRỌNG
          }}
        >
          <UploadPhoto
            workOrderId={id}
            photos={wo.photos || []}
            disabled={!can("work", status, role)}
            onUploaded={loadWO}
          />
        </div>

        {/* ===== SIGNATURE ===== */}
        <Divider />
        <h3>Signature</h3>
        {can("work", status, role) ? (
          <SignaturePad onSave={handleSignatureSave} />
        ) : wo.signature?.url ? (
          <img
            src={wo.signature.url}
            alt="signature"
            style={{
              width: 400,
              height: 150,
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <p>No signature</p>
        )}

        {role === "TECHNICIAN" && history.length > 0 && (
          <>
            <Divider />
            <h3>Work History</h3>
            {history.map((h) => (
              <Alert
                key={h._id}
                type={h.action === "REWORK" ? "error" : "info"}
                showIcon
                message={h.action}
                description={
                  <>
                    <div>
                      <b>By:</b> {h.performedBy?.name} ({h.performedBy?.role})
                    </div>
                    <div>
                      <b>Time:</b> {new Date(h.createdAt).toLocaleString()}
                    </div>
                    {h.note && (
                      <div>
                        <b>Reason:</b> {h.note}
                      </div>
                    )}
                  </>
                }
                style={{ marginBottom: 8 }}
              />
            ))}
          </>
        )}
      </Card>
      <Modal
        title="Review Work Order"
        open={openReview}
        onCancel={() => {
          setOpenReview(false);
          setReviewNote("");
        }}
        onOk={async () => {
          if (!reviewNote.trim()) {
            return message.error("Review note is required");
          }

          try {
            await reviewWorkOrder(id, reviewNote);
            message.success("Work order reviewed");
            setOpenReview(false);
            setReviewNote("");
            loadWO();
          } catch (e) {
            message.error("Review failed");
          }
        }}
        okText="Confirm Review"
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter review note..."
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
        />
      </Modal>
      <Modal
        title="Reject Work Order"
        open={openReject}
        onCancel={() => {
          setOpenReject(false);
          setRejectReason("");
          setRejectType(null);
        }}
        onOk={async () => {
          if (!rejectReason.trim()) {
            return message.error("Reject reason is required");
          }

          try {
            if (rejectType === "review") {
              await rejectReview(id, rejectReason);
            }

            if (rejectType === "verify") {
              await rejectVerification(id, rejectReason);
            }

            message.success("Work order rejected");
            setOpenReject(false);
            setRejectReason("");
            setRejectType(null);
            loadWO();
          } catch (e) {
            message.error("Reject failed");
          }
        }}
        okText="Confirm Reject"
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
