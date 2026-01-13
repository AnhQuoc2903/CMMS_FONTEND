import api from "./axios";

export const getTechnicians = () => api.get("/users/technicians");

export const createTechnician = (data) => api.post("/users/technicians", data);

// chỉ sửa name/email
export const updateTechnician = (id, data) =>
  api.patch(`/users/technicians/${id}`, data);

// đổi trạng thái
export const disableTechnician = (id) =>
  api.patch(`/users/technicians/${id}/disable`);

export const enableTechnician = (id) =>
  api.patch(`/users/technicians/${id}/enable`);
