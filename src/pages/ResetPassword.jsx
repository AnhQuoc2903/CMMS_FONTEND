import { Card, Form, Input, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../api/auth.api";

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();

  const onFinish = async (values) => {
    await resetPasswordApi(token, values.password);
    message.success("Password reset successfully");
    nav("/login");
  };

  return (
    <Card className="max-w-md mx-auto mt-32">
      <h2 className="text-lg font-semibold mb-4">Reset Password</h2>

      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="password"
          label="New password"
          rules={[{ required: true, min: 6 }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true },
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
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Reset password
        </Button>
      </Form>
    </Card>
  );
}
