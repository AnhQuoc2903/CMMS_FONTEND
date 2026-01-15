import { Modal, Form, Input, Select, DatePicker, message } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  createMaintenancePlan,
  updateMaintenancePlan,
} from "../api/maintenancePlan.api";

export default function MaintenancePlanModal({
  open,
  editing,
  assets,
  templates,
  onClose,
  onSaved,
}) {
  const [form] = Form.useForm();
  const isEdit = !!editing;

  /* ===== SET FORM WHEN EDIT ===== */
  useEffect(() => {
    if (editing && open) {
      form.setFieldsValue({
        name: editing.name,
        frequency: editing.frequency,
        assets: editing.assets?.map((a) => (typeof a === "string" ? a : a._id)),
        checklistTemplate:
          typeof editing.checklistTemplate === "string"
            ? editing.checklistTemplate
            : editing.checklistTemplate?._id,
        nextRunAt: dayjs(editing.nextRunAt),
      });
    }

    if (!editing && open) {
      form.resetFields();
    }
  }, [editing, open]);

  /* ===== SUBMIT ===== */
  const submit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        nextRunAt: values.nextRunAt.toISOString(),
      };

      if (isEdit) {
        await updateMaintenancePlan(editing._id, payload);
        message.success("Maintenance plan updated");
      } else {
        await createMaintenancePlan(payload);
        message.success("Maintenance plan created");
      }

      onClose();
      onSaved();
    } catch (e) {
      message.error(e?.response?.data?.message || "Save failed");
    }
  };

  /* ===== ONLY AVAILABLE ASSETS ===== */
  const selectedAssetIds =
    editing?.assets?.map((a) => (typeof a === "string" ? a : a._id)) || [];

  // Assets đang được plan dùng (kể cả IN_USE / MAINTENANCE)
  const planAssets = assets.filter((a) => selectedAssetIds.includes(a._id));

  // Assets AVAILABLE
  const availableAssets = assets.filter((a) => a.status === "AVAILABLE");

  // ✅ MERGE: AVAILABLE + assets của plan
  const selectableAssets = [
    ...availableAssets,
    ...planAssets.filter((a) => !availableAssets.find((x) => x._id === a._id)),
  ];

  return (
    <Modal
      title={isEdit ? "Edit Maintenance Plan" : "Create Maintenance Plan"}
      open={open}
      onCancel={onClose}
      onOk={submit}
      okText={isEdit ? "Save" : "Create"}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Plan Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="frequency"
          label="Frequency"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="DAILY">Daily</Select.Option>
            <Select.Option value="WEEKLY">Weekly</Select.Option>
            <Select.Option value="MONTHLY">Monthly</Select.Option>
          </Select>
        </Form.Item>

        {/* ✅ ASSETS – AVAILABLE ONLY */}
        <Form.Item name="assets" label="Assets" rules={[{ required: true }]}>
          <Select mode="multiple" placeholder="Select assets">
            {selectableAssets.map((a) => (
              <Select.Option
                key={a._id}
                value={a._id}
                disabled={
                  a.status !== "AVAILABLE" && !selectedAssetIds.includes(a._id)
                }
              >
                {a.name} ({a.code}) – {a.status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="checklistTemplate"
          label="Checklist Template"
          rules={[{ required: true }]}
        >
          <Select>
            {templates.map((t) => (
              <Select.Option key={t._id} value={t._id}>
                {t.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="nextRunAt"
          label="Next Run Date"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
