import { Layout, Menu, Button, Modal, Form, Input, message } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ROLES } from "../constants/roles";
import { changePasswordApi } from "../api/auth.api";
import NotificationBell from "../components/NotificationBell";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const items = [];

  // ✅ DASHBOARD – LUÔN ĐỨNG ĐẦU
  if (
    user?.role === ROLES.SUPER_ADMIN ||
    user?.role === ROLES.BUILDING_MANAGER
  ) {
    items.push({ key: "/dashboard", label: "Dashboard" });
  }

  // ✅ COMMON MODULES
  items.push(
    { key: "/work-orders", label: "Work Orders" },
    { key: "/assets", label: "Assets" },
    { key: "/inventory", label: "Inventory" },
  );
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

  items.push({ key: "/notifications", label: "Notifications" });

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm logout",
      content: "Are you sure you want to logout?",
      okText: "Logout",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        logout();
        nav("/login");
      },
    });
  };

  const handleChangePassword = () => {
    Modal.confirm({
      title: "Change Password",
      icon: null,
      content: (
        <Form
          layout="vertical"
          id="change-password-form"
          onFinish={async (values) => {
            try {
              await changePasswordApi(values);
              message.success("Password changed successfully");

              // 👉 Logout luôn cho an toàn
              logout();
              nav("/login");
            } catch (err) {
              message.error(
                err?.response?.data?.message || "Change password failed",
              );
            }
          }}
        >
          <Form.Item
            name="oldPassword"
            label="Old password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm new password"
            dependencies={["newPassword"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      ),
      okText: "Change password",
      okType: "primary",
      cancelText: "Cancel",
      onOk: () =>
        document
          .getElementById("change-password-form")
          .dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true }),
          ),
    });
  };

  return (
    <Layout className="min-h-screen">
      <Sider width={220} className="bg-white">
        <Menu
          mode="inline"
          selectedKeys={[`/${location.pathname.split("/")[1]}`]}
          onClick={(e) => nav(e.key)}
          items={items}
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold">CMMS System – {user?.role}</h1>

          <div className="flex items-center gap-4">
            <div style={{ float: "right", marginRight: 16 }}>
              <NotificationBell />
            </div>

            <Button onClick={handleChangePassword}>Change password</Button>

            <Button danger onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Header>

        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
