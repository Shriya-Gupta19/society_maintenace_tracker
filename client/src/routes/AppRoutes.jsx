import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ResidentDashboard from "../pages/resident/ResidentDashboard";

import MyComplaints from "../pages/complaints/MyComplaints";
import CreateComplaint from "../pages/complaints/CreateComplaint";
import ComplaintDetails from "../pages/complaints/ComplaintDetails";
import ManageComplaints from "../pages/complaints/ManageComplaints";

import AdminNotices from "../pages/notices/AdminNotices";
import ResidentNotices from "../pages/notices/ResidentNotices";

import ResidentProfile from "../pages/profile/ResidentProfile";
import AdminProfile from "../pages/profile/AdminProfile";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Resident Routes */}
      <Route
        path="/resident/dashboard"
        element={
          <ProtectedRoute role="resident">
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident/complaints"
        element={
          <ProtectedRoute role="resident">
            <MyComplaints />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident/complaints/create"
        element={
          <ProtectedRoute role="resident">
            <CreateComplaint />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident/complaints/:id"
        element={
          <ProtectedRoute role="resident">
            <ComplaintDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident/notices"
        element={
          <ProtectedRoute role="resident">
            <ResidentNotices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident/profile"
        element={
          <ProtectedRoute role="resident">
            <ResidentProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute role="admin">
            <ManageComplaints />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/complaints/:id"
        element={
          <ProtectedRoute role="admin">
            <ComplaintDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/notices"
        element={
          <ProtectedRoute role="admin">
            <AdminNotices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute role="admin">
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
