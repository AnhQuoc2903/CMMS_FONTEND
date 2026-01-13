import { Checkbox, List, Empty } from "antd";

export default function Checklist({ data = [], disabled, onSave }) {
  if (!data.length) return null;

  return (
    <List
      bordered
      dataSource={data}
      renderItem={(item, idx) => (
        <List.Item>
          <Checkbox
            checked={item.isDone}
            disabled={disabled}
            onChange={(e) => {
              if (!onSave) return;

              const next = data.map((c, i) =>
                i === idx ? { ...c, isDone: e.target.checked } : c
              );

              onSave(next); // 👈 BẮT BUỘC là array
            }}
          >
            {item.title}
          </Checkbox>
        </List.Item>
      )}
    />
  );
}
