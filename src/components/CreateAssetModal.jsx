import { Modal, Form, Input, message } from "antd";
import { createAsset } from "../api/asset.api";

export default function CreateAssetModal({ open, onClose, onCreated }) {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createAsset(values);

      message.success("Asset created");
      form.resetFields();
      onCreated(); // reload table
      onClose(); // close modal
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      title="Create Asset"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Create"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Code is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Input />
        </Form.Item>

        <Form.Item label="Location" name="location">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
