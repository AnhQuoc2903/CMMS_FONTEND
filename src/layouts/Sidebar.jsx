import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
  const nav = useNavigate();
  const { user } = useAuth();

  const items = [
    { key: "/", label: "Dashboard" },
    { key: "/work-orders", label: "Work Orders" },
    { key: "/assets", label: "Assets" },
    { key: "/inventory", label: "Inventory" },
  ];

  // ✅ ADMIN / MANAGER mới thấy
  if (user?.role === "ADMIN" || user?.role === "MANAGER") {
    items.push({ key: "/technicians", label: "Technicians" });
  }

  return <Menu mode="inline" onClick={(e) => nav(e.key)} items={items} />;
}
