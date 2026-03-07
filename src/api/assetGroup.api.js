import api from "./axios";

export const getAssetGroups = () => api.get("/asset-groups");

export const createAssetGroup = (data) => api.post("/asset-groups", data);

export const updateAssetGroup = (id, data) =>
  api.patch(`/asset-groups/${id}`, data);

export const deleteAssetGroup = (id) => api.delete(`/asset-groups/${id}`);
