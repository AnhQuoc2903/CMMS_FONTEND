import { Card, Tag, Divider, message, Button, Select } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getWorkOrderDetail,
  uploadSignature,
  updateChecklist,
  assignAssets,
  exportPDF,
  assignTechnicians,
} from "../api/workOrder.api";

import { getAssets } from "../api/asset.api";
import { getTechnicians } from "../api/user.api";

import Checklist from "../components/Checklist";
import UploadPhoto from "../components/UploadPhoto";
import SignaturePad from "../components/SignaturePad";

export default function WorkOrderDetail() {
  const { id } = useParams();

  const [wo, setWo] = useState(null);
  const [assets, setAssets] = useState([]);

  // ⭐ TECHNICIANS
  const [technicians, setTechnicians] = useState([]);

  // ===== LOAD WORK ORDER =====
  useEffect(() => {
    getWorkOrderDetail(id).then((r) => setWo(r.data));
  }, [id]);

  // ===== LOAD TECHNICIANS ===== ⭐
  useEffect(() => {
    getTechnicians().then((r) => setTechnicians(r.data));
  }, []);

  // ===== LOAD ASSETS =====
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

  if (!wo) return null;

  const isDone = wo.status === "DONE";

  // ===== SELECTED VALUES =====
  const selectedAssets =
    wo.assignedAssets?.map((a) => (typeof a === "string" ? a : a._id)) || [];

  const selectedTechnicians = // ⭐
    wo.assignedTechnicians?.map((t) => (typeof t === "string" ? t : t._id)) ||
    [];

  // ===== CHECKLIST =====
  const saveChecklist = async (list) => {
    if (isDone) return;
    await updateChecklist(id, list);
    message.success("Checklist updated");
  };

  // ===== SIGNATURE =====
  const saveSignature = async (base64) => {
    if (isDone) return;
    try {
      await uploadSignature(id, base64);
      const res = await getWorkOrderDetail(id);
      setWo(res.data);
      message.success("Work Order completed");
    } catch {
      message.error("Save signature failed");
    }
  };

  // ===== EXPORT PDF =====
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

  return (
    <Card
      title={wo.title}
      extra={
        <Button type="primary" onClick={downloadPDF} disabled={!isDone}>
          Export PDF
        </Button>
      }
    >
      {isDone && (
        <div className="mb-3 p-2 bg-gray-100 border rounded text-gray-600">
          🔒 Work order is completed (READ-ONLY)
        </div>
      )}

      <p>{wo.description}</p>
      <Tag color="blue">{wo.status}</Tag>

      {/* ===== ASSIGN TECHNICIANS ===== ⭐ */}
      <Divider />
      <h3>Assigned Technicians</h3>

      <Select
        mode="multiple"
        style={{ width: "100%" }}
        value={selectedTechnicians}
        onChange={async (values) => {
          if (isDone) return;
          try {
            await assignTechnicians(id, values);
            const res = await getWorkOrderDetail(id);
            setWo(res.data);
            message.success("Technicians assigned");
          } catch (e) {
            message.error(
              e.response?.data?.message || "Assign technician failed"
            );
          }
        }}
        disabled={isDone}
      >
        {technicians.map((t) => (
          <Select.Option key={t._id} value={t._id}>
            {t.name}
          </Select.Option>
        ))}
      </Select>

      {/* ===== CHECKLIST ===== */}
      <Divider />
      <h3>Checklist</h3>
      <Checklist
        data={wo.checklist || []}
        onSave={isDone ? null : saveChecklist}
        readOnly={isDone}
      />

      {/* ===== ASSIGNED ASSETS ===== */}
      <Divider />
      <h3>Assigned Assets</h3>

      <Select
        mode="multiple"
        style={{ width: "100%" }}
        value={selectedAssets}
        onChange={async (values) => {
          if (isDone) return;
          try {
            await assignAssets(id, values);
            const res = await getWorkOrderDetail(id);
            setWo(res.data);
            message.success("Assets assigned");
          } catch (e) {
            message.error(e.response?.data?.message || "Assign failed");
          }
        }}
        disabled={isDone}
      >
        {assets.map((a) => (
          <Select.Option
            key={a._id}
            value={a._id}
            disabled={
              a.status !== "AVAILABLE" && !selectedAssets.includes(a._id)
            }
          >
            {a.name} ({a.code}) – {a.status}
          </Select.Option>
        ))}
      </Select>

      {/* ===== PHOTOS ===== */}
      <Divider />
      <h3>Photos</h3>

      <div style={{ marginBottom: 12 }}>
        {wo.photos?.map((p) => (
          <img
            key={p.url}
            src={p.url}
            alt=""
            style={{ width: 120, marginRight: 8 }}
          />
        ))}
      </div>

      {!isDone && (
        <UploadPhoto
          workOrderId={id}
          photos={wo.photos || []}
          onUploaded={async () => {
            const res = await getWorkOrderDetail(id);
            setWo(res.data);
          }}
        />
      )}

      {/* ===== SIGNATURE ===== */}
      <Divider />
      <h3>Signature</h3>

      {!isDone ? (
        <SignaturePad onSave={saveSignature} />
      ) : wo.signature?.url ? (
        <img
          src={wo.signature.url}
          alt="signature"
          width={400}
          className="border"
        />
      ) : (
        <p>No signature</p>
      )}
    </Card>
  );
}
