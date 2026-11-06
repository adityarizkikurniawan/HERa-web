
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "./theme/theme";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import MentorLayout from "./layouts/MentorLayout";

// Authentication
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Halaman User
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import Journaling from "./pages/Journaling";
import Community from "./pages/Community";
import MicroLMS from "./pages/MicroLMS";
import Mentorship from "./pages/Mentorship";
import PeriodTracker from "./pages/PeriodTracker";
import Counseling from "./pages/Counseling";
import Profile from "./pages/Profile";

// Halaman Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMentors from "./pages/admin/AdminMentors";
import AdminConsultations from "./pages/admin/AdminConsultations";
import AdminMicroLMS from "./pages/admin/AdminMicroLMS";
import AdminCommunity from "./pages/admin/AdminCommunity";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

// Halaman Mentor
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorProfile from "./pages/mentor/MentorProfile";
import MentorRequests from "./pages/mentor/MentorRequests";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* HALAMAN PUBLIK */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* HALAMAN USER */}
            <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/mood" element={<MoodTracker />} />
                <Route path="/journal" element={<Journaling />} />
                <Route path="/community" element={<Community />} />
                <Route path="/learning" element={<MicroLMS />} />
                <Route path="/period" element={<PeriodTracker />} />
                <Route path="/counseling" element={<Counseling />} />
                <Route path="/mentorship" element={<Mentorship />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* HALAMAN ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboard />}
                />

                <Route
                  path="/admin/users"
                  element={<AdminUsers />}
                />

                <Route
                  path="/admin/mentors"
                  element={<AdminMentors />}
                />

                <Route
                  path="/admin/konsultasi"
                  element={<AdminConsultations />}
                />

                <Route
                  path="/admin/micro-lms"
                  element={<AdminMicroLMS />}
                />

                <Route
                  path="/admin/moderasi"
                  element={<AdminCommunity />}
                />

                <Route
                  path="/admin/laporan"
                  element={<AdminReports />}
                />

                <Route
                  path="/admin/pengaturan"
                  element={<AdminSettings />}
                />
              </Route>
            </Route>


            {/* HALAMAN MENTOR */}
            <Route element={<ProtectedRoute allowedRoles={["mentor"]} />}>
              <Route element={<MentorLayout />}>
                <Route
                  path="/mentor"
                  element={<MentorDashboard />}
                />

                <Route
                  path="/mentor/profile"
                  element={<MentorProfile />}
                />

                <Route
                  path="/mentor/requests"
                  element={<MentorRequests />}
                />
              </Route>
            </Route>


          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
