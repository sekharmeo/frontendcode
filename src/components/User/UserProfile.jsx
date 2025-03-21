import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Home } from "lucide-react"; // Import Home Icon
import { useNavigate } from "react-router-dom"; // Import useNavigate
import UserDetails from "./UserDetails";
const UserProfile = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchProductHistory();
  }, []);

  // Fetch User Profile
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://srkvm.vercel.app/api/auth/current-user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch Product Request History
  const fetchProductHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://srkvm.vercel.app/requests/user-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(response.data.requests);
    } catch (error) {
      toast.error("Failed to fetch product history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-4/5 mx-auto p-4 min-h-screen flex flex-col">
      {/* Floating Home Button */}
        
      {/* Sticky Header & User Details */}
      <div className="sticky top-0 bg-white z-50 shadow-md p-4">
        <h1 className="text-3xl font-bold text-center text-primary">User Profile</h1>
        <div className="mt-2">
          {user ? <UserDetails user={user} /> : <p className="text-center text-gray-500">Loading user data...</p>}
        </div>
      </div>
  
      {/* Product Request History Section */}
      <div className="flex-1 overflow-y-auto mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Product Request History</h2>
  
        {loading ? (
          <p className="text-center text-gray-500">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-500">No requests found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {history.map((request) => (
              <div
                key={request._id}
                className="bg-base-100 border border-base-300 shadow-lg rounded-2xl p-5 transition-all duration-300 hover:shadow-xl"
              >
                <h3 className="text-lg font-bold text-primary">
                  {request.productId ? request.productId.name : "Unknown Product"}
                </h3>
                <p className="text-gray-700"><strong>Quantity:</strong> {request.requestedQuantity}</p>
                <p className="text-gray-700"><strong>Status:</strong> {request.status}</p>
                <p className="text-gray-700"><strong>Return Status:</strong> {request.returnStatus}</p>
                <p className="text-sm text-gray-500">
                  <strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default UserProfile;
