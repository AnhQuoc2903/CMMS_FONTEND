import { Card, Form, Input, Button, message, Typography, Space } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { forgotPasswordApi } from "../api/auth.api";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

export default function ForgotPassword() {
  const onFinish = async (values) => {
    await forgotPasswordApi(values.email);
    message.success("If the email exists, a reset link has been sent.");
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
            Forgot Password
          </Title>

          <Text type="secondary">
            Enter your email to receive a password reset link
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

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            style={{
              borderRadius: 8,
              height: 44,
              fontWeight: 500,
            }}
          >
            Send reset link
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
