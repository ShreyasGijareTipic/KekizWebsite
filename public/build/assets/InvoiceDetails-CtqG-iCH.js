import{B as P,r as u,w as _,j as e}from"./index-CWCk8Mfu.js";import{h as T}from"./html2pdf-DEb3MY3B.js";import{a as z,f as A}from"./api-helnlucg.js";import{C as F,a as D}from"./CCardBody-CjD5VXLl.js";import{C as M}from"./CCardHeader-DfyZxt5z.js";import{b as E,a as j}from"./index.esm-CtJdof8l.js";function W(o,a,c,i,x,g){var m;const s=(m=z())==null?void 0:m.company_info;if(!s){console.error("Company Info not found.");return}const f=`
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <!-- Header Section -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div style="width: 40%;">
                    <img src="img/${s.logo}" alt="Company Logo" style="width: 100px;" />
                </div>
                <div style="text-align: right; width: 60%;">
                    <h2 style="margin: 0; font-size: 16px;">${s.company_name}</h2>
                    <p style="margin: 5px 0; font-size: 14px;">${s.land_mark}, ${s.Tal}, ${s.Dist}, ${s.pincode}</p>
                    <p style="margin: 5px 0; font-size: 14px;">Phone: ${s.phone_no}</p>
                </div>
            </div>

            <!-- Status Section -->
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="background-color: #d1e7dd; padding: 10px; border: 1px solid #b2d8cc; margin: 0; font-size: 16px;">${i.InvoiceStatus}</h3>
            </div>

            <!-- Customer and Invoice Details -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div style="width: 48%; padding: 10px; background-color: #f0f8ff; border: 1px solid #add8e6;">
                    <p style="font-size: 16px;"><strong>ग्राहकाचे नाव:</strong> <span style="font-size: 14px;">${i.customer.name}</span></p>
                    <p style="font-size: 16px;"><strong>ग्राहकाचा पत्ता:</strong> <span style="font-size: 14px;">${i.customer.address}</span></p>
                    <p style="font-size: 16px;"><strong>मोबाईल क्रमांक:</strong> <span style="font-size: 14px;">${i.customer.mobile}</span></p>
                </div>
                <div style="width: 48%; padding: 10px; background-color: #fff7e6; border: 1px solid #ffcc99;">
                    <p style="font-size: 16px;"><strong>चलन क्रमांक:</strong> <span style="font-size: 14px;">${a}</span></p>
                    <p style="font-size: 16px;"><strong>चलन तारीख:</strong> <span style="font-size: 14px;">${i.date.split("-").reverse().join("-")}</span></p>
                    ${i.InvoiceType===2?`<p style="font-size: 16px;"><strong>डिलीव्हरी तारीख:</strong> <span style="font-size: 14px;">${i.DeliveryDate.split("-").reverse().join("-")}</span></p>`:""}
                </div>
            </div>

            <!-- Products Table -->
            <h3 style="font-size: 16px;">उत्पादने</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; text-align: center;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 16px;">अनुक्रमांक</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 16px;">वस्तूचे नाव</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 16px;">किंमत (₹)</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 16px;">प्रमाण</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 16px;">एकूण (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    ${i.products.map((d,y)=>`
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${y+1}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${d.product_name}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${d.dPrice} /-</td>
                                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${d.dQty}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${d.total_price} /-</td>
                            </tr>
                        `).join("")}
                    <tr style="background-color: #f8f9fa;">
                        <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 16px;"><strong>एकूण</strong></td>
                        <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${o} /-</td>
                    </tr>
                </tbody>
            </table>

            <!-- Additional Details -->
            <div style="margin-bottom: 20px; padding: 10px; background-color: #e6ffe6; border: 1px solid #ccffcc;">
                <p style="font-size: 16px;"><strong>रक्कम भरलेली:</strong> <span style="font-size: 14px;">${i.amountPaid.toFixed(2)} /-</span></p>
                <p style="font-size: 16px;"><strong>शिल्लक रक्कम:</strong> <span style="font-size: 14px;">${x.toFixed(2)} /-</span></p>
                <p style="font-size: 16px;"><strong>पेमेंट मोड:</strong> <span style="font-size: 14px;">${i.paymentMode}</span></p>
            </div>

            <p style="font-size: 16px;"><strong>रक्कम शब्दांत:</strong> <span style="font-size: 14px;">${g} फक्त</span></p>

            <!-- Footer Section -->
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <div style="width: 48%;">
                    <h4 style="font-size: 16px;">बँक तपशील</h4>
                    <p style="font-size: 14px;"><strong>बँक:</strong> ${s.bank_name}</p>
                    <p style="font-size: 14px;"><strong>खाते क्रमांक:</strong> ${s.account_no}</p>
                    <p style="font-size: 14px;"><strong>IFSC कोड:</strong> ${s.IFSC_code}</p>
                </div>
                <div style="text-align: center; width: 48%;">
                    <p style="font-size: 16px;"><strong>ई-स्वाक्षरी</strong></p>
                    <img src="img/${s.sign}" alt="Signature" style="width: 100px; height: 50px;" />
                    <p style="font-size: 14px;">अधिकृत स्वाक्षरी</p>
                </div>
            </div>

            <hr style="border: 1px solid #ddd; margin: 20px 0;" />
            <p style="text-align: center; font-size: 14px;">हे चलन संगणकाद्वारे तयार केले आहे आणि अधिकृत आहे.</p>
        </div>
    `,h=document.createElement("div");h.innerHTML=f;const n={margin:[10,10,10,10],filename:`${a}-${c}.pdf`,image:{type:"jpeg",quality:1},html2canvas:{scale:2},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}};T().set(n).from(h).save()}function B(o,a,c,i,x,g){var m;const s=(m=z())==null?void 0:m.company_info;if(!s){console.error("Company Info not found.");return}const f=`
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <!-- Header Section -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div style="width: 40%;">
                    <img src="img/${s.logo}" alt="Company Logo" style="width: 100px;" />
                </div>
                <div style="text-align: right; width: 60%;">
                    <h2 style="margin: 0; font-size: 16px;">${s.company_name}</h2>
                    <p style="margin: 5px 0; font-size: 14px;">${s.land_mark}, ${s.Tal}, ${s.Dist}, ${s.pincode}</p>
                    <p style="margin: 5px 0; font-size: 14px;">Phone: ${s.phone_no}</p>
                </div>
            </div>

            <!-- Status Section -->
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="background-color: #d1e7dd; padding: 10px; border: 1px solid #b2d8cc; margin: 0; font-size: 16px;">${i.InvoiceStatus}</h3>
            </div>

            <!-- Customer and Invoice Details -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div style="width: 48%; padding: 10px; background-color: #f0f8ff; border: 1px solid #add8e6;">
                    <p style="font-size: 16px;"><strong>Customer Name:</strong> <span style="font-size: 14px;">${i.customer.name}</span></p>
                    <p style="font-size: 16px;"><strong>Customer Address:</strong> <span style="font-size: 14px;">${i.customer.address}</span></p>
                    <p style="font-size: 16px;"><strong>Mobile Number:</strong> <span style="font-size: 14px;">${i.customer.mobile}</span></p>
                </div>
                <div style="width: 48%; padding: 10px; background-color: #fff7e6; border: 1px solid #ffcc99;">
                    <p style="font-size: 16px;"><strong>Invoice Number:</strong> <span style="font-size: 14px;">${a}</span></p>
                    <p style="font-size: 16px;"><strong>Invoice Date:</strong> <span style="font-size: 14px;">${i.date.split("-").reverse().join("-")}</span></p>
                    ${i.InvoiceType===2?`<p style="font-size: 16px;"><strong>Delivery Date:</strong> <span style="font-size: 14px;">${i.DeliveryDate.split("-").reverse().join("-")}</span></p>`:""}
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
                    ${i.products.map((d,y)=>`
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${y+1}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${d.product_name}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${d.dPrice} /-</td>
                                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${d.dQty}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${d.total_price} /-</td>
                            </tr>
                        `).join("")}
                    <tr style="background-color: #f8f9fa;">
                        <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 16px;"><strong>Total</strong></td>
                        <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${o} /-</td>
                    </tr>
                </tbody>
            </table>

            <!-- Additional Details -->
            <div style="margin-bottom: 20px; padding: 10px; background-color: #e6ffe6; border: 1px solid #ccffcc;">
                <p style="font-size: 16px;"><strong>Amount Paid:</strong> <span style="font-size: 14px;">${i.amountPaid.toFixed(2)} /-</span></p>
                <p style="font-size: 16px;"><strong>Remaining Amount:</strong> <span style="font-size: 14px;">${x.toFixed(2)} /-</span></p>
                <p style="font-size: 16px;"><strong>Payment Mode:</strong> <span style="font-size: 14px;">${i.paymentMode}</span></p>
            </div>

            <p style="font-size: 16px;"><strong>Amount in Words:</strong> <span style="font-size: 14px;">${g} only</span></p>

            <!-- Footer Section -->
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <div style="width: 48%;">
                    <h4 style="font-size: 16px;">Bank Details</h4>
                    <p style="font-size: 14px;"><strong>Bank:</strong> ${s.bank_name}</p>
                    <p style="font-size: 14px;"><strong>Account Number:</strong> ${s.account_no}</p>
                    <p style="font-size: 14px;"><strong>IFSC Code:</strong> ${s.IFSC_code}</p>
                </div>
                <div style="text-align: center; width: 48%;">
                    <p style="font-size: 16px;"><strong>E-Signature</strong></p>
                    <img src="img/${s.sign}" alt="Signature" style="width: 100px; height: 50px;" />
                    <p style="font-size: 14px;">Authorized Signature</p>
                </div>
            </div>

            <hr style="border: 1px solid #ddd; margin: 20px 0;" />
            <p style="text-align: center; font-size: 14px;">This invoice is computer-generated and valid.</p>
        </div>
    `,h=document.createElement("div");h.innerHTML=f;const n={margin:[10,10,10,10],filename:`${a}-${c}.pdf`,image:{type:"jpeg",quality:1},html2canvas:{scale:2},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}};T().set(n).from(h).save()}const G=()=>{var $,w,S,I;const o=($=z())==null?void 0:$.company_info,a=P(),[c,i]=u.useState(0),[x,g]=u.useState(""),[s,f]=u.useState(0),{showToast:h}=_(),[n,m]=u.useState({customer:{},date:"",products:[],discount:"",amountPaid:0,paymentMode:"",InvoiceStatus:"",finalAmount:0,InvoiceNumber:"",status:"",DeliveryDate:"",InvoiceType:""}),d=t=>{const l=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"],p=["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],b=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];if(t===0)return"Zero";let r="";return t>=1e5&&(r+=d(Math.floor(t/1e3))+" Lakh ",t%=1e5),t>=1e3&&(r+=d(Math.floor(t/1e3))+" Thousand ",t%=1e3),t>=100&&(r+=l[Math.floor(t/100)]+" Hundred ",t%=100),t>=20&&(r+=b[Math.floor(t/10)]+" ",t%=10),t>=10&&(r+=p[t-10]+" ",t=0),t>0&&(r+=l[t]+" "),r.trim()},y=()=>{window.print()},k=async()=>{try{const t=await A("/api/order/"+a.id);let l=t.paymentType===0?"Cash":"Online (UPI/Bank Transfer)",p="";switch(t.orderStatus){case 0:p="Canceled Order";break;case 1:p="Delivered Order";break;case 2:p="Order Pending";break;default:p="Unknown Status";break}let b=t.discount||-1,r=Math.round(t.finalAmount),C=r-t.paidAmount;i(Math.max(0,C)),m({customer:t.customer,date:t.invoiceDate,products:t.items,discount:b,amountPaid:t.paidAmount,paymentMode:l,InvoiceStatus:p,finalAmount:r,InvoiceNumber:t.id,status:t.orderStatus,DeliveryDate:t.deliveryDate,InvoiceType:t.invoiceType}),f(r),g(d(r))}catch(t){h("danger","Error occurred "+t),console.error("Error fetching product data:",t)}};u.useEffect(()=>{k()},[a.id]);const N=t=>{const l=n.InvoiceNumber;t==="marathi"?W(s,l,n.customer.name,n,c,x):B(s,l,n.customer.name,n,c,x)};let v;return n.status===0?v=e.jsx("h5",{className:"text-danger ",children:n.InvoiceStatus}):n.status===1?v=e.jsx("h5",{className:"text-success ",children:n.InvoiceStatus}):n.status===2&&(v=e.jsx("h5",{className:"text-warning ",children:n.InvoiceStatus})),e.jsxs(F,{className:"mb-4",children:[e.jsx(M,{className:"no-print",children:e.jsx("strong",{children:"Invoice"})}),e.jsx(D,{children:e.jsxs(E,{className:"container-md invoice-content",children:[e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-4"}),e.jsx("div",{className:"col-4 text-center",children:v}),e.jsx("div",{className:"col-4"})]}),e.jsxs("div",{className:"d-flex flex-row mb-3",children:[e.jsx("div",{className:"flex-fill",children:e.jsx("img",{src:"img/"+o.logo,width:"150",height:"150",alt:"Logo"})}),e.jsx("div",{className:"flex-fill"}),e.jsxs("div",{className:"ml-3",children:[e.jsx("p",{children:o.company_name}),e.jsx("p",{children:o.land_mark}),e.jsxs("p",{children:[o.Tal,", ",o.Dist,", ",o.pincode]}),e.jsxs("p",{children:["Phone: ",o.phone_no]})]})]}),e.jsxs("div",{className:"row mt-10",children:[e.jsx("div",{className:"flex-fill col-6",children:e.jsxs("div",{className:"col-md-6",children:[e.jsx("h6",{style:{fontWeight:"bold"},children:"Invoice To:"}),e.jsxs("p",{style:{fontWeight:"bold"},children:["Customer Name: ",e.jsx("span",{children:(w=n.customer)==null?void 0:w.name})]}),e.jsxs("p",{style:{fontWeight:"bold"},children:["Customer Address: ",e.jsx("span",{children:(S=n.customer)==null?void 0:S.address})]}),e.jsxs("p",{style:{fontWeight:"bold"},children:["Mobile Number: ",e.jsx("span",{children:(I=n.customer)==null?void 0:I.mobile})]})]})}),e.jsx("div",{className:"col-2"}),e.jsx("div",{className:"col-4",children:e.jsxs("div",{className:"flex-fill col-md-8",children:[e.jsxs("h6",{style:{fontWeight:"bold"},children:["Invoice No: ",n.InvoiceNumber]}),e.jsxs("p",{style:{fontWeight:"bold"},children:["Invoice Date: ",e.jsx("span",{children:n.date})]}),n.InvoiceType===2&&e.jsxs("p",{style:{fontWeight:"bold"},children:["Delivery Date: ",e.jsx("span",{children:n.DeliveryDate})]})]})})]}),e.jsx("div",{className:"row section",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("table",{className:"table table-bordered border-black",children:[e.jsx("thead",{className:"table-success border-black",children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-center",children:"Sr No"}),e.jsx("th",{className:"text-center",children:"Item Name"}),e.jsx("th",{className:"text-center",children:"Price (Rs)"}),e.jsx("th",{className:"text-center",children:"Quantity"}),e.jsx("th",{className:"text-center",children:"Total (Rs)"})]})}),e.jsxs("tbody",{children:[n.products.map((t,l)=>e.jsxs("tr",{children:[e.jsx("td",{className:"text-center",children:l+1}),e.jsx("td",{className:"text-center",children:t.product_name}),e.jsxs("td",{className:"text-center",children:[t.dPrice," ₹ ",t.product_unit?` per ${t.product_unit}`:""]}),e.jsxs("td",{className:"text-center",children:[t.dQty,t.product_unit?` ${t.product_unit}`:""]}),e.jsxs("td",{className:"text-center",children:[t.total_price," ₹"]})]},l)),e.jsxs("tr",{children:[e.jsx("td",{colSpan:"4",children:"Grand Total"}),e.jsxs("td",{className:"text-center",children:[n.finalAmount," ₹"]})]})]})]})})}),e.jsx("div",{className:"row section",children:e.jsx("div",{className:"col-md-12 flex",children:e.jsxs("p",{children:["Total Amount (In Words):  ",e.jsxs("span",{children:[x," Rupees Only "]})]})})}),e.jsx("div",{className:"row section",children:e.jsx("div",{className:"col-md-12",children:e.jsx("table",{className:"table table-bordered border-black",children:e.jsxs("tbody",{children:[n.discount>0&&e.jsxs("tr",{children:[e.jsx("td",{children:"Discount (%):"}),e.jsxs("td",{children:[n.discount," %"]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Amount Paid:"}),e.jsxs("td",{children:[n.amountPaid," ₹"]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Balance Amount:"}),e.jsxs("td",{children:[c.toFixed(2)," ₹"]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Payment Mode:"}),e.jsx("td",{children:n.paymentMode})]})]})})})}),e.jsxs("div",{className:"d-flex border p-3 border-black",children:[e.jsx("div",{className:"flex-fill",children:e.jsxs("div",{className:"d-flex flex-column mb-3",children:[e.jsx("h6",{children:"Bank Details"}),e.jsx("p",{children:o.bank_name}),e.jsxs("p",{children:["Account No: ",o.account_no]}),e.jsxs("p",{children:["IFSC code: ",o.IFSC_code]})]})}),e.jsx("div",{className:"flex-fill",children:e.jsxs("div",{className:"d-flex flex-column align-items-center text-center ",children:[e.jsx("h6",{children:"E-SIGNATURE"}),e.jsx("img",{height:"100",width:"200",src:"img/"+o.sign,alt:"signature"}),e.jsx("p",{children:"Authorized Signature"})]})})]}),e.jsx("div",{className:"row section mt-3",children:e.jsx("div",{className:"col-md-12 text-center",children:e.jsx("p",{children:"This bill has been computer-generated and is authorized."})})}),e.jsxs("div",{className:"d-flex justify-content-center",children:[e.jsx(j,{color:"primary",variant:"outline",onClick:y,className:"d-print-none me-2",children:"Print"}),e.jsx(j,{color:"success",variant:"outline",onClick:()=>N("marathi"),className:"d-print-none me-2",children:"Download (Marathi)"}),e.jsx(j,{color:"success",variant:"outline",onClick:()=>N("english"),className:"d-print-none",children:"Download (English)"})]})]})})]})};export{G as default};
