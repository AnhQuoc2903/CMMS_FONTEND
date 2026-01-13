/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Tag, message } from "antd";
import {
  getTechnicians,
  createTechnician,
  disableTechnician,
  enableTechnician,
  updateTechnician,
} from "../api/user.api";
import { getTechnicianAuditLogs } from "../api/audit.api";

export default function Technicians() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [logs, setLogs] = useState([]);
  const [openLog, setOpenLog] = useState(false);

  const load = async () => {
    const res = await getTechnicians();
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (values) => {
    try {
      await createTechnician(values);
      message.success("Technician created");
      setOpen(false);
      load();
    } catch (e) {
      message.error(e.response?.data?.message || "Create failed");
    }
  };

  const openEditModal = (record) => {
    setEditing(record);
    setOpenEdit(true);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
    });
  };

  const onEdit = async (values) => {
    try {
      await updateTechnician(editing._id, values);
      message.success("Technician updated");
      setOpenEdit(false);
      setEditing(null);
      load();
    } catch (e) {
      message.error(e.response?.data?.message || "Update failed");
    }
  };

  const onDisable = async (id) => {
    await disableTechnician(id);
    message.success("Technician disabled");
    load();
  };

  const onEnable = async (id) => {
    await enableTechnician(id);
    message.success("Technician enabled");
    load();
  };

  const openAuditLog = async (tech) => {
    const res = await getTechnicianAuditLogs(tech._id);
    setLogs(res.data);
    setOpenLog(true);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add Technician
      </Button>

      <Table
        rowKey="_id"
        dataSource={data}
        style={{ marginTop: 16 }}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          {
            title: "Status",
            dataIndex: "status",
            render: (s) => (
              <Tag color={s === "ACTIVE" ? "green" : "red"}>{s}</Tag>
            ),
          },
          {
            title: "Action",
            render: (_, r) => (
              <>
                <Button size="small" onClick={() => openAuditLog(r)}>
                  History
                </Button>
                <Button
                  size="small"
                  onClick={() => openEditModal(r)}
                  style={{ marginRight: 8 }}
                >
                  Edit
                </Button>

                {r.status === "ACTIVE" ? (
                  <Button danger size="small" onClick={() => onDisable(r._id)}>
                    Disable
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => onEnable(r._id)}
                  >
                    Enable
                  </Button>
                )}
              </>
            ),
          },
        ]}
      />

      <Modal
        title="Create Technician"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={onCreate}>
          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" required>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" required>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form>
      </Modal>
      <Modal
        title="Edit Technician"
        open={openEdit}
        onCancel={() => {
          setOpenEdit(false);
          setEditing(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onEdit}>
          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Modal>
      <Modal
        title="Audit Log"
        open={openLog}
        onCancel={() => setOpenLog(false)}
        footer={null}
      >
        <Table
          rowKey="_id"
          dataSource={logs}
          columns={[
            {
              title: "Action",
              dataIndex: "action",
              render: (v) =>
                v === "DISABLE_TECHNICIAN" ? "Disabled" : "Enabled",
            },
            {
              title: "By",
              render: (_, r) => r.actor?.name,
            },
            {
              title: "Time",
              dataIndex: "createdAt",
              render: (v) => new Date(v).toLocaleString(),
            },
          ]}
        />
      </Modal>
    </>
  );
}
