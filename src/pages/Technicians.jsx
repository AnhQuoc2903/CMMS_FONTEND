/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Tag, message } from "antd";
import {
  getTechnicians,
  createTechnician,
  disableTechnician,
  enableTechnician,
} from "../api/user.api";

export default function Technicians() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const res = await getTechnicians();
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (values) => {
    await createTechnician(values);
    message.success("Technician created");
    setOpen(false);
    load();
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
            render: (_, r) =>
              r.status === "ACTIVE" ? (
                <Button danger onClick={() => onDisable(r._id)}>
                  Disable
                </Button>
              ) : (
                <Button type="primary" onClick={() => onEnable(r._id)}>
                  Enable
                </Button>
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
    </>
  );
}
