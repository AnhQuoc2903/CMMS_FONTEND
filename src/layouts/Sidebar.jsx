import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ROLES } from "../constants/roles";

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
  if (
    user?.role === ROLES.SUPER_ADMIN ||
    user?.role === ROLES.BUILDING_MANAGER
  ) {
    items.push({ key: "/technicians", label: "Technicians" });
    items.push({ key: "/tenant-requests", label: "Tenant Requests" });
    items.push({ key: "/checklist-templates", label: "Checklist Templates" });
    items.push({ key: "/inventory-history", label: "Inventory History" });
    items.push({ key: "/maintenance-plans", label: "Maintenance Plans" });
    items.push({ key: "/reports/sla", label: "SLA Dashboard" });
    items.push({ key: "/sla/technicians", label: "SLA Technician Ranking" });
  }

  if (user?.role === ROLES.MSP_SUPERVISOR) {
    items.push({ key: "/tenant-requests", label: "Tenant Requests" });
  }

  return <Menu mode="inline" onClick={(e) => nav(e.key)} items={items} />;
}
