import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StockReports = () => {
  const [stockSummary, setStockSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStockSummary();
  }, []);

  const fetchStockSummary = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://srkvm.vercel.app/api/auth/productlog");
      setStockSummary(response.data);
    } catch (error) {
      console.error("Error fetching stock summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    setDownloading(true);
    setTimeout(() => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const centerX = pageWidth / 2;

      doc.setFontSize(14);
      doc.text("SARVEPALLI RADHAKRISHNAN VIDYARTHI MITRA", centerX, 10, { align: "center" });
      
      doc.setFontSize(12);
      doc.text("KOTANANDURU MANDAL", centerX, 18, { align: "center" });
      
      doc.setFontSize(16);
      doc.text("Stock Report", centerX, 26, { align: "center" });

      const tableColumn = ["Product Name", "Received", "Balance", "Disbursed"];
      const tableRows = stockSummary.map((item) => {
        const received = Math.max(item.created ?? 0, item.updated ?? 0);
        const balance = item.stockRequestAccepted ?? 0;
        const disbursed = received - balance;

        return [item.productName, received, balance, disbursed];
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: {
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: 0,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { halign: "left" },
          1: { halign: "right" },
          2: { halign: "right" },
          3: { halign: "right" },
        },
      });

      doc.save("Stock_Report.pdf");
      setDownloading(false);
    }, 1000);
  };
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen p-4 bg-gray-50 shadow-lg rounded-lg">
      
      {/* Fixed Button Section */}
      <div className="absolute top-6 right-6 flex gap-4">
        {/* Download Report Button */}
        <div className="fixed top-6 right-6 sm:top-1/2 sm:-translate-y-1/2 sm:right-4 lg:top-6 lg:right-6 flex gap-4">
        <button
          onClick={generatePDF}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={downloading}
        >
          {downloading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <FileText size={25} />
          )}
        </button>
      </div>
      </div>
  
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Stock Reports</h1>
  
      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-500">Loading stock summary...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 shadow-md rounded-lg">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 p-3">Product Name</th>
                <th className="border border-gray-300 p-3">Received</th>
                <th className="border border-gray-300 p-3">Balance</th>
                <th className="border border-gray-300 p-3">Disbursed</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {stockSummary.map((item, index) => {
                const received = Math.max(item.created ?? 0, item.updated ?? 0);
                const balance = item.stockRequestAccepted ?? 0;
                const disbursed = received - balance;
  
                return (
                  <tr key={item.productName} className={`text-center ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
                    <td className="border border-gray-300 p-3">{item.productName}</td>
                    <td className="border border-gray-300 p-3">{received}</td>
                    <td className="border border-gray-300 p-3">{balance}</td>
                    <td className="border border-gray-300 p-3 text-red-600 font-semibold">{disbursed}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
};

export default StockReports;