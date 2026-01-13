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
} from "../api/workOrder.api";

import { getAssets } from "../api/asset.api";
import { getTechnicians } from "../api/user.api";
import { getChecklistTemplates } from "../api/checklistTemplate.api";

import Checklist from "../components/Checklist";
import UploadPhoto from "../components/UploadPhoto";
import SignaturePad from "../components/SignaturePad";
import { can } from "../utils/workOrderPermissions";
import { useAuth } from "../auth/AuthContext";

export default function WorkOrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const role = user?.role; // ✅ KHAI BÁO 1 LẦN
  const [wo, setWo] = useState(null);
  const status = wo?.status;

  const [assets, setAssets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [templates, setTemplates] = useState([]);

  /* ================= LOAD WORK ORDER ================= */
  const loadWO = async () => {
    const res = await getWorkOrderDetail(id);
    setWo(res.data);
  };

  useEffect(() => {
    loadWO();

    if (["ADMIN", "MANAGER"].includes(user?.role)) {
      getTechnicians().then((r) => setTechnicians(r.data));
    }
  }, [id, user?.role]);

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
      getChecklistTemplates().then((r) => {
        setTemplates(r.data.filter((t) => t.isActive));
      });
    }
  }, [role]);

  if (!wo) return null;

  const selectedAssets =
    wo.assignedAssets?.map((a) => (typeof a === "string" ? a : a._id)) || [];

  const selectedTechnicians =
    wo.assignedTechnicians?.map((t) => (typeof t === "string" ? t : t._id)) ||
    [];

  /* ================= HANDLERS ================= */

  const handleChecklistSave = async (list) => {
    try {
      await updateChecklist(id, list);
      message.success("Checklist updated");
      loadWO();
    } catch (e) {
      message.error("Cannot update checklist");
    }
  };

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

  const canAssignTechnician =
    ["ADMIN", "MANAGER"].includes(role) &&
    ["APPROVED", "ASSIGNED"].includes(status);

  /* ================= UI ================= */
  return (
    <Card
      title={wo.title}
      extra={
        ["COMPLETED", "CLOSED"].includes(status) && (
          <Button type="primary" onClick={downloadPDF}>
            Export PDF
          </Button>
        )
      }
    >
      {status === "CLOSED" && (
        <Alert
          type="info"
          message="Work order is closed and read-only"
          showIcon
          className="mb-3"
        />
      )}

      <p>{wo.description}</p>
      <Tag color="blue">{status}</Tag>

      {/* ===== ACTION BUTTONS ===== */}
      <Divider />
      <Space>
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

        {can("start", status, role) && (
          <Button
            type="primary"
            onClick={async () => {
              try {
                await startWorkOrder(id);
                message.success("Work started");
                loadWO();
              } catch (err) {
                message.error(
                  err?.response?.data?.message || "Cannot start work order"
                );
              }
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

      {/* ===== ASSIGN TECHNICIANS ===== */}
      {canAssignTechnician && (
        <>
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
            {technicians.map((t) => (
              <Select.Option key={t._id} value={t._id}>
                {t.name}
              </Select.Option>
            ))}
          </Select>
        </>
      )}

      {/* ===== CHECKLIST ===== */}
      <Divider />
      <h3>Checklist</h3>

      {/* ADMIN APPLY TEMPLATE */}
      {role === "ADMIN" && status === "APPROVED" && (
        <Select
          style={{ width: "100%", marginBottom: 16 }}
          placeholder="Apply checklist template"
          onChange={async (templateId) => {
            try {
              await applyChecklistTemplate(id, templateId);
              message.success("Checklist template applied");
              loadWO();
            } catch (e) {
              message.error(
                e?.response?.data?.message || "Cannot apply checklist"
              );
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

      {/* TECHNICIAN WORK CHECKLIST */}
      {wo.checklist?.length > 0 ? (
        <Checklist
          data={wo.checklist}
          disabled={!can("work", status, role)}
          onSave={can("work", status, role) ? handleChecklistSave : null}
        />
      ) : (
        <Alert
          type="warning"
          message="Checklist has not been applied"
          showIcon
        />
      )}

      {/* ===== ASSETS ===== */}
      <Divider />
      <h3>Assigned Assets</h3>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        value={selectedAssets}
        disabled={!can("assign", status, role)}
        onChange={async (values) => {
          try {
            await assignAssets(id, values);
            message.success("Assets assigned");
            loadWO();
          } catch (e) {
            message.error(e?.response?.data?.message || "Cannot assign assets");
          }
        }}
      >
        {assets.map((a) => (
          <Select.Option key={a._id} value={a._id}>
            {a.name} ({a.code}) – {a.status}
          </Select.Option>
        ))}
      </Select>

      {/* ===== PHOTOS ===== */}
      <Divider />
      <h3>Photos</h3>
      <UploadPhoto
        workOrderId={id}
        photos={wo.photos || []}
        disabled={!can("work", status, role)}
        onUploaded={loadWO}
      />

      {/* ===== SIGNATURE ===== */}
      <Divider />
      <h3>Signature</h3>
      {can("work", status, role) ? (
        <SignaturePad onSave={handleSignatureSave} />
      ) : wo.signature?.url ? (
        <img src={wo.signature.url} alt="signature" width={400} />
      ) : (
        <p>No signature</p>
      )}
    </Card>
  );
}
