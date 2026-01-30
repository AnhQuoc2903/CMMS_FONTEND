import axios from "./axios";

export const getNotifications = () => axios.get("/notifications");

export const getUnreadCount = () => axios.get("/notifications/unread-count");

export const markAsRead = (id) => axios.patch(`/notifications/${id}/read`);

export const markAllAsRead = () => axios.patch("/notifications/read-all");
