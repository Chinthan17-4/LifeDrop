import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import RecipientDashboard from "./pages/RecipientDashboard";
import FindDonors from "./pages/FindDonors";
import DonorDetails from "./pages/DonorDetails";
import CreateRequest from "./pages/CreateRequest";
import MyRequests from "./pages/MyRequests";
import Notifications from "./pages/Notifications";
import DonorMap from "./pages/DonorMap";
import Chatbot from "./pages/Chatbot";

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "donor" ? "/donor/dashboard" : "/recipient/dashboard"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/find-donors" element={<FindDonors />} />
              <Route path="/donor/:id" element={<DonorDetails />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated */}
            <Route element={<AppLayout />}>
              <Route path="/donor/dashboard" element={<DonorDashboard />} />
              <Route path="/recipient/dashboard" element={<RecipientDashboard />} />
              <Route path="/recipient/create-request" element={<CreateRequest />} />
              <Route path="/recipient/my-requests" element={<MyRequests />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/map" element={<DonorMap />} />
            </Route>

            {/* Catch-all */}
            <Route path="/dashboard" element={<RoleRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
