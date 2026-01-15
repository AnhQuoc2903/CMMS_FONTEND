export const can = (action, status, role) => {
  switch (action) {
    case "submit":
      return (
        ["ADMIN", "MANAGER"].includes(role) &&
        ["OPEN", "REJECTED"].includes(status)
      );

    case "approve":
    case "reject":
      return (
        ["ADMIN", "MANAGER"].includes(role) && status === "PENDING_APPROVAL"
      );

    case "assign":
      return (
        ["ADMIN", "MANAGER"].includes(role) &&
        ["APPROVED", "ASSIGNED"].includes(status)
      );

    case "start":
      return role === "TECHNICIAN" && status === "ASSIGNED";

    case "work":
    case "useInventory":
      return role === "TECHNICIAN" && status === "IN_PROGRESS";

    case "review":
      return role === "MANAGER" && status === "COMPLETED";

    case "reviewReject":
      return role === "MANAGER" && status === "REVIEWED";

    case "verify":
      return role === "ADMIN" && status === "REVIEWED";

    case "verifyReject":
      return role === "ADMIN" && status === "VERIFIED";

    case "close":
      return ["ADMIN", "MANAGER"].includes(role) && status === "VERIFIED";

    case "editPriority":
      return (
        ["ADMIN", "MANAGER"].includes(role) &&
        ["OPEN", "PENDING_APPROVAL", "APPROVED"].includes(status)
      );

    /* ===== NEW: CANCEL / HOLD / RESUME ===== */

    case "cancel":
      return (
        ["ADMIN", "MANAGER"].includes(role) &&
        ["OPEN", "APPROVED", "ASSIGNED", "IN_PROGRESS", "ON_HOLD"].includes(
          status
        )
      );

    case "hold":
      return (
        ["ADMIN", "MANAGER", "TECHNICIAN"].includes(role) &&
        ["ASSIGNED", "IN_PROGRESS"].includes(status)
      );

    case "resume":
      return status === "ON_HOLD";

    default:
      return false;
  }
};
