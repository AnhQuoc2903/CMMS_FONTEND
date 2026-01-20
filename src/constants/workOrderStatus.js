export const WORK_ORDER_STATUS = {
  OPEN: { label: "Draft", color: "default", group: "DRAFT" },
  PENDING_APPROVAL: { label: "Pending", color: "gold", group: "PENDING" },
  APPROVED: { label: "Approved", color: "blue", group: "PENDING" },
  ASSIGNED: { label: "Assigned", color: "cyan", group: "ASSIGNED" },

  IN_PROGRESS: { label: "Started", color: "orange", group: "IN_PROGRESS" },
  ON_HOLD: { label: "On Hold", color: "orange", group: "IN_PROGRESS" },

  COMPLETED: { label: "Completed", color: "green", group: "DONE" },
  REVIEWED: { label: "Reviewed", color: "blue", group: "DONE" },
  VERIFIED: { label: "Verified", color: "green", group: "DONE" },
  CLOSED: { label: "Closed", color: "green", group: "DONE" },

  REJECTED: { label: "Rejected", color: "red", group: "ERROR" },
  CANCELLED: { label: "Cancelled", color: "red", group: "ERROR" },
};
