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
  Tabs,
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
  cancelWorkOrder,
  holdWorkOrder,
  resumeWorkOrder,
  getWorkOrderTimeline,
  getWorkOrderSLATimeline,
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
import SLACountdown from "../components/SLACountdown";
import {
  ReviewModal,
  RejectModal,
  HoldModal,
  CancelModal,
} from "../components/WorkOrderModals";
import { WORK_ORDER_STATUS } from "../constants/workOrderStatus";
import { ROLES } from "../constants/roles";
import WorkOrderTimeline from "../components/WorkOrderTimeline";
import SLATimeline from "../components/SLATimeline";

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
  const [openHold, setOpenHold] = useState(false);
  const [holdReason, setHoldReason] = useState("");

  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [usedPartsDraft, setUsedPartsDraft] = useState([]);
  const [isEditingParts, setIsEditingParts] = useState(false);
  const [techDraft, setTechDraft] = useState([]);
  const [assetDraft, setAssetDraft] = useState([]);
  const [isEditingTech, setIsEditingTech] = useState(false);
  const [isEditingAsset, setIsEditingAsset] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [slaTimeline, setSLATimeline] = useState([]);
  const [loadingSLA, setLoadingSLA] = useState(false);

  const statusMeta = WORK_ORDER_STATUS[status];
  const canAssignByStatus = ["APPROVED", "ASSIGNED"].includes(status);

  /* ================= LOAD WORK ORDER ================= */
  const loadWO = async () => {
    const res = await getWorkOrderDetail(id);
    setIsEditingParts(false);
    setWo(res.data);
  };

  useEffect(() => {
    loadWO();

    if ([ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER].includes(role)) {
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
    if (role === "SUPER_ADMIN") {
      getChecklistTemplates().then((r) =>
        setTemplates(r.data.filter((t) => t.isActive)),
      );
    }
  }, [role]);

  useEffect(() => {
    if (!wo || isEditingParts) return;

    setUsedPartsDraft(
      (wo.usedParts || []).map((u) => ({
        part: typeof u.part === "string" ? u.part : u.part?._id,
        quantity: u.quantity,
      })),
    );
  }, [wo, isEditingParts]);

  useEffect(() => {
    if (!wo) return;

    setTechDraft(
      wo.assignedTechnicians?.map((t) => (typeof t === "string" ? t : t._id)) ||
        [],
    );

    setAssetDraft(
      wo.assignedAssets?.map((a) => (typeof a === "string" ? a : a._id)) || [],
    );
  }, [wo]);

  const isSame = !wo
    ? true
    : JSON.stringify(usedPartsDraft) ===
      JSON.stringify(
        (wo.usedParts || []).map((u) => ({
          part: typeof u.part === "string" ? u.part : u.part?._id,
          quantity: u.quantity,
        })),
      );

  useEffect(() => {
    if (role === "TECHNICIAN") {
      getMyWorkOrderHistory(id).then((r) => setHistory(r.data));
    }
  }, [id, role]);

  useEffect(() => {
    if (role === "TECHNICIAN") {
      getInventory().then((r) => setInventory(r.data));
    }
  }, [role]);

  useEffect(() => {
    if (!id || ![ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER].includes(role))
      return;

    setLoadingSLA(true);
    getWorkOrderSLATimeline(id)
      .then((r) => setSLATimeline(r.data))
      .finally(() => setLoadingSLA(false));
  }, [id, role]);

  useEffect(() => {
    if (
      !id ||
      ![
        ROLES.SUPER_ADMIN,
        ROLES.BUILDING_MANAGER,
        ROLES.MSP_SUPERVISOR,
      ].includes(role)
    )
      return;

    setLoadingTimeline(true);
    getWorkOrderTimeline(id)
      .then((r) => setTimeline(r.data))
      .finally(() => setLoadingTimeline(false));
  }, [id, role]);

  if (!wo) return null;

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
      (t) => !(wo.assignedTechnicians || []).find((a) => a._id === t._id),
    ),
  ];

  const hasChecklist = wo.checklist && wo.checklist.length > 0;
  const slaBlocked = wo.sla?.breached;
  const canStartWork = can("start", status, role) && hasChecklist;
  const isBlocked = [
    "ON_HOLD",
    "CANCELLED",
    "CLOSED",
    "REVIEWED",
    "VERIFIED",
  ].includes(status);

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

  /* ================= MODAL HANDLERS ================= */
  const handleReviewConfirm = async (note) => {
    try {
      await reviewWorkOrder(id, note);
      message.success("Work order reviewed");
      setOpenReview(false);
      setReviewNote("");
      loadWO();
    } catch (e) {
      message.error("Review failed");
    }
  };

  const handleRejectConfirm = async (reason) => {
    try {
      if (rejectType === "review") {
        await rejectReview(id, reason);
      } else if (rejectType === "verify") {
        await rejectVerification(id, reason);
      }
      message.success("Work order rejected");
      setOpenReject(false);
      setRejectReason("");
      setRejectType(null);
      loadWO();
    } catch (e) {
      message.error("Reject failed");
    }
  };

  const handleHoldConfirm = async (reason) => {
    await holdWorkOrder(id, { reason });
    setOpenHold(false);
    setHoldReason("");
    loadWO();
  };

  const handleCancelConfirm = async (reason) => {
    await cancelWorkOrder(id, { reason });
    setOpenCancel(false);
    setCancelReason("");
    loadWO();
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

      {status === "ON_HOLD" && (
        <Alert
          type="warning"
          showIcon
          message="Work Order is On Hold"
          description={
            <>
              <div>
                <b>Reason:</b> {wo.holdReason}
              </div>
              <div>
                <b>Hold at:</b> {new Date(wo.holdAt).toLocaleString()}
              </div>
            </>
          }
        />
      )}

      {status === "CANCELLED" && (
        <Alert
          type="error"
          showIcon
          message="Work Order Cancelled"
          description={
            <>
              <div>
                <b>Reason:</b> {wo.cancelReason}
              </div>
              <div>
                <b>Cancelled at:</b> {new Date(wo.cancelledAt).toLocaleString()}
              </div>
            </>
          }
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
        <Tabs
          items={[
            {
              key: "detail",
              label: "Details",
              children: (
                <>
                  {wo.assignedTechnicians?.some(
                    (t) => t.status === "INACTIVE",
                  ) && (
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

                  {wo.sla?.breached &&
                    !["CLOSED", "CANCELLED"].includes(status) && (
                      <Alert
                        type="error"
                        showIcon
                        message="SLA VIOLATED (Overdue)"
                        style={{ marginBottom: 12 }}
                      />
                    )}

                  <p>{wo.description}</p>

                  <Tag color={statusMeta?.color}>{statusMeta?.label}</Tag>
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
                              e?.response?.data?.message ||
                                "Cannot update priority",
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
                      <Tag color={PRIORITY_COLORS[wo.priority]}>
                        {wo.priority}
                      </Tag>
                    )}

                    {wo.slaHours && (
                      <Tag
                        color="blue"
                        title="SLA is calculated automatically based on priority and starts when the work order is approved"
                      >
                        SLA: {wo.slaHours}h
                      </Tag>
                    )}
                  </Space>

                  {wo.slaStartAt && (
                    <p style={{ marginTop: 4 }}>
                      SLA Start at:{" "}
                      <b>{new Date(wo.slaStartAt).toLocaleString()}</b>
                    </p>
                  )}

                  {wo.slaDueAt && (
                    <p style={{ marginTop: 8 }}>
                      SLA Due at:{" "}
                      <b>{new Date(wo.slaDueAt).toLocaleString()}</b>
                    </p>
                  )}

                  {wo.slaDueAt && (
                    <>
                      {wo.sla?.breached ? (
                        <Tag color="red">SLA Overdue</Tag>
                      ) : wo.status === "ON_HOLD" ? (
                        <Tag color="orange">SLA Paused</Tag>
                      ) : (
                        <Tag color="green">Within SLA</Tag>
                      )}
                    </>
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
                          rejectWorkOrder(id, {
                            reason: "Rejected by manager",
                          }).then(loadWO)
                        }
                      >
                        Reject
                      </Button>
                    )}

                    {can("review", status, role) && (
                      <Button
                        type="primary"
                        onClick={() => setOpenReview(true)}
                      >
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
                      <Button
                        danger
                        onClick={() => closeWorkOrder(id).then(loadWO)}
                      >
                        Close Work Order
                      </Button>
                    )}
                    <Space wrap>
                      {can("hold", status, role) && (
                        <Button onClick={() => setOpenHold(true)}>
                          Put On Hold
                        </Button>
                      )}

                      {can("resume", status, role) && (
                        <Button
                          type="primary"
                          onClick={() => resumeWorkOrder(id).then(loadWO)}
                        >
                          Resume Work
                        </Button>
                      )}

                      {can("cancel", status, role) && (
                        <Button danger onClick={() => setOpenCancel(true)}>
                          Cancel Work Order
                        </Button>
                      )}
                    </Space>
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
                          {new Date(
                            wo.verification.verifiedAt,
                          ).toLocaleString()}
                        </div>
                      }
                    />
                  )}

                  <Divider />
                  <h3>Spare Parts Used</h3>

                  {wo.usedParts?.map((u) => (
                    <div key={u._id}>
                      {u.part?.name} x {u.quantity}{" "}
                      <Tag
                        color={status === "IN_PROGRESS" ? "orange" : "green"}
                      >
                        {status === "IN_PROGRESS" ? "Reserved" : "Consumed"}
                      </Tag>
                    </div>
                  ))}

                  <UsedPartsEditor
                    parts={usedPartsDraft}
                    inventory={inventory}
                    disabled={isBlocked || !can("work", status, role)}
                    onChange={(next) => {
                      setIsEditingParts(true);
                      setUsedPartsDraft(next);
                    }}
                  />

                  {status === "IN_PROGRESS" && can("work", status, role) && (
                    <Button
                      type="primary"
                      disabled={isSame}
                      style={{ marginTop: 12 }}
                      onClick={async () => {
                        try {
                          await updateUsedParts(id, usedPartsDraft);
                          setIsEditingParts(false); // ✅ RESET
                          await loadInventory();
                          message.success("Spare parts saved");
                          loadWO();
                        } catch (e) {
                          message.error(
                            e?.response?.data?.message || "Save failed",
                          );
                        }
                      }}
                    >
                      Save Spare Parts
                    </Button>
                  )}

                  {/* ===== ASSIGN TECHNICIANS ===== */}

                  <Divider />
                  <h3>Assigned Technicians</h3>

                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    value={techDraft}
                    disabled={
                      !can("assign", status, role) || !canAssignByStatus
                    }
                    onChange={(values) => {
                      setIsEditingTech(true);
                      setTechDraft(values);
                    }}
                  >
                    {mergedTechnicians.map((t) => (
                      <Select.Option
                        key={t._id}
                        value={t._id}
                        disabled={t.status !== "ACTIVE"}
                      >
                        {t.name}
                        {t.status !== "ACTIVE" && " (INACTIVE)"}
                      </Select.Option>
                    ))}
                  </Select>

                  <Button
                    type="primary"
                    style={{ marginTop: 8 }}
                    disabled={!isEditingTech}
                    onClick={async () => {
                      try {
                        await assignTechnicians(id, techDraft);
                        message.success("Technicians saved");
                        setIsEditingTech(false);
                        loadWO();
                      } catch (e) {
                        message.error(
                          e?.response?.data?.message || "Save failed",
                        );
                      }
                    }}
                  >
                    Save Technicians
                  </Button>

                  {/* ===== CHECKLIST ===== */}
                  <Divider />
                  <h3>Checklist</h3>

                  {/* ADMIN – APPLY TEMPLATE */}
                  {role === "SUPER_ADMIN" && status === "APPROVED" && !isPM && (
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
                  {wo.checklistTemplate && role === "SUPER_ADMIN" && (
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
                      disabled={
                        isBlocked ||
                        !can("work", status, role) ||
                        checklistTemplateInactive
                      }
                      onSave={async (list) => {
                        try {
                          await updateChecklist(id, list);
                          message.success("Checklist saved");
                          loadWO();
                        } catch (e) {
                          message.error(
                            e?.response?.data?.message ||
                              "Cannot update checklist",
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
                    value={assetDraft}
                    disabled={
                      isPM || !canAssignByStatus || !can("assign", status, role)
                    }
                    onChange={(values) => {
                      setIsEditingAsset(true);
                      setAssetDraft(values);
                    }}
                  >
                    {assets.map((a) => (
                      <Select.Option
                        key={a._id}
                        value={a._id}
                        disabled={a.status !== "AVAILABLE"}
                      >
                        {a.name} ({a.code})
                        {a.status !== "AVAILABLE" && ` - ${a.status}`}
                      </Select.Option>
                    ))}
                  </Select>

                  <Button
                    type="primary"
                    style={{ marginTop: 8 }}
                    disabled={!isEditingAsset}
                    onClick={async () => {
                      try {
                        await assignAssets(id, assetDraft);
                        message.success("Assets saved");
                        setIsEditingAsset(false);
                        loadWO();
                      } catch (e) {
                        message.error(
                          e?.response?.data?.message || "Save failed",
                        );
                      }
                    }}
                  >
                    Save Assets
                  </Button>

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
                      disabled={isBlocked || !can("work", status, role)}
                      onUploaded={loadWO}
                    />
                  </div>

                  {/* ===== SIGNATURE ===== */}
                  <Divider />
                  <h3>Signature</h3>
                  {!isBlocked && can("work", status, role) ? (
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
                                <b>By:</b> {h.performedBy?.name} (
                                {h.performedBy?.role})
                              </div>
                              <div>
                                <b>Time:</b>{" "}
                                {new Date(h.createdAt).toLocaleString()}
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
                </>
              ),
            },
            ...([
              ROLES.SUPER_ADMIN,
              ROLES.BUILDING_MANAGER,
              ROLES.MSP_SUPERVISOR,
            ].includes(role)
              ? [
                  {
                    key: "timeline",
                    label: "Timeline",
                    children: (
                      <WorkOrderTimeline
                        data={timeline}
                        loading={loadingTimeline}
                      />
                    ),
                  },
                ]
              : []),
            ...([ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER].includes(role)
              ? [
                  {
                    key: "sla",
                    label: "SLA Timeline",
                    children: (
                      <SLATimeline data={slaTimeline} loading={loadingSLA} />
                    ),
                  },
                ]
              : []),
          ]}
        />
        <Divider />
        {!["CLOSED", "CANCELLED"].includes(status) && (
          <SLACountdown dueAt={wo.slaDueAt} paused={wo.status === "ON_HOLD"} />
        )}
      </Card>
      <ReviewModal
        open={openReview}
        onClose={() => {
          setOpenReview(false);
          setReviewNote("");
        }}
        onConfirm={handleReviewConfirm}
        note={reviewNote}
        setNote={setReviewNote}
      />

      <RejectModal
        open={openReject}
        onClose={() => {
          setOpenReject(false);
          setRejectReason("");
          setRejectType(null);
        }}
        onConfirm={handleRejectConfirm}
        reason={rejectReason}
        setReason={setRejectReason}
        type={rejectType}
      />

      <HoldModal
        open={openHold}
        onClose={() => setOpenHold(false)}
        onConfirm={handleHoldConfirm}
        reason={holdReason}
        setReason={setHoldReason}
      />

      <CancelModal
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        onConfirm={handleCancelConfirm}
        reason={cancelReason}
        setReason={setCancelReason}
      />
    </>
  );
}
