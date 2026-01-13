import api from "./axios";
export const getTechnicianAuditLogs = (id) =>
  api.get(`/audit/technicians/${id}`);
