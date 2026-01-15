import { Checkbox, List, Button } from "antd";
import { useEffect, useState } from "react";

export default function Checklist({ data = [], disabled, onSave }) {
  const [local, setLocal] = useState([]);

  useEffect(() => {
    setLocal(data);
  }, [data]);

  if (!local.length) return null;

  return (
    <>
      <List
        bordered
        dataSource={local}
        renderItem={(item, idx) => (
          <List.Item>
            <Checkbox
              checked={item.isDone}
              disabled={disabled}
              onChange={(e) => {
                const next = local.map((c, i) =>
                  i === idx ? { ...c, isDone: e.target.checked } : c
                );
                setLocal(next); // ✅ CHỈ UPDATE LOCAL
              }}
            >
              {item.title}
            </Checkbox>
          </List.Item>
        )}
      />

      {!disabled && (
        <Button
          type="primary"
          style={{ marginTop: 12 }}
          onClick={() => onSave?.(local)} // ✅ SAVE KHI BẤM
        >
          Save Checklist
        </Button>
      )}
    </>
  );
}
