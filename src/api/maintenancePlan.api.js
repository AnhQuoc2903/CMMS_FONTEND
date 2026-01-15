import api from "./axios";

export const getMaintenancePlans = () => api.get("/maintenance-plans");

export const createMaintenancePlan = (data) =>
  api.post("/maintenance-plans", data);

export const toggleMaintenancePlan = (id) =>
  api.patch(`/maintenance-plans/${id}/toggle`);
export const updateMaintenancePlan = (id, data) =>
  api.patch(`/maintenance-plans/${id}`, data);

export const getMaintenancePlanWorkOrders = (id) =>
  api.get(`/maintenance-plans/${id}/work-orders`);

export const runMaintenancePlan = (id) =>
  api.post(`/maintenance-plans/${id}/run`);
