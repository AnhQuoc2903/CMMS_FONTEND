import { Select, InputNumber, Button, Space } from "antd";

export default function UsedPartsEditor({
  parts,
  inventory,
  disabled,
  onChange,
}) {
  const addRow = () => {
    // 🔍 các part đã được chọn
    const selectedIds = parts.map((p) =>
      typeof p.part === "string" ? p.part : p.part?._id
    );

    // ✅ tìm part hợp lệ đầu tiên
    const availablePart = inventory.find(
      (i) =>
        i.status === "ACTIVE" && i.quantity > 0 && !selectedIds.includes(i._id)
    );

    // ❌ không còn part nào dùng được
    if (!availablePart) return;

    onChange([
      ...parts,
      {
        part: availablePart._id,
        quantity: 1,
      },
    ]);
  };

  const update = (idx, key, value) => {
    const next = parts.map((p, i) => (i === idx ? { ...p, [key]: value } : p));
    onChange(next);
  };

  const remove = (idx) => {
    onChange(parts.filter((_, i) => i !== idx));
  };

  return (
    <>
      {parts.map((p, idx) => {
        // 🔥 các part đã chọn ở dòng khác
        const selectedPartIds = parts
          .filter((_, i) => i !== idx)
          .map((x) => (typeof x.part === "string" ? x.part : x.part?._id));

        return (
          <Space key={idx} style={{ marginBottom: 8 }}>
            <Select
              style={{ width: 260 }}
              placeholder="Select spare part"
              value={typeof p.part === "string" ? p.part : p.part?._id}
              disabled={disabled}
              onChange={(value) => update(idx, "part", value)}
            >
              {inventory.map((i) => (
                <Select.Option
                  key={i._id}
                  value={i._id}
                  disabled={
                    i.status === "INACTIVE" || selectedPartIds.includes(i._id)
                  }
                >
                  {i.name} (Stock: {i.quantity})
                  {i.status === "INACTIVE" && " - INACTIVE"}
                  {selectedPartIds.includes(i._id) && " - SELECTED"}
                </Select.Option>
              ))}
            </Select>

            <InputNumber
              min={1}
              value={p.quantity}
              disabled={disabled}
              onChange={(v) => update(idx, "quantity", v)}
            />

            {!disabled && (
              <Button danger onClick={() => remove(idx)}>
                Remove
              </Button>
            )}
          </Space>
        );
      })}

      {!disabled && (
        <Button type="dashed" onClick={addRow}>
          + Add Spare Part
        </Button>
      )}
    </>
  );
}
