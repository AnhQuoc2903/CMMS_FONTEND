import { Card, Form, Input, Button } from "antd";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const onFinish = async (v) => {
    const r = await loginApi(v);
    login(r.data.token);
    nav("/");
  };

  return (
    <Card className="max-w-md mx-auto mt-32">
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item name="email" label="Email" required>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" required>
          <Input.Password />
        </Form.Item>
        <div className="text-right mb-4">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form>
    </Card>
  );
}
