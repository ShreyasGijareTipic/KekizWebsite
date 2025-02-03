import React from 'react';
import html2pdf from "html2pdf.js";
import { getUserData } from '../../../util/session';

export function generatePDF(grandTotal, invoiceNo, customerName, formData, remainingAmount, totalAmountWords) {
    const ci = getUserData()?.company_info;

    if (!ci) {
        console.error("Company Info not found.");
        return;
    }

    const invoiceContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fff; border: 1px solid #ddd;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <img src="img/${ci.logo}" alt="Company Logo" style="width: 100px;" />
                </div>
                <div style="text-align: right;">
                    <h2>${ci.company_name}</h2>
                    <p>${ci.land_mark}, ${ci.Tal}, ${ci.Dist}, ${ci.pincode}</p>
                    <p>Phone: ${ci.phone_no}</p>
                </div>
            </div>

            <h3 style="text-align: center; background-color: #d1e7dd; padding: 10px; border: 1px solid #b2d8cc;">${formData.InvoiceStatus}</h3>

            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <div style="width: 48%; background: #f0f8ff; padding: 10px;">
                    <p><strong>Customer Name:</strong> ${formData.customer.name}</p>
                    <p><strong>Mobile Number:</strong> ${formData.customer.mobile}</p>
                </div>
                <div style="width: 48%; background: #fff7e6; padding: 10px;">
                    <p><strong>Invoice Number:</strong> ${invoiceNo}</p>
                    <p><strong>Invoice Date:</strong> ${formData.date.split("-").reverse().join("-")}</p>
                    ${formData.InvoiceType === 2 ? `<p><strong>Delivery Date:</strong> ${formData.DeliveryDate.split("-").reverse().join("-")}</p>` : ""}
                </div>
            </div>

            <h3>Products</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
                <thead>
                    <tr style="background: #f0f0f0;">
                        <th>Sr. No.</th>
                        <th>Product Name</th>
                        <th>Price (₹)</th>
                        <th>Quantity</th>
                        <th>Total (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    ${formData.products.map((product, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${product.product_name}</td>
                            <td>${product.dPrice} /-</td>
                            <td>${product.dQty}</td>
                            <td>${product.total_price} /-</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            <div style="margin-top: 20px; padding: 10px; background: #e6ffe6;">
                <p><strong>Amount Paid:</strong> ${Number(formData.amountPaid).toFixed(2)} /-</p>
                <p><strong>Remaining Amount:</strong> ${Number(remainingAmount).toFixed(2)} /-</p>
                <p><strong>Payment Mode:</strong> ${formData.paymentMode}</p>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <div>
                    <h4>Bank Details</h4>
                    <p><strong>Bank:</strong> ${ci.bank_name}</p>
                    <p><strong>Account Number:</strong> ${ci.account_no}</p>
                    <p><strong>IFSC Code:</strong> ${ci.IFSC_code}</p>
                </div>
                <div style="text-align: center;">
                    <p><strong>E-Signature</strong></p>
                    <img src="img/${ci.sign}" alt="Signature" style="width: 100px; height: 50px;" />
                    <p>Authorized Signature</p>
                </div>
            </div>

            <hr />
            <p style="text-align: center;">This invoice is computer-generated and valid.</p>
        </div>
    `;

    const element = document.createElement("div");
    element.innerHTML = invoiceContent;

    const options = {
        margin: 10,
        filename: `${invoiceNo}-${customerName}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
}

function InvoicePdf() {
    return (
        <div>
            <button onClick={() => {
                const formData = {
                    customer: {
                        name: "Shreya G",
                        mobile: "1234567890",
                    },
                    date: "2024-12-31",
                    InvoiceStatus: "Delivered Order",
                    InvoiceType: 2,
                    DeliveryDate: "2025-01-01",
                    products: [
                        { product_name: "Apples", dPrice: 100, dQty: 2, total_price: 200 },
                        { product_name: "Bananas", dPrice: 50, dQty: 4, total_price: 200 },
                    ],
                    amountPaid: 300,
                    paymentMode: "Online",
                };

                generatePDF(400, "INV-001", "Shreya G", formData, 100, "Four Hundred");
            }}>
                Download Invoice
            </button>
        </div>
    );
}

export default InvoicePdf;
