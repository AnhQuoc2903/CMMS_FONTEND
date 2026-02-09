import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Input,
  Select,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAssets, deleteAsset } from "../api/asset.api";
import CreateAssetModal from "../components/CreateAssetModal";
import EditAssetModal from "../components/EditAssetModal";

export default function Assets() {
  const [data, setData] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({
    q: "",
    status: undefined,
  });

  const loadData = (filters) => {
    const params = {};

    if (filters.q && filters.q.trim() !== "") {
      params.q = filters.q.trim();
    }

    if (filters.status) {
      params.status = filters.status;
    }

    getAssets(params).then((r) => setData(r.data));
  };

  useEffect(() => {
    loadData(filters);
  }, [filters]);

  const handleDelete = async (id) => {
    await deleteAsset(id);
    message.success("Asset deleted");
    loadData();
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search name or code"
          allowClear
          style={{ width: 220 }}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              q: e.target.value || "",
            }))
          }
        />
      </Space>

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setOpenCreate(true)}>
          ➕ Add Asset
        </Button>
      </Space>

      <Table
        rowKey="_id"
        dataSource={data}
        columns={[
          {
            title: "Status",
            dataIndex: "status",
            render: (v) => {
              const color =
                v === "AVAILABLE"
                  ? "green"
                  : v === "MAINTENANCE"
                    ? "orange"
                    : "default";

              return <Tag color={color}>{v}</Tag>;
            },
          },
          {
            title: "Name",
            dataIndex: "name",
            render: (v, r) => <Link to={`/assets/${r._id}`}>{v}</Link>,
          },
          { title: "Code", dataIndex: "code" },
          { title: "Category", dataIndex: "category" },
          { title: "Location", dataIndex: "location" },
          {
            title: "Actions",
            render: (_, record) => (
              <Space>
                <Button
                  size="small"
                  onClick={() => {
                    setSelected(record);
                    setOpenEdit(true);
                  }}
                >
                  Edit
                </Button>

                <Popconfirm
                  title="Delete asset?"
                  onConfirm={() => handleDelete(record._id)}
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

      <CreateAssetModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={loadData}
      />

      <EditAssetModal
        open={openEdit}
        asset={selected}
        onClose={() => setOpenEdit(false)}
        onUpdated={loadData}
      />
    </>
  );
}
