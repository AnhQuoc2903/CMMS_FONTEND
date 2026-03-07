import { Modal, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { createAsset } from "../api/asset.api";
import { getAssetGroups } from "../api/assetGroup.api";

export default function CreateAssetModal({ open, onClose, onCreated }) {
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getAssetGroups().then((r) => setGroups(r.data));
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await createAsset(values);

      message.success("Asset created");

      form.resetFields();
      onCreated?.();
      onClose?.();
    } catch (err) {
      message.error(err?.response?.data?.message || "Create asset failed");
    }
  };

  return (
    <Modal
      title="Create Asset"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="code"
          label="Code"
          rules={[{ required: true, message: "Please enter code" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="group" label="Asset Group">
          <Select
            options={groups.map((g) => ({
              label: g.name,
              value: g._id,
            }))}
          />
        </Form.Item>

        <Form.Item name="location" label="Location">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
