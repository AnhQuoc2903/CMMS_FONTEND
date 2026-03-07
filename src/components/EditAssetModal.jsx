import { Modal, Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";
import { updateAsset } from "../api/asset.api";
import { getAssetGroups } from "../api/assetGroup.api";

export default function EditAssetModal({ open, asset, onClose, onUpdated }) {
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getAssetGroups().then((r) => setGroups(r.data));
  }, []);

  useEffect(() => {
    if (asset) {
      form.setFieldsValue({
        name: asset.name,
        code: asset.code,
        group: asset.group?._id || asset.group || undefined,
        location: asset.location,
      });
    }
  }, [asset, form]);

  const handleSubmit = async (values) => {
    try {
      await updateAsset(asset._id, values);

      message.success("Asset updated");
      onUpdated?.();
      onClose?.();
    } catch (err) {
      message.error(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <Modal
      title="Edit Asset"
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      okText="Save"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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

        <Form.Item name="group" label="Asset Group">
          <Select
            allowClear
            placeholder="Select asset group"
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
