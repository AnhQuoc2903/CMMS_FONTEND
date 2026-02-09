import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import WorkOrders from "./pages/WorkOrders";
import WorkOrderDetail from "./pages/WorkOrderDetail";
import Assets from "./pages/Assets";
import Inventory from "./pages/Inventory";
import TenantRequest from "./pages/TenantRequest";
import ProtectedRoute from "./auth/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AssetDetail from "./pages/AssetDetail";
import Technicians from "./pages/Technicians";
import TenantRequestForm from "./pages/TenantRequestForm";
import ChecklistTemplates from "./pages/ChecklistTemplates";
import InventoryHistory from "./pages/InventoryHistory";
import MaintenancePlans from "./pages/MaintenancePlans";
import SLADashboard from "./pages/SLADashboard";
import SLATechnicianRanking from "./pages/SLATechnicianRanking";
import { ROLES } from "./constants/roles";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotificationsPage from "./pages/Notifications";
import Dashboard from "./pages/Dashboard";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/request" element={<TenantRequestForm />} />

        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WorkOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/work-orders"
            element={
              <ProtectedRoute>
                <WorkOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/work-orders/:id"
            element={
              <ProtectedRoute>
                <WorkOrderDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assets/:id"
            element={
              <ProtectedRoute>
                <AssetDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technicians"
            element={
              <ProtectedRoute
                roles={[ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER]}
              >
                <Technicians />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checklist-templates"
            element={
              <ProtectedRoute
                roles={[ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER]}
              >
                <ChecklistTemplates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant-requests"
            element={
              <ProtectedRoute
                roles={[
                  ROLES.SUPER_ADMIN,
                  ROLES.BUILDING_MANAGER,
                  ROLES.MSP_SUPERVISOR,
                ]}
              >
                <TenantRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory-history"
            element={
              <ProtectedRoute
                roles={[ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER]}
              >
                <InventoryHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance-plans"
            element={
              <ProtectedRoute
                roles={[ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER]}
              >
                <MaintenancePlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/sla"
            element={
              <ProtectedRoute
                roles={[ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER]}
              >
                <SLADashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sla/technicians"
            element={
              <ProtectedRoute
                roles={[ROLES.SUPER_ADMIN, ROLES.BUILDING_MANAGER]}
              >
                <SLATechnicianRanking />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
