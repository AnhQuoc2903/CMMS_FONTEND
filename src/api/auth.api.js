import api from "./axios";

export const loginApi = (data) => api.post("/auth/login", data);
// auth.api.js

export const forgotPasswordApi = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPasswordApi = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password });

export const changePasswordApi = (data) =>
  api.post("/auth/change-password", data);
