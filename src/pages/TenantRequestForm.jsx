import {
  Card,
  Input,
  Button,
  message,
  Upload,
  Typography,
  Form,
  Space,
  Divider,
} from "antd";
import { SendOutlined, FileImageOutlined } from "@ant-design/icons";
import { useState } from "react";
import api from "../api/axios";

const { Title, Text } = Typography;

export default function TenantRequestForm() {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);

  const submit = async (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    files.forEach((file) => {
      formData.append("images", file);
    });

    await api.post("/tenant/request", formData);

    message.success("Request submitted");

    form.resetFields();
    setFiles([]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 16,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
        bodyStyle={{
          padding: window.innerWidth < 500 ? 20 : 32,
        }}
      >
        <Space direction="vertical" size={4}>
          <Title level={4} style={{ marginBottom: 0 }}>
            Maintenance Request
          </Title>

          <Text type="secondary">
            Report an issue to the building management team
          </Text>
        </Space>

        <Divider />

        <Form layout="vertical" form={form} onFinish={submit}>
          <Form.Item
            label="Issue Title"
            name="title"
            rules={[
              { required: true, message: "Please enter issue title" },
              { min: 5, message: "Title must be at least 5 characters" },
            ]}
          >
            <Input
              size="large"
              placeholder="Example: Air conditioner leaking"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please describe the issue" },
              {
                min: 10,
                message: "Description must be at least 10 characters",
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Describe the issue..." />
          </Form.Item>

          <Form.Item
            label="Your Name"
            name="tenantName"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input size="large" placeholder="Tenant name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="tenantEmail"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input size="large" placeholder="your@email.com" />
          </Form.Item>

          <Form.Item label="Upload Images (optional)">
            <Upload
              multiple
              beforeUpload={(file) => {
                setFiles((prev) => [...prev, file]);
                return false;
              }}
              maxCount={5}
              style={{ width: "100%" }}
            >
              <Button
                icon={<FileImageOutlined />}
                style={{
                  width: "100%",
                  borderRadius: 8,
                }}
              >
                Upload Photos
              </Button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            icon={<SendOutlined />}
            style={{
              borderRadius: 10,
              height: 48,
              fontWeight: 500,
            }}
          >
            Submit Request
          </Button>
        </Form>
      </Card>
    </div>
  );
}
