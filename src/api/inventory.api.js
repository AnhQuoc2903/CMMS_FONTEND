import api from "./axios";

export const getInventory = () => api.get("/inventory");
