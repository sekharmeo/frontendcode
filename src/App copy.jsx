import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminMenu from "./components/Admin/AdminMenu";
import UserMenu from "./components/UserMenu";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserDashboard from "./components/User/UserDashboard";

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col md:flex-row">
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <>
                <AdminMenu />
                <div className="flex-1 p-4 flex flex-col items-center justify-center">
                  <AdminDashboard />
                </div>
              </>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/*"
            element={
              <>
                <UserMenu />
                <div className="flex-1 p-4 flex flex-col items-center justify-center">
                  <UserDashboard />
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
