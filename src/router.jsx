import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import WorkOrders from "./pages/WorkOrders";
import WorkOrderDetail from "./pages/WorkOrderDetail";
import Assets from "./pages/Assets";
import Inventory from "./pages/Inventory";
import TenantRequest from "./pages/TenantRequest";
import ProtectedRoute from "./auth/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AssetDetail from "./pages/AssetDetail"; // ✅ FIX
import Technicians from "./pages/Technicians";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/tenant" element={<TenantRequest />} />

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WorkOrders />
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
              <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                <Technicians />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
