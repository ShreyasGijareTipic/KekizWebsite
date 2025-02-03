import React from 'react';
import html2pdf from "html2pdf.js";
import { getUserData } from '../../../util/session';


export function generatePDF(grandTotal, invoiceNo, customerName, formData, remainingAmount, totalAmountWords) {
    const ci = getUserData()?.company_info;

    if (!ci) {
        console.error("Company Info not found.");
        return;
    }

    // Invoice HTML structure
    const invoiceContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <!-- Header Section -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div style="width: 40%;">
                    <img src="img/${ci.logo}" alt="Company Logo" style="width: 100px;" />
                </div>
                <div style="text-align: right; width: 60%;">
                    <h2 style="margin: 0; font-size: 16px;">${ci.company_name}</h2>
                    <p style="margin: 5px 0; font-size: 14px;">${ci.land_mark}, ${ci.Tal}, ${ci.Dist}, ${ci.pincode}</p>
                    <p style="margin: 5px 0; font-size: 14px;">Phone: ${ci.phone_no}</p>
                </div>
            </div>

            <!-- Status Section -->
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="background-color: #d1e7dd; padding: 10px; border: 1px solid #b2d8cc; margin: 0; font-size: 16px;">${formData.InvoiceStatus}</h3>
            </div>

            <!-- Customer and Invoice Details -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div style="width: 48%; padding: 10px; background-color: #f0f8ff; border: 1px solid #add8e6;">
                    <p style="font-size: 16px;"><strong>Customer Name:</strong> <span style="font-size: 14px;">${formData.customer.name}</span></p>
                    <p style="font-size: 16px;"><strong>Customer Address:</strong> <span style="font-size: 14px;">${formData.customer.address}</span></p>
                    <p style="font-size: 16px;"><strong>Mobile Number:</strong> <span style="font-size: 14px;">${formData.customer.mobile}</span></p>
                </div>
                <div style="width: 48%; padding: 10px; background-color: #fff7e6; border: 1px solid #ffcc99;">
                    <p style="font-size: 16px;"><strong>Invoice Number:</strong> <span style="font-size: 14px;">${invoiceNo}</span></p>
                    <p style="font-size: 16px;"><strong>Invoice Date:</strong> <span style="font-size: 14px;">${formData.date.split("-").reverse().join("-")}</span></p>
                </div>
            </div>

            <!-- Products Table -->
            <h3 style="font-size: 16px;">Products</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; text-align: center;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 16px;">Sr. No.</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 16px;">Product Name</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 16px;">Price (₹)</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 16px;">Quantity</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 16px;">Total (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    ${formData.products.map((product, index) => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${index + 1}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${product.product_name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${product.dPrice} /-</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${product.dQty}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${product.total_price} /-</td>
                        </tr>
                    `).join("")}
                    <tr style="background-color: #f8f9fa;">
                        <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 16px;"><strong>Total</strong></td>
                        <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${grandTotal} /-</td>
                    </tr>
                </tbody>
            </table>

            

            <p style="text-align: center; font-size: 14px;">This invoice is computer-generated and valid.</p>
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
                    customer: { name: "John Doe", address: "123 Main St", mobile: "9876543210" },
                    date: "2024-12-31",
                    products: [
                        { product_name: "Apples", dPrice: 100, dQty: 2, total_price: 200 },
                        { product_name: "Bananas", dPrice: 50, dQty: 4, total_price: 200 },
                    ],
                    amountPaid: 300,
                    paymentMode: "Online",
                };

                generatePDF(400, "INV-001", "John Doe", formData, 100, "Four Hundred");
            }}>
                Download Invoice
            </button>
        </div>
    );
}

export default InvoicePdf;
