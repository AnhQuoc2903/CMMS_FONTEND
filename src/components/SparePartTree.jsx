import { Tree, Card } from "antd";
import { useEffect, useState } from "react";
import { getPartTree } from "../api/inventory.api";

export default function SparePartTree() {
  const [tree, setTree] = useState([]);

  useEffect(() => {
    const format = (data = []) =>
      data.map((i) => ({
        title: i.name,
        key: i._id,
        children: format(i.children),
      }));

    const load = async () => {
      const res = await getPartTree();
      setTree(format(res.data));
    };

    load();
  }, []);

  return (
    <Card title="Spare Part Hierarchy">
      <Tree treeData={tree} />
    </Card>
  );
}
