import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-auto p-4 sm:p-6" data-theme="fantasy">
      {/* Sticky Header to Stay Visible */}
      <div className="sticky top-0 z-10 bg-white shadow-md p-4">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 text-center">
          SARVEPALLI RADHAKRISHNAN VIDYARTHI MITRA
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center">
          KOTANANDURU MANDAL
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="mt-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div
            className="p-4 sm:p-6 bg-primary text-primary-content rounded-lg shadow-md text-center cursor-pointer hover:bg-primary-focus"
            onClick={() => navigate("/admin/products")}
          >
            <h2 className="text-base sm:text-lg font-bold">Products</h2>
            <p className="text-sm sm:text-base">Manage inventory</p>
          </div>

          <div
            className="p-4 sm:p-6 bg-secondary text-secondary-content rounded-lg shadow-md text-center cursor-pointer hover:bg-secondary-focus"
            onClick={() => navigate("/admin/user-requests")}
          >
            <h2 className="text-base sm:text-lg font-bold">User Requests</h2>
            <p className="text-sm sm:text-base">Approve or reject requests</p>
          </div>

          <div
            className="p-4 sm:p-6 bg-accent text-accent-content rounded-lg shadow-md text-center cursor-pointer hover:bg-accent-focus"
            onClick={() => navigate("/admin/user-fetch")}
          >
            <h2 className="text-base sm:text-lg font-bold">User Registration</h2>
            <p className="text-sm sm:text-base">Add new users</p>
          </div>

          <div
            className="p-4 sm:p-6 bg-neutral text-neutral-content rounded-lg shadow-md text-center cursor-pointer hover:bg-neutral-focus"
            onClick={() => navigate("/admin/reports/school")}
          >
            <h2 className="text-base sm:text-lg font-bold">Reports by School</h2>
            <p className="text-sm sm:text-base">View reports based on schools</p>
          </div>

          <div
            className="p-4 sm:p-6 bg-warning text-warning-content rounded-lg shadow-md text-center cursor-pointer hover:bg-warning-focus"
            onClick={() => navigate("/admin/reports/stock")}
          >
            <h2 className="text-base sm:text-lg font-bold">Stock Reports</h2>
            <p className="text-sm sm:text-base">View reports of Stock</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;