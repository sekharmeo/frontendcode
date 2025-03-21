import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { KeyRound, Home, Eye, EyeOff } from "lucide-react";

const FetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [resetLoading, setResetLoading] = useState({});
  const [resetFields, setResetFields] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    setLoadingUsers(true);
    try {
      const response = await axios.get("https://srkvm.vercel.app/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleResetPassword = async (userId, udiseCode) => {
    if (!resetFields[userId]) return;
    setResetLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const response = await axios.post(
        `https://srkvm.vercel.app/api/auth/reset-password`,
        { udiseCode, newPassword: resetFields[userId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Password reset successfully!");
      setResetFields((prev) => ({ ...prev, [userId]: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed.");
    } finally {
      setResetLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      const response = await axios.put(
        `https://srkvm.vercel.app/api/auth/toggle-status/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user status.");
    }
  };

  return (
    <div className="min-h-screen bg-base-250 p-3">
      <div className="max-w-6xl mx-auto">
        {/* Heading without extra gap */}
        <h1 className="text-3xl font-bold text-center text-primary">
        SARVEPALLI RADHAKRISHNAN VIDYARTHI MITRA
      </h1>
      <h2 className="text-xl font-bold text-center text-primary">
        KOTANANDURU MANDAL
      </h2>
        <h1 className="text-xl font-bold text-center text-primary">All Users</h1>
        <ToastContainer />

        {loadingUsers && <p className="text-center">Loading users...</p>}

        {/* User List - 4 Cards Per Row on Large Screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {users.map((user) => (
            <div key={user._id} className="card bg-base-100 shadow-md p-4">
              <h3 className="text-lg font-semibold text-secondary">{user.schoolName}</h3>
              <p className="text-gray-600 text-xs">Udise Code: {user.udiseCode}</p>

              {/* Role & Status */}
              <div className="flex items-center justify-between mt-2">
                <span className="badge badge-primary text-xs">{user.role}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={user.isActive}
                    onChange={() => toggleUserStatus(user._id, user.isActive)}
                  />
                </div>
              </div>

              {/* Password Reset */}
              <div className="flex items-center gap-2 mt-3">
                <KeyRound
                  className="cursor-pointer text-primary"
                  size={18}
                  onClick={() => {
                    setResetFields((prev) => ({ ...prev, [user._id]: "" }));
                    setShowPassword((prev) => ({ ...prev, [user._id]: false }));
                  }}
                />
                {resetFields[user._id] !== undefined && (
                  <div className="relative w-full">
                    <input
                      type={showPassword[user._id] ? "text" : "password"}
                      placeholder="New Password"
                      className="input input-bordered w-full text-xs pr-10"
                      value={resetFields[user._id]}
                      onChange={(e) =>
                        setResetFields((prev) => ({ ...prev, [user._id]: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          [user._id]: !prev[user._id],
                        }))
                      }
                    >
                      {showPassword[user._id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleResetPassword(user._id, user.udiseCode)}
                      className="absolute inset-y-0 right-10 flex items-center text-green-600"
                      disabled={resetLoading[user._id]}
                    >
                      {resetLoading[user._id] ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "✔"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default FetchUsers;
