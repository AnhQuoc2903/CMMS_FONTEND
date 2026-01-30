import api from "./axios";

export const getSLAReport = () => {
  return api.get("/reports/sla");
};

export const getSLAMonthlyReport = (year) =>
  api.get("/reports/sla/monthly", { params: { year } });

export const getDashboardSummary = () => api.get("/reports/dashboard/summary");
export const getDashboardStatus = () => api.get("/reports/dashboard/status");
export const getDashboardSLA = () => api.get("/reports/dashboard/sla");
export const getDashboardPM = () => api.get("/reports/dashboard/pm");
export const getDashboardOverdue = () => api.get("/reports/dashboard/overdue");
