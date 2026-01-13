import api from "./axios";

export const getWorkOrders = (params) => api.get("/work-orders", { params });

export const getWorkOrderDetail = (id) => api.get(`/work-orders/${id}`);

export const uploadPhoto = (id, formData) =>
  api.post(`/work-orders/${id}/photo`, formData);

export const uploadSignature = (id, base64) =>
  api.post(`/work-orders/${id}/signature`, {
    signature: base64,
  });

export const exportPDF = (id) =>
  api.get(`/work-orders/${id}/pdf`, {
    responseType: "blob",
  });

export const updateChecklist = (id, checklist) =>
  api.patch(`/work-orders/${id}/checklist`, { checklist });

export const assignAssets = (id, assets) =>
  api.patch(`/work-orders/${id}/assets`, { assets });

export const assignTechnicians = (id, technicians) =>
  api.patch(`/work-orders/${id}/technicians`, { technicians });
