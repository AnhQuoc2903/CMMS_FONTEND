import { Modal, Input, message } from "antd";

// Review Modal
export const ReviewModal = ({ open, onClose, onConfirm, note, setNote }) => {
  return (
    <Modal
      title="Review Work Order"
      open={open}
      onCancel={onClose}
      onOk={async () => {
        if (!note.trim()) {
          return message.error("Review note is required");
        }
        await onConfirm(note);
      }}
      okText="Confirm Review"
    >
      <Input.TextArea
        rows={4}
        placeholder="Enter review note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </Modal>
  );
};

// Reject Modal
export const RejectModal = ({
  open,
  onClose,
  onConfirm,
  reason,
  setReason,
  type,
}) => {
  const title =
    type === "review"
      ? "Reject Review"
      : type === "verify"
      ? "Reject Verification"
      : "Reject Work Order";

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      onOk={async () => {
        if (!reason.trim()) {
          return message.error("Reject reason is required");
        }
        await onConfirm(reason);
      }}
      okText="Confirm Reject"
      okButtonProps={{ danger: true }}
    >
      <Input.TextArea
        rows={4}
        placeholder="Enter reject reason..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  );
};

// Hold Modal
export const HoldModal = ({ open, onClose, onConfirm, reason, setReason }) => {
  return (
    <Modal
      title="Put Work Order On Hold"
      open={open}
      onOk={async () => {
        if (!reason.trim()) {
          return message.error("Hold reason is required");
        }
        await onConfirm(reason);
      }}
      onCancel={onClose}
    >
      <Input.TextArea
        rows={3}
        placeholder="Reason..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  );
};

// Cancel Modal
export const CancelModal = ({
  open,
  onClose,
  onConfirm,
  reason,
  setReason,
}) => {
  return (
    <Modal
      title="Cancel Work Order"
      open={open}
      okButtonProps={{ danger: true }}
      onOk={async () => {
        if (!reason.trim()) {
          return message.error("Cancel reason is required");
        }
        await onConfirm(reason);
      }}
      onCancel={onClose}
    >
      <Input.TextArea
        rows={3}
        placeholder="Reason..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  );
};
