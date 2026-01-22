import api from "./axios"; // axios instance có interceptor JWT

export const getSLATechnicianRanking = () =>
  api.get("/sla/technicians/ranking");

export const getSLATechnicianProfile = (id) =>
  api.get(`/sla/technicians/${id}`);
