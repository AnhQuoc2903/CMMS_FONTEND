export const can = (action, status, role) => {
  const map = {
    submit:
      ["ADMIN", "MANAGER"].includes(role) &&
      ["OPEN", "REJECTED"].includes(status),

    approve:
      ["ADMIN", "MANAGER"].includes(role) && status === "PENDING_APPROVAL",

    reject:
      ["ADMIN", "MANAGER"].includes(role) && status === "PENDING_APPROVAL",

    assign:
      ["ADMIN", "MANAGER"].includes(role) &&
      ["APPROVED", "ASSIGNED"].includes(status),

    start: role === "TECHNICIAN" && status === "ASSIGNED",

    work: role === "TECHNICIAN" && status === "IN_PROGRESS",

    useInventory: role === "TECHNICIAN" && status === "IN_PROGRESS",

    review: role === "MANAGER" && status === "COMPLETED",

    reviewReject: role === "MANAGER" && status === "REVIEWED",

    verify: role === "ADMIN" && status === "REVIEWED",

    verifyReject: role === "ADMIN" && status === "VERIFIED",

    close: ["ADMIN", "MANAGER"].includes(role) && status === "VERIFIED",

    editPriority:
      ["ADMIN", "MANAGER"].includes(role) &&
      ["OPEN", "PENDING_APPROVAL", "APPROVED"].includes(status),
  };

  return !!map[action];
};
