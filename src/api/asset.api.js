import api from "./axios";

export const getAssets = (params) => api.get("/assets", { params });
export const createAsset = (data) => api.post("/assets", data);
export const updateAsset = (id, data) => api.patch(`/assets/${id}`, data);

export const deleteAsset = (id) => api.delete(`/assets/${id}`);

export const getAssetDetail = (id) => api.get(`/assets/${id}`);
export const getAssetHistory = (id) => api.get(`/assets/${id}/history`);
export const maintainAsset = (id, note) =>
  api.patch(`/assets/${id}/maintain`, { note });
