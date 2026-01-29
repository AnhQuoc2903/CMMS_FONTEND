import { Card, Form, Input, Button, message } from "antd";
import { forgotPasswordApi } from "../api/auth.api";

export default function ForgotPassword() {
  const onFinish = async (values) => {
    await forgotPasswordApi(values.email);
    message.success("If the email exists, a reset link has been sent.");
  };

  return (
    <Card className="max-w-md mx-auto mt-32">
      <h2 className="text-lg font-semibold mb-4">Forgot Password</h2>

      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Send reset link
        </Button>
      </Form>
    </Card>
  );
}
