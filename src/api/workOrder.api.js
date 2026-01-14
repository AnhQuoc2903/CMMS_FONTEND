import api from "./axios";

/* ================= LIST & DETAIL ================= */
export const getWorkOrders = (params) => api.get("/work-orders", { params });

export const getWorkOrderDetail = (id) => api.get(`/work-orders/${id}`);

/* ================= EXECUTION ================= */
export const uploadPhoto = (id, formData) =>
  api.post(`/work-orders/${id}/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const uploadSignature = (id, base64) =>
  api.post(`/work-orders/${id}/signature`, {
    signature: base64,
  });

export const updateChecklist = (id, checklist) =>
  api.patch(`/work-orders/${id}/checklist`, { checklist });

/* ================= ASSIGNMENT ================= */
export const assignAssets = (id, assets) =>
  api.patch(`/work-orders/${id}/assets`, { assets });

export const assignTechnicians = (id, technicians) =>
  api.patch(`/work-orders/${id}/technicians`, { technicians });

/* ================= WORKFLOW ================= */
export const submitWorkOrder = (id) => api.patch(`/work-orders/${id}/submit`);

export const approveWorkOrder = (id) => api.patch(`/work-orders/${id}/approve`);

export const rejectWorkOrder = (id, payload) =>
  api.patch(`/work-orders/${id}/reject`, payload);
/*
payload = {
  reason: string
}
*/

export const startWorkOrder = (id) => api.patch(`/work-orders/${id}/start`);

export const closeWorkOrder = (id) => api.patch(`/work-orders/${id}/close`);

/* ================= EXPORT ================= */
export const exportPDF = (id) =>
  api.get(`/work-orders/${id}/pdf`, {
    responseType: "blob",
  });

export const applyChecklistTemplate = (id, templateId) =>
  api.post(`/work-orders/${id}/apply-checklist-template`, {
    templateId,
  });

export const reviewWorkOrder = (id, note) =>
  api.patch(`/work-orders/${id}/review`, { note });

export const verifyWorkOrder = (id) => api.patch(`/work-orders/${id}/verify`);

export const updatePriority = (id, priority) =>
  api.patch(`/work-orders/${id}/priority`, { priority });

// ===== REVIEW / VERIFY REJECT =====
export const rejectReview = (id, reason) =>
  api.patch(`/work-orders/${id}/review-reject`, { reason });

export const rejectVerification = (id, reason) =>
  api.patch(`/work-orders/${id}/verify-reject`, { reason });

export const getMyWorkOrderHistory = (id) =>
  api.get(`/work-orders/${id}/my-history`);
