import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { CheckCircle, XCircle, Filter, Home } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const UserRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Pending"); // Default: Show Pending requests
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://srkvm.vercel.app/requests/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data.requests);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user requests");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    const token = localStorage.getItem("token");
    setProcessingRequestId(requestId);
    try {
      const response = await axios.put(
        "https://srkvm.vercel.app/requests",
        { requestId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const message = response.data.message || `Request marked as ${newStatus}`;
      toast.success(message);
      fetchUserRequests();
    } catch (error) {
      console.error("Error updating request:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update request status");
    } finally {
      setProcessingRequestId(null);
    }
  };

  const filteredRequests = requests.filter((request) =>
    filterStatus === "All" ? true : request.status === filterStatus
  );

  // Grouping requests by user schoolName
  const groupedRequests = filteredRequests.reduce((acc, request) => {
    const schoolName = request.user?.schoolName || "Unknown School";
    if (!acc[schoolName]) {
      acc[schoolName] = [];
    }
    acc[schoolName].push(request);
    return acc;
  }, {});

  return (
    <div className="w-full md:w-4/5 mx-auto p-4 min-h-screen flex flex-col">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
  
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-50 shadow-md p-4">
        <h2 className="text-2xl font-bold text-center text-primary">User Requests</h2>
      </div>
  
      {/* Floating Filter Button (Always Top-Right) */}
      <div className="fixed top-4 right-4 z-50">
        <button
          className="btn btn-circle btn-primary shadow-lg"
          onClick={() => setShowFilterMenu(!showFilterMenu)}
        >
          <Filter size={25} />
        </button>
      </div>
  
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto mt-4">
        {loading ? (
          <p className="text-center text-lg font-semibold">Loading...</p>
        ) : (
          Object.entries(groupedRequests).map(([schoolName, requests]) => (
            <div key={schoolName} className="mb-6">
              <h3 className="text-lg font-semibold bg-base-300 p-2 rounded">{schoolName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {requests.map((request) => (
                  <div
                    key={request.requestId}
                    className="bg-base-100 shadow-lg p-4 rounded-lg border border-base-300"
                  >
                    <h3 className="text-lg font-semibold">{request.product?.name || "N/A"}</h3>
                    <p className="text-sm text-gray-500">Request ID: {request.requestId}</p>
                    <p className="text-sm">Quantity: {request.requestedQuantity}</p>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-bold badge ${
                          request.status === "Approved"
                            ? "badge-success"
                            : request.status === "Rejected"
                            ? "badge-error"
                            : "badge-warning"
                        }`}
                      >
                        {request.status}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleString()}</p>
  
                    {request.status === "Pending" && (
                      <div className="flex justify-between items-center mt-3">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => updateRequestStatus(request.requestId, "Approved")}
                          disabled={processingRequestId === request.requestId}
                        >
                          {processingRequestId === request.requestId ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <CheckCircle size={20} />
                          )}
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => updateRequestStatus(request.requestId, "Rejected")}
                          disabled={processingRequestId === request.requestId}
                        >
                          {processingRequestId === request.requestId ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <XCircle size={20} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
  
      {/* Filter Options (Dropdown) */}
      {showFilterMenu && (
        <div className="absolute top-14 right-4 bg-base-100 shadow-md rounded-lg p-2 w-40 border border-base-300">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              className={`block w-full text-left px-4 py-2 text-sm rounded ${
                filterStatus === status ? "bg-primary text-white font-bold" : "hover:bg-base-300"
              }`}
              onClick={() => {
                setFilterStatus(status);
                setShowFilterMenu(false);
              }}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default UserRequests;
