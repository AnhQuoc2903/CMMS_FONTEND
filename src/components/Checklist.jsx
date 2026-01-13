import { Checkbox, Button } from "antd";
import { useState } from "react";

export default function Checklist({ data = [], onSave }) {
  const [items, setItems] = useState(data);

  const toggle = (i) => {
    const c = [...items];
    c[i].isDone = !c[i].isDone;
    setItems(c);
  };

  return (
    <>
      {items.map((c, i) => (
        <Checkbox key={i} checked={c.isDone} onChange={() => toggle(i)}>
          {c.title}
        </Checkbox>
      ))}

      <Button className="mt-2" type="primary" onClick={() => onSave(items)}>
        Save Checklist
      </Button>
    </>
  );
}
