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
import {
  SendOutlined,
  FileImageOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function TenantRequestForm() {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);
  const { user } = useAuth();

  const nav = useNavigate();

  const isLoggedIn = !!user;

  const submit = async (values) => {
    try {
      const formData = new FormData();

      // ✅ fields chính
      formData.append("title", values.title);
      formData.append("location", values.location);
      formData.append("description", values.description);

      // ✅ chỉ guest mới gửi
      if (!isLoggedIn) {
        formData.append("tenantName", values.tenantName);
        formData.append("tenantEmail", values.tenantEmail);
      }

      // ✅ upload ảnh đúng
      files.forEach((file) => {
        formData.append("images", file); // 🔥 dùng file luôn
      });
      await api.post("/tenant/request", formData);

      message.success("Request submitted");

      form.resetFields();
      setFiles([]);
    } catch (err) {
      console.error(err);
      message.error("Submit failed");
    }
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
      >
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <Title level={4} style={{ marginBottom: 0 }}>
            Maintenance Request
          </Title>

          {/* ✅ show info nếu login */}
          {isLoggedIn && (
            <Text>
              Logged in as: {user.name} ({user.email})
            </Text>
          )}

          <Text type="secondary">
            Report an issue to the building management team
          </Text>
          {user?.role === "TENANT" && (
            <Button
              type="primary"
              ghost
              size="middle"
              icon={<FileTextOutlined />}
              onClick={() => nav("/my-requests")}
              style={{
                borderRadius: 8,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              My Requests
            </Button>
          )}
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
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          {/* ✅ chỉ guest mới hiện */}
          {!isLoggedIn && (
            <>
              <Form.Item
                label="Your Name"
                name="tenantName"
                rules={[{ required: true, message: "Enter your name" }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="tenantEmail"
                rules={[
                  { required: true, message: "Enter email" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </>
          )}

          <Form.Item label="Upload Images (optional)">
            <Upload
              listType="picture"
              multiple
              fileList={files}
              beforeUpload={(file) => {
                setFiles((prev) => [...prev, file]);
                return false;
              }}
              onRemove={(file) =>
                setFiles((prev) => prev.filter((f) => f.uid !== file.uid))
              }
              maxCount={5}
            >
              <Button icon={<FileImageOutlined />} style={{ width: "100%" }}>
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
            style={{ borderRadius: 10, height: 48 }}
          >
            Submit Request
          </Button>
        </Form>
      </Card>
    </div>
  );
}
