import { Card, Form, Input, Button, Typography, Space, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const { Title, Text } = Typography;

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (v) => {
    try {
      setLoading(true);

      const r = await loginApi(v);

      login(r.data.token);

      message.success("Login successful");

      nav("/");
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Login failed. Please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Space direction="vertical" size={4}>
          <Title level={3} style={{ marginBottom: 0 }}>
            CMMS Login
          </Title>

          <Text type="secondary">
            Sign in to access maintenance management system
          </Text>
        </Space>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="your@email.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Enter password"
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{
              borderRadius: 8,
              height: 44,
              fontWeight: 500,
            }}
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
