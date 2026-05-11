import api from "./axios";

export const getTenantRequests = () => api.get("/tenant");

export const submitTenantRequest = (data) =>
  api.post("/tenant/request", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyRequests = () => api.get("/tenant/my");

export const buildingApprove = (id, note) =>
  api.post(`/tenant/${id}/building-approve`, { note });

export const mspReview = (id, note) =>
  api.post(`/tenant/${id}/msp-review`, { note });

export const finalApprove = (id) => api.post(`/tenant/${id}/final-approve`);

export const rejectTenantRequest = (id, reason) =>
  api.post(`/tenant/${id}/reject`, { reason });
