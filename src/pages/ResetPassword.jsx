import { Card, Form, Input, Button, message, Typography, Space } from "antd";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPasswordApi } from "../api/auth.api";

const { Title, Text } = Typography;

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();

  const onFinish = async (values) => {
    await resetPasswordApi(token, values.password);
    message.success("Password reset successfully");
    nav("/login");
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
            Reset Password
          </Title>

          <Text type="secondary">Enter your new password to continue</Text>
        </Space>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Confirm password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            style={{
              borderRadius: 8,
              height: 44,
              fontWeight: 500,
            }}
          >
            Reset Password
          </Button>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/login">
              <ArrowLeftOutlined /> Back to login
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
