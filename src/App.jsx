import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import AdminMenu from "./components/Admin/AdminMenu";
import UserMenu from "./components/User/UserMenu";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserDashboard from "./components/User/UserDashboard";
import ProductPage from "./components/Admin/ProductPage";
import UserProfile from "./components/User/UserProfile";
import UserRequests from "./components/Admin/UserRequests";
import FetchUsers from "./components/Admin/FetchUsers";
import ReportsBySchool from "./components/Admin/ReportsBySchool";
import StockReports from "./components/Admin/StockReports";
import UserReports from "./components/User/UserReports";

// 🔐 Protected Route Component
const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <div className="text-center text-red-500 mt-10">Unauthorized Access!</div>;
  }

  return children;
};

// Layout with Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const showAdminMenu = location.pathname.startsWith("/admin");
  const showUserMenu = location.pathname.startsWith("/user");

  return (
    <div className="h-screen flex">
      {showAdminMenu && <AdminMenu />}
      {showUserMenu && <UserMenu />}
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
};



// AppContent Component
const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin/*" element={<Layout><ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute></Layout>} />
      <Route path="/admin/products" element={<Layout><ProtectedRoute role="admin"><ProductPage /></ProtectedRoute></Layout>} />
      <Route path="/admin/user-fetch" element={<Layout><ProtectedRoute role="admin"><FetchUsers /></ProtectedRoute></Layout>} />
      <Route path="/admin/user-requests" element={<Layout><ProtectedRoute role="admin"><UserRequests /></ProtectedRoute></Layout>} />
      <Route path="/admin/reports/school" element={<Layout><ProtectedRoute role="admin"><ReportsBySchool /></ProtectedRoute></Layout>} />
      <Route path="/admin/reports/stock" element={<Layout><ProtectedRoute role="admin"><StockReports /></ProtectedRoute></Layout>} />
      
      {/* Protected User Routes */}
      <Route path="/user/*" element={<Layout><ProtectedRoute role="user"><UserDashboard /></ProtectedRoute></Layout>} />
      <Route path="/user-profile" element={<Layout><ProtectedRoute role="user"><UserProfile /></ProtectedRoute></Layout>} />
      <Route path="/user-reports" element={<Layout><ProtectedRoute role="user"><UserReports /></ProtectedRoute></Layout>} />
      
      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;