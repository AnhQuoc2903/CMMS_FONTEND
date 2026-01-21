import { ROLES } from "../constants/roles";

export const can = (action, status, role) => {
  switch (action) {
    /* ================= CREATE / SUBMIT ================= */
    case "submit":
      return (
        [ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER].includes(role) &&
        ["OPEN", "REJECTED"].includes(status)
      );

    /* ================= APPROVAL ================= */
    case "approve":
    case "reject":
      return (
        [ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER].includes(role) &&
        status === "PENDING_APPROVAL"
      );

    /* ================= ASSIGN ================= */
    case "assign":
      return (
        role === ROLES.SUPER_ADMIN && ["APPROVED", "ASSIGNED"].includes(status)
      );

    /* ================= TECHNICIAN FLOW ================= */
    case "start":
      return role === ROLES.TECHNICIAN && status === "ASSIGNED";

    case "work":
      return role === ROLES.TECHNICIAN && status === "IN_PROGRESS";

    case "hold":
      return role === ROLES.TECHNICIAN && status === "IN_PROGRESS";

    case "resume":
      return role === ROLES.TECHNICIAN && status === "ON_HOLD";

    /* ================= REVIEW ================= */
    case "review":
      return role === ROLES.MSP_SUPERVISOR && status === "COMPLETED";

    case "reviewReject":
      return role === ROLES.MSP_SUPERVISOR && status === "REVIEWED";

    /* ================= VERIFY ================= */
    case "verify":
      return role === ROLES.SUPER_ADMIN && status === "REVIEWED";

    case "verifyReject":
      return role === ROLES.SUPER_ADMIN && status === "VERIFIED";

    /* ================= CLOSE ================= */
    case "close":
      return (
        [ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER].includes(role) &&
        status === "VERIFIED"
      );

    /* ================= EDIT META ================= */
    case "editPriority":
      return (
        [ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER].includes(role) &&
        ["OPEN", "PENDING_APPROVAL", "APPROVED", "ASSIGNED"].includes(status)
      );

    /* ================= CANCEL ================= */
    case "cancel":
      return (
        [ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER].includes(role) &&
        ["OPEN", "PENDING_APPROVAL", "APPROVED", "ASSIGNED"].includes(status)
      );

    default:
      return false;
  }
};
