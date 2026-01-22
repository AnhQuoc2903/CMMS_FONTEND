import api from "./axios";

export const getSLAReport = () => {
  return api.get("/reports/sla");
};

export const getSLAMonthlyReport = (year) =>
  api.get("/reports/sla/monthly", { params: { year } });
