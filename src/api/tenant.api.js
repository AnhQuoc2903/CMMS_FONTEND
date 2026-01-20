import api from "./axios";

export const buildingApprove = (id, note) =>
  api.post(`/tenant/${id}/building-approve`, { note });

export const mspReview = (id, note) =>
  api.post(`/tenant/${id}/msp-review`, { note });

export const finalApprove = (id) => api.post(`/tenant/${id}/final-approve`);

export const rejectTenantRequest = (id, reason) =>
  api.post(`/tenant/${id}/reject`, { reason });

export const getTenantRequests = () => api.get("/tenant");
