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
    close: ["ADMIN", "MANAGER"].includes(role) && status === "COMPLETED",
  };

  return !!map[action];
};
