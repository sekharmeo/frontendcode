import React, { useEffect, useState } from "react";
import axios from "axios";
import { Send, UserCircle, FileText } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import UserDetails from "./UserDetails"; // Import UserDetails

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [requestInputs, setRequestInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchProducts();
  }, []);

  const fetchCurrentUser = async () => {
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://srkvm.vercel.app/api/auth/products");
      const visibleProducts = response.data.filter(product => product.visibility !== false);
      setProducts(visibleProducts);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRequestInput = (productId) => {
    setExpandedCard((prev) => (prev === productId ? null : productId));
    setRequestInputs((prev) => ({
      ...prev,
      [productId]: prev[productId] === undefined ? "" : undefined,
    }));
  };

  const handleRequestChange = (productId, value) => {
    setRequestInputs((prev) => ({ ...prev, [productId]: value }));
  };

  const handleRequestSubmit = async (productId) => {
    const requestedQuantity = requestInputs[productId];
    if (!requestedQuantity || isNaN(requestedQuantity) || requestedQuantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://srkvm.vercel.app/requests",
        { productId, requestedQuantity: parseInt(requestedQuantity) },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      toast.success(response.data.message || "Request sent successfully!");
      setExpandedCard(null);
      setRequestInputs((prev) => ({ ...prev, [productId]: undefined }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="w-full md:w-4/5 mx-auto p-4 min-h-screen flex flex-col">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
  
      {/* Sticky Header & User Details */}
      <div className="sticky top-0 bg-white z-50 shadow-md p-4">
        <h1 className="text-3xl font-bold text-center text-primary">User Dashboard</h1>
        <div className="mt-2">
          <UserDetails user={user} />
        </div>
      </div>
      {/* Floating Profile & Reports Buttons */}
        
      {/* Loading and Error Handling */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-infinity loading-md"></span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-4">
          {products.map((product) => (
            <div
              key={product._id}
              className={`bg-base-100 border border-base-300 shadow-lg rounded-2xl p-5 transition-all duration-300 ${
                expandedCard === product._id ? "h-auto" : "h-[150px]"
              }`}
            >
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">Quantity: {product.quantity}</p>
  
              <button
                onClick={() => toggleRequestInput(product._id)}
                className="mt-3 text-primary font-medium hover:text-primary-focus transition"
              >
                {expandedCard === product._id ? "Close Request" : "Send Request"}
              </button>
  
              {expandedCard === product._id && (
                <div className="mt-3 flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={requestInputs[product._id]}
                    onChange={(e) => handleRequestChange(product._id, e.target.value)}
                    className="input input-bordered flex-grow px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => handleRequestSubmit(product._id)}
                    className={`btn btn-primary ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-focus"
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
