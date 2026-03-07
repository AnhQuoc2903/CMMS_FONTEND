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
  Select,
} from "antd";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getInventory,
  createSparePart,
  updateSparePart,
  disableSparePart,
  enableSparePart,
  stockInSparePart,
} from "../api/inventory.api";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import LowStockAlert from "../components/LowStockAlert";
import SparePartTree from "../components/SparePartTree";
import { getAssets } from "../api/asset.api";

export default function Inventory() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [assets, setAssets] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const [openStockIn, setOpenStockIn] = useState(false);
  const [stockInPart, setStockInPart] = useState(null);
  const [stockInQty, setStockInQty] = useState(1);

  const [reloadLowStock, setReloadLowStock] = useState(0);

  const load = async () => {
    const res = await getInventory();
    setData(res.data);
    setReloadLowStock((x) => x + 1);
  };

  useEffect(() => {
    load();
    getAssets().then((r) => setAssets(r.data));
  }, []);

  const submit = async () => {
    const values = await form.validateFields();

    if (editing) {
      await updateSparePart(editing._id, values);
      message.success("Updated");
    } else {
      await createSparePart(values);
      message.success("Created");
    }

    setOpen(false);
    setEditing(null);
    form.resetFields();
    load();
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
      minStock: record.minStock,
      inventoryMethod: record.inventoryMethod,
      specs: record.specs?.length ? record.specs : [],
      parentPart: record.parentPart?._id || record.parentPart || null,
      compatibleAssets: record.compatibleAssets || [],
    });

    setOpen(true);
  };

  return (
    <>
      <LowStockAlert reload={reloadLowStock} />

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>
          Add Spare Part
        </Button>
      </Space>

      <Table
        rowKey="_id"
        dataSource={data}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "SKU", dataIndex: "sku" },
          { title: "Total", dataIndex: "quantity" },
          { title: "Min Stock", dataIndex: "minStock" },

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
                <span style={{ color: "red" }}>{available} Low</span>
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
                <Button
                  size="small"
                  onClick={() => navigate(`/inventory/${r._id}`)}
                >
                  Detail
                </Button>

                <Button size="small" onClick={() => openEdit(r)}>
                  Edit
                </Button>

                <Button
                  size="small"
                  type="primary"
                  disabled={r.status !== "ACTIVE"}
                  onClick={() => {
                    setStockInPart(r);
                    setOpenStockIn(true);
                  }}
                >
                  Stock In
                </Button>

                {r.status === "ACTIVE" ? (
                  <Popconfirm
                    title="Disable?"
                    onConfirm={async () => {
                      await disableSparePart(r._id);
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

      <SparePartTree />

      <Modal
        title={editing ? "Edit Spare Part" : "Create Spare Part"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>

          <Form.Item name="sku" label="SKU">
            <Input />
          </Form.Item>

          <Form.Item name="minStock" label="Min Stock">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="inventoryMethod"
            label="Inventory Method"
            initialValue="FIFO"
          >
            <Select>
              <Select.Option value="FIFO">FIFO</Select.Option>
              <Select.Option value="LIFO">LIFO</Select.Option>
            </Select>
          </Form.Item>

          <Form.List name="specs">
            {(fields, { add, remove }) => (
              <>
                <label>Technical Specs</label>

                {fields.map(({ key, name }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }}>
                    <Form.Item name={[name, "key"]}>
                      <Input placeholder="Key (ex: Length)" />
                    </Form.Item>

                    <Form.Item name={[name, "value"]}>
                      <Input placeholder="Value (ex: 50)" />
                    </Form.Item>

                    <Form.Item name={[name, "unit"]}>
                      <Input placeholder="Unit (ex: m)" />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add Spec
                </Button>
              </>
            )}
          </Form.List>

          {!editing && (
            <Form.Item name="quantity" label="Quantity">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          )}

          <Form.Item name="parentPart" label="Parent Part">
            <Select allowClear placeholder="Select parent part">
              {data.map((p) => (
                <Select.Option key={p._id} value={p._id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="compatibleAssets" label="Compatible Assets">
            <Select mode="multiple" placeholder="Select compatible assets">
              {assets.map((a) => (
                <Select.Option key={a._id} value={a._id}>
                  {a.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Stock In - ${stockInPart?.name}`}
        open={openStockIn}
        onCancel={() => setOpenStockIn(false)}
        onOk={async () => {
          await stockInSparePart(stockInPart._id, {
            quantity: stockInQty,
          });

          setOpenStockIn(false);
          load();
        }}
      >
        <InputNumber
          min={1}
          value={stockInQty}
          onChange={setStockInQty}
          style={{ width: "100%" }}
        />
      </Modal>
    </>
  );
}
