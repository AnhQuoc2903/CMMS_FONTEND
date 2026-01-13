import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";
import { updateAsset } from "../api/asset.api";

export default function EditAssetModal({ open, asset, onClose, onUpdated }) {
  const [form] = Form.useForm();

  // ===== ĐỔ DATA VÀO FORM KHI CHỌN ASSET =====
  useEffect(() => {
    if (asset) {
      form.setFieldsValue({
        name: asset.name,
        code: asset.code,
        category: asset.category,
        location: asset.location,
      });
    }
  }, [asset, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await updateAsset(asset._id, values);

      message.success("Asset updated");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      title="Edit Asset"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Save"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Enter asset name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="code"
          label="Code"
          rules={[{ required: true, message: "Enter asset code" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Input />
        </Form.Item>

        <Form.Item name="location" label="Location">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
