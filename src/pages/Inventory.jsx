/* eslint-disable react-hooks/set-state-in-effect */
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Tag,
  Popconfirm,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  getInventory,
  createSparePart,
  updateSparePart,
  disableSparePart,
  enableSparePart,
  stockInSparePart,
} from "../api/inventory.api";
import LowStockAlert from "../components/LowStockAlert";

export default function Inventory() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const [openStockIn, setOpenStockIn] = useState(false);
  const [stockInPart, setStockInPart] = useState(null);
  const [stockInQty, setStockInQty] = useState(null);

  const [reloadLowStock, setReloadLowStock] = useState(0);

  const load = async () => {
    const res = await getInventory();
    setData(res.data);
    setReloadLowStock((x) => x + 1);
  };

  useEffect(() => {
    load();
  }, []);

  /* ===== CREATE / UPDATE ===== */
  const submit = async () => {
    try {
      const values = await form.validateFields();

      if (editing) {
        await updateSparePart(editing._id, values);
        message.success("Spare part updated");
      } else {
        await createSparePart(values);
        message.success("Spare part created");
      }

      setOpen(false);
      setEditing(null);
      form.resetFields();
      load();
    } catch (e) {
      message.error(e?.response?.data?.message || "Save failed");
    }
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      sku: record.sku,
      quantity: record.quantity,
      status: record.status,
    });
    setOpen(true);
  };

  return (
    <>
      <LowStockAlert reload={reloadLowStock} />

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>
          ➕ Add Spare Part
        </Button>
      </Space>

      <Table
        rowKey="_id"
        dataSource={data}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "SKU", dataIndex: "sku" },
          {
            title: "Total",
            dataIndex: "quantity",
          },
          {
            title: "Reserved",
            dataIndex: "reservedQuantity",
            render: (v) => v || 0,
          },
          {
            title: "Available",
            render: (_, r) => {
              const available = r.quantity - (r.reservedQuantity || 0);
              return available <= r.minStock ? (
                <span style={{ color: "red", fontWeight: 600 }}>
                  {available} ⚠ Low
                </span>
              ) : (
                <b>{available}</b>
              );
            },
          },

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
              <Space>
                <Button size="small" onClick={() => openEdit(r)}>
                  Edit
                </Button>

                <Button
                  size="small"
                  type="primary"
                  disabled={r.status !== "ACTIVE"}
                  onClick={() => {
                    setStockInPart(r);
                    setStockInQty(1);
                    setOpenStockIn(true);
                  }}
                >
                  Stock In
                </Button>

                {r.status === "ACTIVE" ? (
                  <Popconfirm
                    title="Disable this spare part?"
                    onConfirm={async () => {
                      await disableSparePart(r._id);
                      message.success("Spare part disabled");
                      load();
                    }}
                  >
                    <Button danger size="small">
                      Disable
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    type="primary"
                    size="small"
                    onClick={async () => {
                      await enableSparePart(r._id);
                      message.success("Spare part enabled");
                      load();
                    }}
                  >
                    Enable
                  </Button>
                )}
              </Space>
            ),
          },
        ]}
      />

      {/* ===== MODAL ===== */}
      <Modal
        title={editing ? "Edit Spare Part" : "Create Spare Part"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onOk={submit}
        okText={editing ? "Save" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="sku" label="SKU">
            <Input />
          </Form.Item>

          {/* CHỈ HIỆN QUANTITY KHI CREATE */}
          {!editing && (
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: "Quantity is required" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          )}

          {editing && (
            <Form.Item label="Status">
              <Tag color={editing.status === "ACTIVE" ? "green" : "red"}>
                {editing.status}
              </Tag>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* ===== STOCK IN MODAL ===== */}
      <Modal
        title={`Stock In - ${stockInPart?.name || ""}`}
        open={openStockIn}
        onCancel={() => setOpenStockIn(false)}
        onOk={async () => {
          try {
            await stockInSparePart(stockInPart._id, {
              quantity: stockInQty,
              note: "Manual stock in",
            });

            message.success("Stock added");
            setOpenStockIn(false);
            load();
          } catch (e) {
            message.error(e?.response?.data?.message || "Stock in failed");
          }
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Quantity">
            <InputNumber
              min={1}
              value={stockInQty}
              onChange={setStockInQty}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
