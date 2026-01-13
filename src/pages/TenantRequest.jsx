import { Form, Input, Button, Card } from "antd";
import api from "../api/axios";

export default function TenantRequest() {
  return (
    <Card className="max-w-lg mx-auto mt-20">
      <Form layout="vertical" onFinish={(v) => api.post("/tenant/request", v)}>
        <Form.Item name="title" label="Title" required>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Card>
  );
}
