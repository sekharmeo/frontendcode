import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceGenerator = ({ selectedRequests, requests, user }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInvoicePDF = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const selectedData = requests.filter((request) => selectedRequests[request.requestId]);
      if (selectedData.length === 0) {
        alert("No requests selected for invoice.");
        setIsGenerating(false);
        return;
      }

      const userSchool = user?.schoolName || "N/A"; // Ensure we use the user prop directly

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // **Main Title**
      const mainTitle = "SARVEPALLI RADHAKRISHNAN VIDYARTHI MITRA";
      const mainTitleWidth = doc.getTextWidth(mainTitle);
      doc.text(mainTitle, (pageWidth - mainTitleWidth) / 2, 15);

      // **Invoice Title**
      const invoiceTitle = `Approved Requests Invoice of ${userSchool}`;
      const invoiceTitleWidth = doc.getTextWidth(invoiceTitle);
      doc.text(invoiceTitle, (pageWidth - invoiceTitleWidth) / 2, 25);

      // **Table Columns**
      const tableColumn = ["Product", "Quantity", "Status", "Created At"];
      const tableRows = selectedData.map((request) => [
        request.product?.name || "N/A",
        request.requestedQuantity,
        request.status,
        new Date(request.createdAt).toLocaleDateString("en-GB"),
      ]);

      // **Generate Table**
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: {
          cellPadding: 3,
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          halign: "center",
          valign: "middle",
        },
        headStyles: {
          halign: "center",
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.5,
      });

      doc.save(`Approved_Requests_Invoice_${userSchool}.pdf`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <button
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition flex items-center"
      onClick={generateInvoicePDF}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <span className="loading loading-dots loading-xs"></span>
          <span className="ml-2">Generating...</span>
        </>
      ) : (
        "Generate Invoice"
      )}
    </button>
  );
};

export default InvoiceGenerator;
