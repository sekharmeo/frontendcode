import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileDown, CircleCheckBig, CircleX } from "lucide-react";
import axios from "axios";
import InvoiceGenerator from "./InvoiceGenerator";
import AdminReport from "./AdminReport";

const ReportsBySchool = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [requests, setRequests] = useState({ groupedRequests: {}, sortedGroups: [] });
  const [loading, setLoading] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState({});

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://srkvm.vercel.app/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const uniqueSchools = [
        ...new Map(response.data.map((item) => [item.schoolName, item])).values(),
      ];

      setSchools(uniqueSchools);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };


  const fetchRequests = async () => {
    if (!selectedSchool) {
      alert("Please select a school.");
      return;
    }
  
    // ✅ Reset previous state to avoid stale data
    setRequests({ groupedRequests: {}, sortedGroups: [] });
    setSelectedRequests({}); 
    setLoading(true);
    
    const token = localStorage.getItem("token");
  
    try {
      const selectedUser = schools.find((school) => school.schoolName.trim() === selectedSchool.trim());
  
      if (!selectedUser) {
        alert(`No user found for school: ${selectedSchool}`);
        setLoading(false);
        return;
      }
  
      const response = await axios.get(
        `https://srkvm.vercel.app/requests/approved-requests/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.requests.length === 0) {
        setRequests({ groupedRequests: {}, sortedGroups: [] });
        return;
      }
  
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
  
      // ✅ Automatically select all requests by default
      const preselectedRequests = {};
      response.data.requests.forEach((request) => {
        preselectedRequests[request.requestId] = true; // Select all requests
      });
  
      setRequests({ groupedRequests, sortedGroups });
      setSelectedRequests(preselectedRequests); // ✅ Apply default selection
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests({ groupedRequests: {}, sortedGroups: [] }); // ✅ Ensure state is reset on error
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

  const handleSelectAllChange = () => {
    // Check if all requests are currently selected
    const allSelected = Object.values(selectedRequests).every(Boolean);
  
    // Toggle selection state
    const updatedSelections = {};
    requests.sortedGroups.forEach((date) => {
      requests.groupedRequests[date].forEach((request) => {
        updatedSelections[request.requestId] = !allSelected;
      });
    });
  
    setSelectedRequests(updatedSelections);
  };
  
  const handleGroupCheckboxChange = (date) => {
    const allSelected = requests.groupedRequests[date].every(
      (request) => selectedRequests[request.requestId]
    );

    const updatedSelections = { ...selectedRequests };

    requests.groupedRequests[date].forEach((request) => {
      updatedSelections[request.requestId] = !allSelected;
    });

    setSelectedRequests(updatedSelections);
  };

  return (
    <div className="w-full h-full max-w-7xl lg:w-4/5 xl:w-4/5 bg-white shadow-lg p-6 rounded-lg relative">
      
      {/* Fixed Top Section */}
      <div className="sticky top-0 bg-white z-10 pb-4 pt-4 shadow-md">
        
        {/* Report Button */}
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          <AdminReport 
            selectedRequests={selectedRequests} 
            requests={requests} 
            user={schools.find((school) => school.schoolName === selectedSchool)} 
          />
        </div>
  
        {/* Heading */}
        <h1 className="text-lg md:text-2xl font-bold text-center mb-4 text-gray-700">
          Approved Requests by School
        </h1>
  
        {/* School Selection & Button Section */}
        <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-3">
          <select
            className="p-2 border border-gray-300 rounded w-full md:w-1/2 lg:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
          >
            <option value="">-- Select School --</option>
            {schools.map((school) => (
              <option key={school._id} value={school.schoolName}>
                {school.schoolName} ({school.udiseCode})
              </option>
            ))}
          </select>
  
          {/* Download Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex justify-center items-center gap-2 shadow"
            onClick={fetchRequests}
          >
            <FileDown size={20} />
          </button>
  
          {/* Select All Button */}
          {requests.sortedGroups.length > 0 && (
            <button
              className={`text-white px-4 py-2 rounded-lg transition flex justify-center items-center gap-2 shadow 
                ${Object.values(selectedRequests).every(Boolean) ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
              `}
              onClick={handleSelectAllChange}
            >
              {Object.values(selectedRequests).every(Boolean) ? (
                <CircleX size={20} />
              ) : (
                <CircleCheckBig size={20} />
              )}
            </button>
          )}
        </div>
      </div>
  
      {/* Scrollable Content */}
      <div className="mt-4 overflow-y-auto max-h-[70vh] p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : requests.sortedGroups.length > 0 ? (
          <div>
            {requests.sortedGroups.map((date) => (
              <div key={date} className="mb-6">
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow">
                  <h2 className="text-md md:text-lg font-semibold text-gray-700">{date}</h2>
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    onChange={() => handleGroupCheckboxChange(date)}
                    checked={requests.groupedRequests[date].every((request) => selectedRequests[request.requestId])}
                  />
                </div>
  
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {requests.groupedRequests[date].map((request) => (
                    <div key={request.requestId} className="border rounded-lg p-4 shadow-md flex items-center text-sm bg-white">
                      <input
                        type="checkbox"
                        className="mr-3 h-5 w-5"
                        checked={!!selectedRequests[request.requestId]}
                        onChange={() => handleCheckboxChange(request.requestId)}
                      />
                      <div className="text-gray-700">
                        <p className="font-semibold">Request ID: {request.requestId}</p>
                        <p><strong>Product:</strong> {request.product?.name || "N/A"}</p>
                        <p><strong>Qty:</strong> {request.requestedQuantity}</p>
                        <p className="text-green-600 font-bold"><strong>Status:</strong> {request.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-500 text-center">No approved requests found for this school.</p>
        )}
      </div>
  
      {/* Invoice Generator */}
      {Object.values(selectedRequests).some(Boolean) && (
        <InvoiceGenerator selectedRequests={selectedRequests} requests={Object.values(requests.groupedRequests).flat()} />
      )}
    </div>
  );
  
};

export default ReportsBySchool;
