import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, CircleX, CircleCheckBig } from "lucide-react";
import axios from "axios";
import InvoiceGenerator from "./UserInvoice";
import UserDetails from "./UserDetails";
import GenerateReport from "./GenerateReport"; // Import the new component

const UserReports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState({ groupedRequests: {}, sortedGroups: [] });
  const [loading, setLoading] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState({});

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

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

  const fetchRequests = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://srkvm.vercel.app/requests/approvedrequests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const groupedRequests = response.data.requests.reduce((acc, request) => {
        const formattedDate = new Date(request.createdAt).toLocaleDateString("en-GB");
        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(request);
        return acc;
      }, {});
      const sortedGroups = Object.keys(groupedRequests).sort((a, b) => {
        const dateA = new Date(a.split("/").reverse().join("-"));
        const dateB = new Date(b.split("/").reverse().join("-"));
        return dateB - dateA;
      });
      setRequests({ groupedRequests, sortedGroups });
      setSelectedRequests({});
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (requestId) => {
    setSelectedRequests((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  };

  const handleSelectAllRequests = () => {
    const allSelected = Object.values(selectedRequests).every(Boolean);
    const newSelections = {};
    Object.values(requests.groupedRequests).flat().forEach(request => {
      newSelections[request.requestId] = !allSelected;
    });
    setSelectedRequests(newSelections);
  };

  const handleSelectAllByDate = (date) => {
    const allSelected = requests.groupedRequests[date].every(request => selectedRequests[request.requestId]);
    const newSelections = { ...selectedRequests };
    requests.groupedRequests[date].forEach(request => {
      newSelections[request.requestId] = !allSelected;
    });
    setSelectedRequests(newSelections);
  };

  return (
    <div className="w-full md:w-4/5 mx-auto p-4 min-h-screen flex flex-col">
      
      {/* Floating Home Button & Generate Report */}
      <div className="fixed top-4 right-4 z-50 flex space-x-4">
         <GenerateReport selectedRequests={selectedRequests} requests={requests} user={user} />
      </div>
    
      {/* User Details */}
      <div className="sticky top-0 bg-white z-0 shadow-md p-4">
        
        <UserDetails user={user} />
      
       
      {/* Header Section */}
      <div className="flex justify-center items-center mb-4 space-x-4">
        <button
          className="bg-gray-200 text-black p-2 rounded-full shadow-md hover:bg-gray-400 flex items-center transition"
          onClick={handleSelectAllRequests}
        >
          {Object.values(selectedRequests).every(Boolean) ? (
            <CircleX size={20} className="mr-2" />
          ) : (
            <CircleCheckBig size={20} className="mr-2" />
          )}
        </button>
        <h1 className="text-lg md:text-2xl font-bold text-center">Approved Requests</h1>
      </div>
      </div>
      {/* Request History */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : requests.sortedGroups.length > 0 ? (
        <div className="mt-4">
          {requests.sortedGroups.map((date) => (
            <div key={date} className="mb-6">
              {/* Date Header */}
              <div className="flex items-center justify-between bg-gray-200 p-3 rounded-lg shadow-sm">
                <h2 className="text-md md:text-lg font-bold">{date}</h2>
                <button
                  className="bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-400 transition"
                  onClick={() => handleSelectAllByDate(date)}
                >
                  {requests.groupedRequests[date].every(request => selectedRequests[request.requestId]) ? (
                    <CircleX size={20} />
                  ) : (
                    <CircleCheckBig size={20} />
                  )}
                </button>
              </div>
  
              {/* Request Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {requests.groupedRequests[date].map((request) => (
                  <div
                    key={request.requestId}
                    className="bg-white border border-gray-300 rounded-xl p-4 shadow-md flex items-center text-sm transition hover:shadow-lg"
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={!!selectedRequests[request.requestId]}
                      onChange={() => handleCheckboxChange(request.requestId)}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">Request ID: {request.requestId}</p>
                      <p><strong>Product:</strong> {request.product?.name || "N/A"}</p>
                      <p><strong>Qty:</strong> {request.requestedQuantity}</p>
                      <p className="text-green-500 font-bold"><strong>Status:</strong> {request.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500 text-center">No approved requests found.</p>
      )}
  
      {/* Invoice Generator */}
      {Object.values(selectedRequests).some(Boolean) && (
        <InvoiceGenerator selectedRequests={selectedRequests} requests={Object.values(requests.groupedRequests).flat()} user={user} />
      )}
    </div>
  );
  
};

export default UserReports;
