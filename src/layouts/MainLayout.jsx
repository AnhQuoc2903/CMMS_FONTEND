import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ROLES } from "../constants/roles";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const nav = useNavigate();
  const { user } = useAuth();

  const items = [
    { key: "/", label: "Dashboard" },
    { key: "/work-orders", label: "Work Orders" },
    { key: "/assets", label: "Assets" },
    { key: "/inventory", label: "Inventory" },
  ];

  // ✅ SUPER_ADMIN / BUILDING_MANAGER
  if (
    user?.role === ROLES.SUPER_ADMIN ||
    user?.role === ROLES.BUILDING_MANAGER
  ) {
    items.push(
      { key: "/technicians", label: "Technicians" },
      { key: "/tenant-requests", label: "Tenant Requests" },
      { key: "/checklist-templates", label: "Checklist Templates" },
      { key: "/inventory-history", label: "Inventory History" },
      { key: "/maintenance-plans", label: "Maintenance Plans" },
      { key: "/reports/sla", label: "SLA Dashboard" },
      { key: "/sla/technicians", label: "SLA Technician Ranking" },
    );
  }

  // ✅ MSP_SUPERVISOR
  if (user?.role === ROLES.MSP_SUPERVISOR) {
    items.push({ key: "/tenant-requests", label: "Tenant Requests" });
  }

  return (
    <Layout className="min-h-screen">
      <Sider width={220} className="bg-white">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(e) => nav(e.key)}
          items={items}
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow px-6 flex items-center">
          <h1 className="text-lg font-semibold">CMMS System – {user?.role}</h1>
        </Header>

        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
