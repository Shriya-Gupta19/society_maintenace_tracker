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

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ========================= */}
      {/* Resident Routes */}
      {/* ========================= */}

      <Route
        path="/resident/dashboard"
        element={
          <ProtectedRoute>
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident/complaints"
        element={
          <ProtectedRoute>
            <MyComplaints />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident/complaints/create"
        element={
          <ProtectedRoute>
            <CreateComplaint />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident/complaints/:id"
        element={
          <ProtectedRoute>
            <ComplaintDetails />
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* Admin Routes */}
      {/* ========================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute>
            <ManageComplaints />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/notices"
  element={
    <ProtectedRoute>
      <AdminNotices />
    </ProtectedRoute>
  }
/>

<Route
  path="/resident/notices"
  element={
    <ProtectedRoute>
      <ResidentNotices />
    </ProtectedRoute>
  }
/>

      {/* ========================= */}
      {/* 404 */}
      {/* ========================= */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;