import {
  Layout,
  Menu,
  Button,
  Modal,
  Form,
  Input,
  message,
  Avatar,
  Dropdown,
  Badge,
  Space,
  Divider,
} from "antd";
import {
  LockOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ToolOutlined,
  DatabaseOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
  HistoryOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TrophyOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  CrownOutlined,
  StarOutlined,
  GiftOutlined,
  SettingOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ROLES } from "../constants/roles";
import { changePasswordApi } from "../api/auth.api";
import NotificationBell from "../components/NotificationBell";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Bảng màu theo role - rực rỡ hơn
  const roleColors = {
    [ROLES.SUPER_ADMIN]: {
      primary: "#8A2BE2", // Màu tím điện
      secondary: "#F3E5FF",
      gradient:
        "linear-gradient(135deg, #8A2BE2 0%, #9370DB 50%, #BA55D3 100%)",
      accent: "#FF69B4",
      icon: <CrownOutlined />,
      light: "#E6D9FF",
    },
    [ROLES.BUILDING_MANAGER]: {
      primary: "#00CED1", // Màu xanh ngọc sáng
      secondary: "#E0FFFF",
      gradient:
        "linear-gradient(135deg, #00CED1 0%, #40E0D0 50%, #48D1CC 100%)",
      accent: "#FFD700",
      icon: <RocketOutlined />,
      light: "#D0F0F0",
    },
    [ROLES.MSP_SUPERVISOR]: {
      primary: "#FF8C00", // Màu cam sáng
      secondary: "#FFF0E0",
      gradient:
        "linear-gradient(135deg, #FF8C00 0%, #FFA500 50%, #FFB347 100%)",
      accent: "#00BFFF",
      icon: <StarOutlined />,
      light: "#FFE4CC",
    },
    default: {
      primary: "#1E90FF", // Màu xanh dương sáng
      secondary: "#E6F3FF",
      gradient:
        "linear-gradient(135deg, #1E90FF 0%, #4169E1 50%, #6495ED 100%)",
      accent: "#32CD32",
      icon: <SafetyOutlined />,
      light: "#D4E6FF",
    },
  };

  const currentColor = roleColors[user?.role] || roleColors.default;

  const items = [];

  // ✅ DASHBOARD – LUÔN ĐỨNG ĐẦU
  if (
    user?.role === ROLES.SUPER_ADMIN ||
    user?.role === ROLES.BUILDING_MANAGER
  ) {
    items.push({
      key: "/dashboard",
      icon: <DashboardOutlined style={{ color: currentColor.primary }} />,
      label: <span style={{ fontWeight: 500 }}>Dashboard</span>,
      style: { margin: "4px 0", borderRadius: 8 },
    });
  }

  // ✅ COMMON MODULES
  items.push(
    {
      key: "/work-orders",
      icon: <ToolOutlined style={{ color: "#FF6B6B" }} />,
      label: "Work Orders",
      style: { margin: "4px 0", borderRadius: 8 },
    },
    {
      key: "/assets",
      icon: <DatabaseOutlined style={{ color: "#4ECDC4" }} />,
      label: "Assets",
      style: { margin: "4px 0", borderRadius: 8 },
    },
    {
      key: "/asset-groups",
      icon: <DatabaseOutlined style={{ color: "#4ECDC4" }} />,
      label: "Asset Groups",
      style: { margin: "4px 0", borderRadius: 8 },
    },
    {
      key: "/inventory",
      icon: <DatabaseOutlined style={{ color: "#45B7D1" }} />,
      label: "Inventory",
      style: { margin: "4px 0", borderRadius: 8 },
    },
  );

  // ✅ SUPER_ADMIN / BUILDING_MANAGER
  if (
    user?.role === ROLES.SUPER_ADMIN ||
    user?.role === ROLES.BUILDING_MANAGER
  ) {
    items.push(
      {
        type: "divider",
        style: { margin: "12px 0", background: currentColor.light },
      },
      {
        key: "/technicians",
        icon: <TeamOutlined style={{ color: "#FFA07A" }} />,
        label: "Technicians",
        style: { margin: "4px 0", borderRadius: 8 },
      },
      {
        key: "/tenant-requests",
        icon: <FileTextOutlined style={{ color: "#98D8C8" }} />,
        label: "Tenant Requests",
        style: { margin: "4px 0", borderRadius: 8 },
      },
      {
        key: "/checklist-templates",
        icon: <CheckSquareOutlined style={{ color: "#DDA0DD" }} />,
        label: "Checklist Templates",
        style: { margin: "4px 0", borderRadius: 8 },
      },
      {
        key: "/inventory-history",
        icon: <HistoryOutlined style={{ color: "#F0E68C" }} />,
        label: "Inventory History",
        style: { margin: "4px 0", borderRadius: 8 },
      },
      {
        key: "/maintenance-plans",
        icon: <CalendarOutlined style={{ color: "#9ACD32" }} />,
        label: "Maintenance Plans",
        style: { margin: "4px 0", borderRadius: 8 },
      },
      {
        type: "divider",
        style: { margin: "12px 0", background: currentColor.light },
      },
      {
        key: "/reports/sla",
        icon: <BarChartOutlined style={{ color: "#FFB6C1" }} />,
        label: "SLA Dashboard",
        style: { margin: "4px 0", borderRadius: 8 },
      },
      {
        key: "/sla/technicians",
        icon: <TrophyOutlined style={{ color: "#FFD700" }} />,
        label: "SLA Technician Ranking",
        style: { margin: "4px 0", borderRadius: 8 },
      },
    );
  }

  // ✅ MSP_SUPERVISOR
  if (user?.role === ROLES.MSP_SUPERVISOR) {
    items.push({
      key: "/tenant-requests",
      icon: <FileTextOutlined style={{ color: "#98D8C8" }} />,
      label: "Tenant Requests",
      style: { margin: "4px 0", borderRadius: 8 },
    });
  }

  items.push(
    {
      type: "divider",
      style: { margin: "12px 0", background: currentColor.light },
    },
    {
      key: "/notifications",
      icon: <BellOutlined style={{ color: "#FF69B4" }} />,
      label: (
        <Space>
          Notifications
          <Badge style={{ backgroundColor: currentColor.primary }} />
        </Space>
      ),
      style: { margin: "4px 0", borderRadius: 8 },
    },
  );

  const handleLogout = () => {
    Modal.confirm({
      title: <span style={{ color: "#FF4D4F" }}>🔐 Confirm Logout</span>,
      icon: <LogoutOutlined style={{ color: "#FF4D4F" }} />,
      content: (
        <span style={{ fontSize: 16 }}>Are you sure you want to logout?</span>
      ),
      okText: (
        <span>
          <LogoutOutlined /> Logout
        </span>
      ),
      okButtonProps: {
        danger: true,
        style: { background: "#FF4D4F", borderColor: "#FF4D4F" },
      },
      cancelText: "Cancel",
      onOk: () => {
        logout();
        nav("/login");
      },
    });
  };

  const handleChangePassword = () => {
    Modal.confirm({
      title: (
        <span style={{ color: currentColor.primary }}>🔑 Change Password</span>
      ),
      icon: null,
      width: 500,
      content: (
        <Form
          layout="vertical"
          id="change-password-form"
          onFinish={async (values) => {
            try {
              await changePasswordApi(values);
              message.success({
                content: (
                  <span>
                    <LockOutlined /> Password changed successfully!
                  </span>
                ),
                style: {
                  marginTop: "10vh",
                  background: currentColor.gradient,
                  color: "white",
                },
              });
              logout();
              nav("/login");
            } catch (err) {
              message.error(
                err?.response?.data?.message || "Change password failed",
              );
            }
          }}
          style={{ marginTop: 20 }}
        >
          <div
            style={{
              background: currentColor.secondary,
              padding: 20,
              borderRadius: 16,
              border: `2px dashed ${currentColor.light}`,
            }}
          >
            <Form.Item
              name="oldPassword"
              label={
                <span style={{ color: currentColor.primary, fontWeight: 500 }}>
                  🔒 Old password
                </span>
              }
              rules={[{ required: true, message: "Please enter old password" }]}
            >
              <Input.Password
                prefix={
                  <LockOutlined style={{ color: currentColor.primary }} />
                }
                placeholder="Enter old password"
                style={{
                  borderRadius: 12,
                  borderColor: currentColor.light,
                }}
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label={
                <span style={{ color: currentColor.primary, fontWeight: 500 }}>
                  🔐 New password
                </span>
              }
              rules={[
                { required: true, message: "Please enter new password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined style={{ color: currentColor.primary }} />
                }
                placeholder="Enter new password"
                style={{
                  borderRadius: 12,
                  borderColor: currentColor.light,
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label={
                <span style={{ color: currentColor.primary, fontWeight: 500 }}>
                  ✅ Confirm new password
                </span>
              }
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm password" },
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
              <Input.Password
                prefix={
                  <LockOutlined style={{ color: currentColor.primary }} />
                }
                placeholder="Confirm new password"
                style={{
                  borderRadius: 12,
                  borderColor: currentColor.light,
                }}
              />
            </Form.Item>
          </div>
        </Form>
      ),
      okText: (
        <span>
          <LockOutlined /> Change password
        </span>
      ),
      okButtonProps: {
        style: { background: currentColor.gradient, border: "none" },
      },
      cancelText: "Cancel",
      onOk: () =>
        document
          .getElementById("change-password-form")
          .dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true }),
          ),
    });
  };

  const userMenuItems = [
    {
      key: "change-password",
      icon: <LockOutlined style={{ color: currentColor.primary }} />,
      label: "Change Password",
      onClick: handleChangePassword,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "#FF4D4F" }} />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen" style={{ background: "#F8F9FA" }}>
      <Sider
        width={260}
        collapsed={collapsed}
        style={{
          background: "#ffffff",
          boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          overflow: "auto",
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
          zIndex: 1000,
        }}
      >
        {/* Logo Area với gradient đẹp */}
        <div
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? 0 : "0 24px",
            background: currentColor.gradient,
            borderBottom: "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Hiệu ứng ánh sáng */}
          <div
            style={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -50,
              left: -50,
              width: 150,
              height: 150,
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          />

          {!collapsed ? (
            <Space align="center" size={12}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(5px)",
                }}
              >
                <ThunderboltOutlined style={{ fontSize: 24, color: "white" }} />
              </div>
              <div>
                <span
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  CMMS
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 20,
                    fontWeight: 300,
                    marginLeft: 4,
                  }}
                >
                  System
                </span>
              </div>
            </Space>
          ) : (
            <ThunderboltOutlined style={{ fontSize: 32, color: "white" }} />
          )}
        </div>

        {/* User Profile Card */}
        {!collapsed && (
          <div
            style={{
              padding: "24px 16px 16px",
              background: `linear-gradient(135deg, ${currentColor.secondary} 0%, #ffffff 100%)`,
              borderBottom: `2px solid ${currentColor.light}`,
            }}
          >
            <Space align="center" size={16} style={{ width: "100%" }}>
              <Avatar
                size={64}
                style={{
                  background: currentColor.gradient,
                  boxShadow: `0 8px 16px ${currentColor.light}`,
                  border: "3px solid white",
                }}
                icon={currentColor.icon}
              />
              <div>
                <div
                  style={{ fontWeight: 700, fontSize: 18, color: "#2C3E50" }}
                ></div>
                <Badge
                  color={currentColor.primary}
                  text={user?.role}
                  style={{ fontSize: 13, color: "#7F8C8D" }}
                />
              </div>
            </Space>
          </div>
        )}

        <Menu
          mode="inline"
          selectedKeys={[`/${location.pathname.split("/")[1]}`]}
          onClick={(e) => nav(e.key)}
          items={items}
          style={{
            border: "none",
            padding: "16px 12px",
            background: "transparent",
          }}
          theme="light"
        />

        {/* Sidebar Footer */}
        {!collapsed && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              padding: "0 20px",
              textAlign: "center",
            }}
          >
            <Divider
              style={{ margin: "0 0 12px 0", background: currentColor.light }}
            />
            <Space direction="vertical" size={2}>
              <GiftOutlined style={{ color: currentColor.primary }} />
              <span style={{ color: "#95A5A6", fontSize: 11 }}>
                Version 2.0.0
              </span>
            </Space>
          </div>
        )}
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
          minHeight: "100vh",
          background: "#F8F9FA",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: "#ffffff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            position: "sticky",
            top: 0,
            zIndex: 999,
            height: 72,
            lineHeight: "72px",
            borderBottom: `3px solid ${currentColor.light}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "20px",
                width: 48,
                height: 48,
                background: currentColor.secondary,
                color: currentColor.primary,
                borderRadius: 12,
                border: `1px solid ${currentColor.light}`,
              }}
            />

            <Space size={24} align="center">
              {/* Notification Bell với màu sắc */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: currentColor.secondary,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: `1px solid ${currentColor.light}`,
                }}
              >
                <NotificationBell />
              </div>

              <Divider
                type="vertical"
                style={{ height: 32, background: currentColor.light }}
              />

              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
              >
                <Space style={{ cursor: "pointer" }} size={12}>
                  <Avatar
                    size={48}
                    style={{
                      background: currentColor.gradient,
                      boxShadow: `0 4px 12px ${currentColor.light}`,
                      border: `2px solid white`,
                    }}
                    icon={currentColor.icon}
                  />
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content
          style={{
            margin: "28px",
            padding: 28,
            background: "#ffffff",
            borderRadius: 24,
            minHeight: "calc(100vh - 128px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
            border: `1px solid ${currentColor.light}`,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
