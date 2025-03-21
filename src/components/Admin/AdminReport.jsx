import { FileText, Printer, MessageCircle, Send } from "lucide-react";
import { jsPDF } from "jspdf";

const AdminReport = ({ selectedRequests, requests, user }) => {
  const generateReceipt = async (isPrint = false, isShare = false) => {
    if (!user || !user.schoolName) {
      alert("User data is missing. Please try again.");
      return;
    }

    const productSummary = {};
    Object.values(requests.groupedRequests || {}).flat().forEach((request) => {
      if (selectedRequests[request.requestId]) {
        const productName = request.product?.name || "Unknown Product";
        productSummary[productName] = (productSummary[productName] || 0) + request.requestedQuantity;
      }
    });

    // **Calculate Dynamic Height** (Base Height: 50mm + 5mm per item + 5mm bottom margin)
    const baseHeight = 50;
    const extraContentHeight = Object.keys(productSummary).length * 5;
    const footerHeight = 20; // Space for signature fields
    const bottomMargin = 5;
    const dynamicHeight = baseHeight + extraContentHeight + footerHeight + bottomMargin;

    // **Create PDF with Dynamic Height**
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [58, dynamicHeight], // Auto-adjust height
    });

    let y = 10; // Start position

    // **Header**
    // **Header**
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("SRKVM RECEIPT", 29, y, { align: "center" });
y += 6;

doc.setFontSize(9);
doc.text("Issuer: MEO - KOTANANDURU", 5, y); // Align left at X = 5
y += 6;

doc.setFontSize(9);
doc.text(`Receiver:`, 5, y); // Align "Receiver:" label to the left
doc.setFontSize(8); // Reduce font size for long names

const receiverText = user.schoolName;
const maxWidth = 48; // Max width before wrapping (paper width - margins)
const splitText = doc.splitTextToSize(receiverText, maxWidth); // Handle overflow

doc.text(splitText, 20, y); // Place wrapped text starting from position 20
y += splitText.length * 5; // Adjust Y position dynamically

doc.setFontSize(8);
const currentDate = new Date();
const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${currentDate.getFullYear()}`;
const formattedTime = `${String(currentDate.getHours()).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")}`;

doc.text(`Date: ${formattedDate} | Time: ${formattedTime}`, 29, y, { align: "center" });
    // **Separator Line**
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(5, y, 53, y);
    y += 4;

    // **Product Table (Manual Layout)**
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Item", 5, y);
    doc.text("Qty", 45, y);
    y += 3;
    doc.line(5, y, 53, y);
    y += 4;

    Object.entries(productSummary).forEach(([product, quantity]) => {
      doc.text(product, 5, y, { maxWidth: 35 }); // Limit text width
      doc.text(quantity.toString(), 45, y);
      y += 5;
    });

    // **Separator Line**
    y += 2;
    doc.line(5, y, 53, y);
    y += 4;

    // **Footer**
    doc.setFontSize(8);
    doc.text("Thank you!", 29, y, { align: "center" });
    y += 6;
    
    // Receiver Cell No
    doc.text("Receiver Cell No:", 5, y);
    doc.line(5, y + 2, 53, y + 2); // Full underline
    y += 6;
    
    // Receiver Sign
    doc.text("Receiver Sign:", 5, y);
    doc.line(5, y + 2, 53, y + 2); // Full underline
    y += 6;
    
    // Issuer Sign
    doc.text("Issuer Sign:", 5, y);
    doc.line(5, y + 2, 53, y + 2); // Full underline
    

    // **Ensure at least 5mm margin at bottom**
    y += bottomMargin;

    if (isPrint) {
      for (let i = 0; i < 2; i++) {
        doc.autoPrint();
        window.open(doc.output("bloburl"), "_blank");
      }
    } else if (isShare) {
      const pdfBlob = doc.output("blob");

      // Convert Blob to File
      const pdfFile = new File([pdfBlob], "receipt.pdf", { type: "application/pdf" });

      // Check if Web Share API is supported
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            title: "Receipt",
            text: `Here is your receipt from ${user.schoolName}`,
            files: [pdfFile],
          });
        } catch (error) {
          console.error("Sharing failed", error);
          alert("Sharing failed. Try manually downloading the file.");
        }
      } else {
        alert("Your device does not support direct file sharing via WhatsApp.");
      }
    } else {
      doc.save("receipt.pdf");
    }
  };

  return (
    <div className="flex flex-col items-end justify-center gap-2 fixed right-4 top-1/2 transform -translate-y-1/2">
      <button
        className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition"
        onClick={() => generateReceipt(false)}
      >
        <FileText size={25} />
      </button>
  
      <button
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => generateReceipt(true)}
      >
        <Printer size={25} />
      </button>
  
      <button
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition flex items-center justify-center"
        onClick={() => generateReceipt(false, true)}
      >
        <Send size={25} />
      </button>
    </div>
  );
};

export default AdminReport;
