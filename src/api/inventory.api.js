import api from "./axios";

/* ===== LIST ===== */
export const getInventory = (params) => api.get("/inventory", { params });

export const getLowStock = () => api.get("/inventory/low-stock");

/* ===== DETAIL ===== */
export const getSparePartDetail = (id) => api.get(`/inventory/${id}`);

/* ===== CREATE ===== */
export const createSparePart = (data) => api.post("/inventory", data);

/* ===== UPDATE (NO STATUS) ===== */
export const updateSparePart = (id, data) =>
  api.patch(`/inventory/${id}`, data);

/* ===== STATUS ===== */
export const disableSparePart = (id) => api.patch(`/inventory/${id}/disable`);

export const enableSparePart = (id) => api.patch(`/inventory/${id}/enable`);

/* ===== STOCK IN ===== */
export const stockInSparePart = (id, data) =>
  api.post(`/inventory/${id}/stock-in`, data);
