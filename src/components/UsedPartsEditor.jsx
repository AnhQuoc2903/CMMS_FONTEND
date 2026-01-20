import { Select, InputNumber, Button, Space } from "antd";

/**
 * parts: [{ part: partId, quantity }]
 * inventory: [{ _id, name, quantity, reservedQuantity, status }]
 */
export default function UsedPartsEditor({
  parts = [],
  inventory = [],
  disabled = false,
  onChange,
}) {
  /* =============================
     AVAILABLE = DB SOURCE OF TRUTH
     ============================= */
  const calcAvailable = (item) => {
    return Math.max((item.quantity || 0) - (item.reservedQuantity || 0), 0);
  };

  /* =============================
     ADD ROW
     ============================= */
  const addRow = () => {
    const availablePart = inventory.find(
      (i) => i.status === "ACTIVE" && calcAvailable(i) > 0,
    );

    if (!availablePart) return;

    onChange([
      ...parts,
      {
        part: availablePart._id,
        quantity: 1,
      },
    ]);
  };

  /* =============================
     UPDATE
     ============================= */

  const remove = (idx) => {
    onChange(parts.filter((_, i) => i !== idx));
  };

  /* =============================
     RENDER
     ============================= */
  return (
    <>
      {parts.map((p, idx) => {
        return (
          <Space key={`${p.part}-${idx}`} style={{ marginBottom: 8 }}>
            {/* ===== SELECT PART ===== */}
            {disabled ? (
              <span style={{ width: 280, display: "inline-block" }}></span>
            ) : (
              <Select
                style={{ width: 280 }}
                value={p.part}
                onChange={(value) => {
                  onChange(
                    parts.map((row, i) =>
                      i === idx ? { part: value, quantity: 1 } : row,
                    ),
                  );
                }}
              >
                {inventory.map((i) => {
                  const available = calcAvailable(i);

                  return (
                    <Select.Option
                      key={i._id}
                      value={i._id}
                      disabled={i.status !== "ACTIVE" || available <= 0}
                    >
                      {i.name} (Available: {available})
                    </Select.Option>
                  );
                })}
              </Select>
            )}

            {/* ===== QUANTITY ===== */}

            {/* ===== REMOVE ===== */}
            {!disabled && (
              <Button danger onClick={() => remove(idx)}>
                Remove
              </Button>
            )}
          </Space>
        );
      })}

      {/* ===== ADD BUTTON ===== */}
      {!disabled && (
        <Button type="dashed" onClick={addRow}>
          + Add Spare Part
        </Button>
      )}
    </>
  );
}
