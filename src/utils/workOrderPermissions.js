export const can = (action, status, role) => {
  const map = {
    submit: role === "ADMIN" && ["OPEN", "REJECTED"].includes(status),
    approve:
      ["ADMIN", "MANAGER"].includes(role) && status === "PENDING_APPROVAL",
    reject:
      ["ADMIN", "MANAGER"].includes(role) && status === "PENDING_APPROVAL",
    assign: ["ADMIN", "MANAGER"].includes(role) && status === "APPROVED",
    start: role === "TECHNICIAN" && status === "ASSIGNED",
    work: role === "TECHNICIAN" && status === "IN_PROGRESS",
    close: ["ADMIN", "MANAGER"].includes(role) && ["VERIFIED"].includes(status),

    review: role === "MANAGER" && status === "COMPLETED",
    reviewReject: role === "MANAGER" && status === "REVIEWED",

    verify: role === "ADMIN" && status === "REVIEWED",
    verifyReject: role === "ADMIN" && status === "VERIFIED",

    editPriority:
      ["ADMIN", "MANAGER"].includes(role) &&
      ["OPEN", "PENDING_APPROVAL", "APPROVED"].includes(status),
  };

  return !!map[action];
};
