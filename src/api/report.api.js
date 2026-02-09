import api from "./axios";

export const getSLAReport = () => {
  return api.get("/reports/sla");
};

export const getSLAMonthlyReport = (year) =>
  api.get("/reports/sla/monthly", { params: { year } });

export const getDashboardSummary = (days) =>
  api.get("/reports/dashboard/summary", {
    params: days ? { days } : {},
  });

export const getDashboardStatus = (days) =>
  api.get("/reports/dashboard/status", {
    params: days ? { days } : {},
  });

export const getDashboardSLA = () => api.get("/reports/dashboard/sla");

export const getDashboardPM = () => api.get("/reports/dashboard/pm");

export const getDashboardOverdue = () => api.get("/reports/dashboard/overdue");

export const getAssetDowntimeSummary = () =>
  api.get("/reports/dashboard/asset-downtime");
