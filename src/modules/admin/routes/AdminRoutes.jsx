import { Route, Routes } from "react-router-dom";
import Dashboard from "../page/DashBoard";
import ManageBooks from "../page/ManageBook";
import AdminLayout from "../layout/AdminLayout";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-books"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageBooks />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AdminLayout>
  );
}
