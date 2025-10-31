"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Navbar from "./components/common/Navbar/Navbar"
import Home from "./pages/Home/Home"
import AuthCallback from "./pages/AuthCallback"
import ParticipantDashboard from "./pages/ParticipantDashboard/ParticipantDashboard"
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard"
import VolunteerDashboard from "./pages/VolunteerDashboard/VolunteerDashboard"
import PublicRoadmap from "./pages/PublicRoadmap/PublicRoadmap"

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const { user } = useAuth()

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/roadmap" element={<PublicRoadmap />} />

        <Route
          path="/participant"
          element={
            <ProtectedRoute allowedRoles={["participant"]}>
              <ParticipantDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
