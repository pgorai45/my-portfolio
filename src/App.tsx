import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { ToastProvider } from "./context/ToastContext";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Public Pages
const Home = lazy(() => import("./pages/Home"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));
const AdminSkills = lazy(() => import("./pages/admin/AdminSkills"));
const AdminEducation = lazy(() => import("./pages/admin/AdminEducation"));
const AdminExperience = lazy(() => import("./pages/admin/AdminExperience"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminResume = lazy(() => import("./pages/admin/AdminResume"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminAppointments = lazy(() => import("./pages/admin/AdminAppointments"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
    <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
    <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">
      Loading...
    </span>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <ToastProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Portfolio Routes */}
              <Route element={<RootLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Home />} />
              </Route>

              {/* Admin Login (Unprotected) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="resume" element={<AdminResume />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;