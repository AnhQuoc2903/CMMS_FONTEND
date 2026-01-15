import axios from "./axios";

export const getInventoryLogs = (params = {}) =>
  axios.get("/inventory-logs", { params });
