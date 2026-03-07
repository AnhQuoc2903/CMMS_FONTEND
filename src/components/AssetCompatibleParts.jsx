import { Card, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getPartsForAsset } from "../api/inventory.api";

export default function AssetCompatibleParts({ assetId }) {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    if (!assetId) return;

    const load = async () => {
      const res = await getPartsForAsset(assetId);
      setParts(res.data);
    };

    load();
  }, [assetId]);
  return (
    <Card title="Compatible Spare Parts">
      <Table
        rowKey="_id"
        dataSource={parts}
        pagination={false}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "SKU", dataIndex: "sku" },
          {
            title: "Stock",
            render: (_, r) => {
              const available = r.quantity - (r.reservedQuantity || 0);

              return available > 0 ? (
                <Tag color="green">{available}</Tag>
              ) : (
                <Tag color="red">Out of stock</Tag>
              );
            },
          },
        ]}
      />
    </Card>
  );
}
