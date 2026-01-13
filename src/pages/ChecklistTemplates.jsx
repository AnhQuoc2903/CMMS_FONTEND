/* eslint-disable react-hooks/set-state-in-effect */
import { Table, Button, Modal, Input, Space, Tag, message } from "antd";
import { useEffect, useState } from "react";
import {
  getChecklistTemplates,
  createChecklistTemplate,
  updateChecklistTemplate,
  toggleChecklistTemplate,
  deleteChecklistTemplate,
} from "../api/checklistTemplate.api";

export default function ChecklistTemplates() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    items: "",
  });

  const load = async () => {
    const res = await getChecklistTemplates();
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    const items = Array.from(
      new Set(
        form.items
          .split("\n")
          .map((i) => i.trim())
          .filter(Boolean)
      )
    ).map((t) => ({ title: t }));

    if (!form.name || items.length === 0) {
      message.error("Name and checklist items are required");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      items,
    };

    if (editing) {
      await updateChecklistTemplate(editing, payload);
      message.success("Template updated");
    } else {
      await createChecklistTemplate(payload);
      message.success("Template created");
    }

    setOpen(false);
    setEditing(null);
    setForm({ name: "", description: "", items: "" });
    load();
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Create Template
      </Button>

      <Table
        rowKey="_id"
        dataSource={data}
        style={{ marginTop: 16 }}
        columns={[
          { title: "Name", dataIndex: "name" },
          {
            title: "Items",
            render: (_, r) => r.items.length,
          },
          {
            title: "Status",
            render: (_, r) => (
              <Tag color={r.isActive ? "green" : "red"}>
                {r.isActive ? "ACTIVE" : "INACTIVE"}
              </Tag>
            ),
          },
          {
            title: "Action",
            render: (_, r) => (
              <Space>
                <Button
                  onClick={() => {
                    setEditing(r._id);
                    setForm({
                      name: r.name,
                      description: r.description,
                      items: r.items.map((i) => i.title).join("\n"),
                    });
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  onClick={() => toggleChecklistTemplate(r._id).then(load)}
                >
                  Toggle
                </Button>

                <Button
                  danger
                  onClick={() => deleteChecklistTemplate(r._id).then(load)}
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={
          editing ? "Edit Checklist Template" : "Create Checklist Template"
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onOk={submit} // 👈 ĐỔI create → submit
      >
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input.TextArea
          rows={3}
          placeholder="Description"
          style={{ marginTop: 8 }}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Input.TextArea
          rows={5}
          placeholder="Checklist items (1 dòng = 1 item)"
          style={{ marginTop: 8 }}
          value={form.items}
          onChange={(e) => setForm({ ...form, items: e.target.value })}
        />
      </Modal>
    </>
  );
}
