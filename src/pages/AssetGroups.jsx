import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  getAssetGroups,
  createAssetGroup,
  updateAssetGroup,
  deleteAssetGroup,
} from "../api/assetGroup.api";

export default function AssetGroups() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = async () => {
    const res = await getAssetGroups();
    setData(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);

    form.setFieldsValue({
      name: record.name,
      description: record.description,
    });

    setOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();

    if (editing) {
      await updateAssetGroup(editing._id, values);
      message.success("Asset group updated");
    } else {
      await createAssetGroup(values);
      message.success("Asset group created");
    }

    form.resetFields();
    setOpen(false);
    setEditing(null);

    load();
  };

  const remove = async (id) => {
    await deleteAssetGroup(id);
    message.success("Asset group deleted");
    load();
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>
          Add Asset Group
        </Button>
      </Space>

      <Table
        rowKey="_id"
        dataSource={data}
        columns={[
          {
            title: "Group Name",
            dataIndex: "name",
          },
          {
            title: "Description",
            dataIndex: "description",
          },
          {
            title: "Actions",
            render: (_, record) => (
              <Space>
                <Button size="small" onClick={() => openEdit(record)}>
                  Edit
                </Button>

                <Popconfirm
                  title="Delete this group?"
                  onConfirm={() => remove(record._id)}
                >
                  <Button danger size="small">
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? "Edit Asset Group" : "Create Asset Group"}
        open={open}
        onOk={submit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true, message: "Enter group name" }]}
          >
            <Input placeholder="Example: Elevator" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input placeholder="Example: Elevator system equipment" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
