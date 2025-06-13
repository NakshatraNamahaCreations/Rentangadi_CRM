import React from "react";
import { toWords } from "number-to-words";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../assets/RentangadiLogo.jpg"


const invoiceData = {
  company: {
    name: "Rent Angadi",
    address:
      "Sy No 258/6, Old Sy No 258/1 Battahalsur Jala, Hobli, Bettahalsur, Bangalore, Bengaluru, Urban Karnataka - 560001",
    phone: "+91 9619868262",
    gstin: "29ABJFR2437B1Z3",
  },
  invoice: {
    number: "RA114",
    date: "04/03/2025",
    reverseCharge: "N",
    state: "Karnataka",
    code: "29",
  },
  billing: {
    name: "M/s. Yellow Umbrella Production House (OPC) Pvt. LTD",
    address:
      "No,503, 8th main, weshwing, Amarjyothi Layout Domlur Extn, Bangalore",
    gstin: "29AABCY6686L1ZE",
    state: "Karnataka",
    code: "29",
  },
  shipping: {
    name: "N/A",
    address: "N/A",
    gstin: "N/A",
    state: "N/A",
    code: "N/A",
  },
  products: [
    {
      description: "Pink Metal Chair",
      hsn: "9403",
      days: 1,
      qty: 15,
      rate: 300,
    },
    {
      description: "Matrix Center Table",
      hsn: "9403",
      days: 1,
      qty: 2,
      rate: 750,
    },
    {
      description: "Flamingo Side Table",
      hsn: "9403",
      days: 1,
      qty: 2,
      rate: 750,
    },
    {
      description: "White Chester Drawer",
      hsn: "9403",
      days: 1,
      qty: 1,
      rate: 4000,
    },
    {
      description: "Banquet Dining Table with Frill 6' * 2'",
      hsn: "9403",
      days: 1,
      qty: 10,
      rate: 300,
    },
    { description: "Manpower", hsn: "9403", days: 1, qty: 6, rate: 1500 },
    {
      description: "Transportation",
      hsn: "9403",
      days: 1,
      qty: 1,
      rate: 6500,
    },
  ],
  bankDetails: {
    accountNo: "50200099507304",
    ifsc: "HDFC0004051",
    bankName: "HDFC, CMH Road",
  },
  discount: 10, // percent
  labourecharge: 9000,
  transportcharge: 6500,
  adjustments: 0,
  GST: 0.18,
};

const calculateTotals = () => {
  let totalBeforeTax = 0;
  invoiceData.products.forEach((product) => {
    totalBeforeTax += product.qty * product.days * product.rate;
  });
  const discountAmount = (totalBeforeTax * (invoiceData.discount || 0)) / 100;
  const discountedTotal = totalBeforeTax - discountAmount;
  const labour = Number(invoiceData.labourecharge || 0);
  const transport = Number(invoiceData.transportcharge || 0);
  const subtotalBeforeGST = discountedTotal + labour + transport;
  const gstAmount = subtotalBeforeGST * (invoiceData.GST || 0);
  const grandTotal = subtotalBeforeGST + gstAmount + (invoiceData.adjustments || 0);

  return {
    totalBeforeTax,
    discountAmount,
    discountedTotal,
    labour,
    transport,
    subtotalBeforeGST,
    gstAmount,
    grandTotal,
  };
};

const totals = calculateTotals();

const downloadPDF = () => {
  const invoiceElement = document.getElementById("invoiceContent");
  html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  });
};

const Invoice = () => (
  <>
    <button
      onClick={downloadPDF}
      variant="success"
      className=""
      style={{
        marginBottom: "15px",
        display: "block",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginLeft: "10px",
      }}
    >
      Download Invoice
    </button>
    <div
      id="invoiceContent"
      style={{
        width: "900px",
        margin: "20px auto",
        border: "2px solid black",
        padding: "10px",
        fontFamily: "Arial",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "2px solid black",
        }}
      >
        <div style={{ width: "30%" }}>
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "120px" }}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            width: "70%",
            background: "#1f497d",
            color: "white",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "30px", fontWeight: "bold" }}>
            {invoiceData.company.name}
          </h2>
          <p style={{ margin: "5px 0" }}>{invoiceData.company.address}</p>
          <p style={{ margin: 0 }}>
            Tel: {invoiceData.company.phone} | GSTIN: {invoiceData.company.gstin}
          </p>
        </div>
      </div>

      <h2
        style={{
          textAlign: "center",
          background: "#1f497d",
          color: "white",
          padding: "8px",
          margin: "15px 0",
          borderRadius: "5px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Tax Invoice
      </h2>

      {/* Invoice Details Table */}
      <table
        width="100%"
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", marginBottom: "15px" }}
      >
        <tbody>
          <tr style={{ display: "grid" }}>
            <td>
              <b>Invoice No:</b> {invoiceData.invoice.number}
            </td>
            <td>
              <b>Invoice Date:</b> {invoiceData.invoice.date}
            </td>
            <td>
              <b>Reverse Charge (Y/N):</b> {invoiceData.invoice.reverseCharge}
            </td>
            <td>
              <b>State:</b> {invoiceData.invoice.state}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Billing & Shipping Details */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
          tableLayout: "fixed",
        }}
      >
        <thead style={{ background: "#1f497d", color: "white" }}>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Bill to Party
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Ship to Party
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* Billing Details (Left Side) */}
            <td
              style={{
                border: "1px solid black",
                textAlign: "left",
                verticalAlign: "top",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "4px", borderBottom: "1px solid black" }}>Name:</td>
                    <td style={{ padding: "4px", borderBottom: "1px solid black" }}>{invoiceData.billing.name}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px", borderBottom: "1px solid black" }}>Address:</td>
                    <td style={{ padding: "4px", borderBottom: "1px solid black" }}>{invoiceData.billing.address}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px" }}>State:</td>
                    <td style={{ padding: "4px" }}>{invoiceData.billing.state}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            {/* Shipping Details (Right Side) */}
            <td
              style={{
                border: "1px solid black",
                textAlign: "left",
                verticalAlign: "top",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "4px", borderBottom: "1px solid black" }}>Name:</td>
                    <td style={{ padding: "4px", borderBottom: "1px solid black" }}>{invoiceData.shipping.name}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px", borderBottom: "1px solid black" }}>Address:</td>
                    <td style={{ padding: "4px", borderBottom: "1px solid black" }}>{invoiceData.shipping.address}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px" }}>State:</td>
                    <td style={{ padding: "4px" }}>{invoiceData.shipping.state}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Product Table */}
      <div className="border-t pt-4">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-gray-700 font-semibold text-center">
                Product Description
              </th>
              <th className="border px-4 py-2 text-gray-700 font-semibold text-center">
                HSN
              </th>
              <th className="border px-4 py-2 text-gray-700 font-semibold text-center">
                Qty
              </th>
              <th className="border px-4 py-2 text-gray-700 font-semibold text-center">
                Rate
              </th>
              <th className="border px-4 py-2 text-gray-700 font-semibold text-center">
                No of Days
              </th>
              <th className="border px-4 py-2 text-gray-700 font-semibold text-center">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.products.map((product, index) => {
              let amount = product.qty * product.days * product.rate;
              return (
                <tr key={index}>
                  <td className="border px-4 py-2 text-gray-700 text-center">
                    {product.description}
                  </td>
                  <td className="border px-4 py-2 text-gray-700 text-center">
                    {product.hsn}
                  </td>
                  <td className="border px-4 py-2 text-gray-700 text-center">
                    {product.qty}
                  </td>
                  <td className="border px-4 py-2 text-gray-700 text-center">
                    ₹{product.rate}
                  </td>
                  <td className="border px-4 py-2 text-gray-700 text-center">
                    {product.days}
                  </td>
                  <td className="border px-4 py-2 text-gray-700 text-center">
                    ₹{amount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Total Section */}
      <table
        width="100%"
        border="1"
        cellPadding="8"
        style={{
          borderCollapse: "collapse",
          textAlign: "right",
          border: "1px solid black",
        }}
      >
        <tbody>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <b>Total Amount Before Tax</b>
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              ₹{totals.totalBeforeTax.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <b>Discount ({invoiceData.discount}%) </b>
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              ₹{totals.discountAmount.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <b>Manpower Cost/Labour Charge:</b>
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              ₹{totals.labour.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <b>Transportation:</b>
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              ₹{totals.transport.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <b>RoundOff:</b>
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              ₹{(invoiceData.adjustments || 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <b>Add:GST(18%):</b>
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              ₹{totals.gstAmount.toFixed(2)}
            </td>
          </tr>
          <tr style={{ background: "#1f497d", color: "white" }}>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                fontWeight: "bold",
              }}
            >
              GrandTotal Amount:
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                fontWeight: "bold",
              }}
            >
              ₹{totals.grandTotal.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td
              colSpan="2"
              style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Total Invoice Amount in Words
            </td>
          </tr>
          <tr>
            <td
              colSpan="2"
              style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <i>
                {toWords(Math.round(totals.grandTotal))
                  .replace(/,/g, "")
                  .toUpperCase()}{" "}
                Only
              </i>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Bank Details */}
      <div style={{ marginTop: "20px", fontSize: "15px" }}>
        <b>Bank Details:</b>
        <div>Account No: {invoiceData.bankDetails.accountNo}</div>
        <div>IFSC: {invoiceData.bankDetails.ifsc}</div>
        <div>Bank Name: {invoiceData.bankDetails.bankName}</div>
      </div>
    </div>
  </>
);

export default Invoice;