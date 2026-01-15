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
    items.push({ key: "/tenant-requests", label: "Tenant Requests" });
    items.push({ key: "/checklist-templates", label: "Checklist Templates" });
    items.push({ key: "/inventory-history", label: "Inventory History" });
    items.push({ key: "/maintenance-plans", label: "Maintenance Plans" });
  }

  return <Menu mode="inline" onClick={(e) => nav(e.key)} items={items} />;
}
