import { Card, Input, Button, message } from "antd";
import { useState } from "react";
import api from "../api/axios";

export default function TenantRequestForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tenantName: "",
    tenantEmail: "",
  });

  const submit = async () => {
    if (!form.title || !form.tenantName) {
      return message.error("Title & Tenant name required");
    }

    await api.post("/tenant/request", form);
    message.success("Request submitted");
    setForm({
      title: "",
      description: "",
      tenantName: "",
      tenantEmail: "",
    });
  };

  return (
    <Card title="Maintenance Request" style={{ maxWidth: 500 }}>
      <Input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <Input.TextArea
        rows={3}
        placeholder="Description"
        style={{ marginTop: 10 }}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <Input
        placeholder="Tenant name"
        style={{ marginTop: 10 }}
        value={form.tenantName}
        onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
      />
      <Input
        placeholder="Tenant email"
        style={{ marginTop: 10 }}
        value={form.tenantEmail}
        onChange={(e) => setForm({ ...form, tenantEmail: e.target.value })}
      />

      <Button type="primary" block style={{ marginTop: 15 }} onClick={submit}>
        Submit Request
      </Button>
    </Card>
  );
}
