import api from "./axios";

export const getChecklistTemplates = () => api.get("/checklist-templates");

export const createChecklistTemplate = (data) =>
  api.post("/checklist-templates", data);

// ✅ THÊM API UPDATE
export const updateChecklistTemplate = (id, data) =>
  api.put(`/checklist-templates/${id}`, data);

export const toggleChecklistTemplate = (id) =>
  api.patch(`/checklist-templates/${id}/toggle`);

export const deleteChecklistTemplate = (id) =>
  api.delete(`/checklist-templates/${id}`);
