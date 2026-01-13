import api from "./axios";

export const getTenantRequests = () => api.get("/tenant");

export const approveTenantRequest = (id) => api.patch(`/tenant/${id}/approve`);

export const rejectTenantRequest = (id, reason) =>
  api.patch(`/tenant/${id}/reject`, { reason });
