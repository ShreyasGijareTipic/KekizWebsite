import{r as S,w as W,j as e}from"./index-CWCk8Mfu.js";import{a as Y,f as F}from"./api-helnlucg.js";import{h as ee}from"./html2pdf-DEb3MY3B.js";import{a as P,c as te}from"./index.esm-CtJdof8l.js";import{u as re,C as $}from"./DefaultLayout-CWVqZZSL.js";import{C as se}from"./CRow-D5FXM-Wo.js";import{C as oe}from"./CCol-DELpJvbl.js";import{C as de,a as ae}from"./CCardBody-CjD5VXLl.js";import{C as le}from"./CCardHeader-DfyZxt5z.js";import{C as ne}from"./CForm-CjIivhzA.js";import{C as D}from"./CFormLabel-C5kMTk4Z.js";import{C as Q}from"./CFormInput-9pZ0Cm2L.js";import{C as ce}from"./cil-mobile-C0RpYdWd.js";import{C as M,a as I,b as _,c,d as O,e as i}from"./CTable-CUUuWsJ5.js";var ie=["512 512","<path fill='var(--ci-primary-color, currentColor)' d='M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z' class='ci-primary'/><polygon fill='var(--ci-primary-color, currentColor)' points='272.112 314.481 272.112 128 240.112 128 240.112 314.481 165.059 239.429 142.432 262.056 256.112 375.736 369.793 262.056 347.166 239.429 272.112 314.481' class='ci-primary'/>"],me=["512 512","<path fill='var(--ci-primary-color, currentColor)' d='M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z' class='ci-primary'/><polygon fill='var(--ci-primary-color, currentColor)' points='142.319 241.027 164.947 263.654 240 188.602 240 376 272 376 272 188.602 347.053 263.654 369.681 241.027 256 127.347 142.319 241.027' class='ci-primary'/>"];const w=j=>{const l={day:"numeric",month:"short",year:"numeric"},p=new Date(j).toLocaleDateString("en-US",l).replace(",",""),[n,L,g]=p.split(" ");return`${L} ${n} ${g}`};function pe(j){let[l,h]=j.split(":").map(Number);const p=l>=12?"PM":"AM";return l=l%12||12,`${l}:${h.toString().padStart(2,"0")} ${p}`}function he(j,l,h,p){var y,o,N,A,a,b;const n=(y=Y())==null?void 0:y.company_info,L=`
    <div style="font-family: 'NotoSansDevanagari', sans-serif; font-size: 12px;">
        <div style="text-align: center;">
            <img src="img/${n.logo}" alt="Logo" style="width: 40px; height: 40px; margin-bottom: 10px;">
            <h2 style="color: green;">Order Report</h2>
        </div>
        
        <div style="text-align: right;">
            <p><strong>${n.company_name}</strong></p>
            <p>${n.land_mark}</p>
            <p>${n.Tal}, ${n.Dist}, ${n.pincode}</p>
            <p>Phone: ${n.phone_no}</p>
        </div>
        
        <div>
            <h3>Invoice to:</h3>
            <p>Customer Name: ${((o=l.customer)==null?void 0:o.name)||"NA"}</p>
            <p>Customer Address: ${((N=l.customer)==null?void 0:N.address)||"NA"}</p>
            <p>Mobile Number: ${((A=l.customer)==null?void 0:A.mobile)||"NA"}</p>
            <p>Invoice No: NA</p>
            <p>Start Date: ${w(l.start_date)}</p>
            <p>End Date: ${w(l.end_date)}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd;">
            <thead>
                <tr style="background-color: #f2f2f2; text-align: center;">
                    <th style="border: 1px solid #ddd; padding: 5px;">Sr No</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">Delivery Date & Time</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">Items</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">Paid (Rs)</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">Pending (Rs)</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">Total (Rs)</th>
                    <th style="border: 1px solid #ddd; padding: 5px;">Delivered By</th>
                </tr>
            </thead>
            <tbody>
                ${h.map((m,f)=>`
                    <tr style="text-align: center;">
                        <td style="border: 1px solid #ddd; padding: 5px;">${f+1}</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">${w(m.deliveryDate)} (${pe(m.deliveryTime)})</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">
                            ${m.items.map(u=>`
                                ${u.product_name} ${u.dQty>0?`(${u.dQty} Delivered)`:""} ${u.eQty>0?`(${u.eQty} Collected)`:""}
                            `).join("<br>")}
                        </td>
                        <td style="border: 1px solid #ddd; padding: 5px;">${m.paidAmount}</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">${m.totalAmount-m.paidAmount}</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">${m.totalAmount}</td>
                        <td style="border: 1px solid #ddd; padding: 5px;">${m.user.name}</td>
                    </tr>`).join("")}
            </tbody>
        </table>

        <div style="margin-top: 20px;">
            <h4>Grand Total</h4>
            <p>Amount Paid: ${(j-p).toFixed(2)} /-</p>
            <p>Balance Amount: ${p.toFixed(2)} /-</p>
        </div>

        <div style="margin-top: 20px;">
            <h4>Bank Details</h4>
            <p>Bank Name: ${n.bank_name}</p>
            <p>Account No: ${n.account_no}</p>
            <p>IFSC Code: ${n.IFSC_code}</p>
            <div style="float: right; font-weight: bold; text-align: center;">
                <p>E-SIGNATURE</p>
                <img src="img/${n.sign}" alt="Signature" style="width: 35px; height: 20px;">
                <p>Authorized Signature</p>
            </div>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 10px;">
            <p>This bill has been computer-generated and is authorized.</p>
        </div>
    </div>`,g=document.createElement("div");g.innerHTML=L;const E={margin:[10,10,10,10],filename:`${(b=(a=l.customer)==null?void 0:a.name)==null?void 0:b.replace(" ","-")}-${new Date().getTime()}.pdf`,html2canvas:{scale:4},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}};ee().from(g).set(E).save()}let U;const Ne=()=>{const[j,l]=S.useState(!1),[h,p]=S.useState([]),[n,L]=S.useState([]),[g,E]=S.useState({}),{showToast:y}=W(),{t:o,i18n:N}=re("global"),A=N.language,[a,b]=S.useState({name:"",customer_id:"",start_date:"",end_date:""}),[m,f]=S.useState([]),u=t=>{const{name:r,value:s}=t.target;b({...a,[r]:s})},R=t=>{const r={};return t.forEach(s=>{const d=s.customer.name;r[d]||(r[d]={customer:s.customer,totalPaid:0,totalUnpaid:0,grandTotal:0,details:[],productTotals:{}}),r[d].totalPaid+=s.paidAmount,r[d].totalUnpaid+=s.totalAmount-s.paidAmount,r[d].grandTotal+=s.totalAmount,r[d].details.push(s),s.items.forEach(C=>{const v=A==="en"?C.product_name:C.product_local_name;r[d].productTotals[v]||(r[d].productTotals[v]={dQty:0,eQty:0}),r[d].productTotals[v].dQty+=C.dQty,r[d].productTotals[v].eQty+=C.eQty})}),Object.values(r)},G=async()=>{try{const t=await F(`/api/customerReport?id=${a.customer_id}&startDate=${a.start_date}&endDate=${a.end_date}`);t?(console.log(R(t)),L(R(t)),E({}),p(t)):p([])}catch(t){y("danger","Error occured "+t)}},H=async t=>{try{const r=t.currentTarget;t.preventDefault(),t.stopPropagation(),l(!0),r.checkValidity()&&await G()}catch{y("danger","Error occured "+error)}},k=((t,r)=>function(...s){clearTimeout(U),U=setTimeout(()=>{t.apply(this,s)},r)})(async t=>{try{const r=await F("/api/searchCustomer?searchQuery="+t);r!=null&&r.length?f(r):f([])}catch(r){y("danger","Error occured "+r)}},200),z=t=>{const r=t.target.value;b(s=>({...s,name:r,customer_id:r?s.customer_id:""})),r?k(r):setTimeout(()=>f([]),200)},Z=t=>{b(r=>({...r,customer:t,name:t.name,customer_id:t.id})),f([]),p([])};let T=0,B=0;const x={},V=()=>{h.length>0?he(T,a,h,T-B):y("danger","No report fetched to download")},q=t=>{const r={day:"numeric",month:"short",year:"numeric"},d=new Date(t).toLocaleDateString("en-US",r).replace(",",""),[C,v,K]=d.split(" ");return`${v} ${C} ${K}`};function X(t){let[r,s]=t.split(":").map(Number);const d=r>=12?"PM":"AM";return r=r%12||12,`${r}:${s.toString().padStart(2,"0")} ${d}`}const J=t=>{console.log("Data:",t),E(r=>({...r,[t]:!r[t]}))};return console.log("Reexecuted"),e.jsx(se,{children:e.jsx(oe,{xs:12,children:e.jsxs(de,{className:"mb-4",children:[e.jsx(le,{children:e.jsx("strong",{children:o("LABELS.customer_report")})}),e.jsxs(ae,{children:[e.jsxs(ne,{noValidate:!0,validated:j,onSubmit:H,children:[e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-1",children:[e.jsx(D,{htmlFor:"invoiceDate",children:o("LABELS.customer_name")}),e.jsx(Q,{type:"text",id:"pname",placeholder:o("MSG.enter_customer_name_msg"),name:"customerName",value:a.name,onChange:z,autoComplete:"off"}),m.length>0&&e.jsx("ul",{className:"suggestions-list",children:m.map((t,r)=>e.jsx("li",{onClick:()=>Z(t),children:t.name},r))})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-1",children:[e.jsx(D,{htmlFor:"invoiceDate",children:o("LABELS.start_date")}),e.jsx(Q,{type:"date",id:"start_date",name:"start_date",value:a.start_date,onChange:u,required:!0,feedbackInvalid:o("MSG.please_select_date_msg")})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-1",children:[e.jsx(D,{htmlFor:"invoiceDate",children:o("LABELS.end_date")}),e.jsx(Q,{type:"date",id:"end_date",name:"end_date",value:a.end_date,onChange:u,required:!0,feedbackInvalid:o("MSG.please_select_date_msg")})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-1 pt-2 mt-4",children:[e.jsx(P,{color:"success",type:"submit",children:o("LABELS.submit")})," ",h.length>0&&e.jsx(P,{onClick:V,color:"primary",children:o("LABELS.download")})]})})]}),a.customer&&a.customer_id&&e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-sm-12 mt-1",children:e.jsx(ce,{color:"success",children:e.jsxs("p",{children:[e.jsxs("strong",{children:[o("LABELS.name"),":"]})," ",a.customer.name," (",a.customer.mobile,") ",e.jsx("br",{}),a.customer.address&&e.jsxs(e.Fragment,{children:[e.jsxs("strong",{children:[o("LABELS.address"),": "]})," ",a.customer.address]})]})})})})]}),e.jsx("hr",{}),e.jsx("div",{className:"table-responsive",children:e.jsxs(M,{children:[e.jsx(I,{children:e.jsxs(_,{children:[e.jsx(c,{scope:"col",children:o("LABELS.id")}),e.jsx(c,{scope:"col",children:o("LABELS.name")}),e.jsx(c,{scope:"col",children:o("LABELS.products")}),e.jsx(c,{scope:"col",children:o("LABELS.paid")}),e.jsx(c,{scope:"col",children:o("LABELS.credit")}),e.jsx(c,{scope:"col",children:o("LABELS.total")})]})}),e.jsxs(O,{children:[n.map((t,r)=>(T+=t.grandTotal,B+=t.totalPaid,Object.keys(t.productTotals).forEach(s=>{x[s]?(x[s].dQty+=t.productTotals[s].dQty,x[s].eQty+=t.productTotals[s].eQty):x[s]={dQty:t.productTotals[s].dQty,eQty:t.productTotals[s].eQty}}),e.jsxs(e.Fragment,{children:[e.jsxs(_,{children:[e.jsx(c,{scope:"row",children:r+1}),e.jsxs(i,{children:[e.jsx("a",{className:"text-primary",children:e.jsx(te,{onClick:()=>J(t.customer.name),icon:g[t.customer.name]?me:ie})}),t.customer.name]}),e.jsx(i,{children:Object.keys(t.productTotals).length>0?e.jsx("table",{className:"table table-sm borderless",children:e.jsx("tbody",{children:Object.keys(t.productTotals).map(s=>e.jsxs("tr",{children:[e.jsx("td",{children:s}),e.jsx("td",{children:t.productTotals[s].dQty>0?t.productTotals[s].dQty:""}),e.jsx("td",{children:t.productTotals[s].eQty>0?t.productTotals[s].eQty+"("+o("LABELS.collected")+")":""})]},s))})}):"Only cash collected"}),e.jsx(i,{children:t.totalPaid>0?e.jsx($,{color:"success",children:t.totalPaid.toFixed(2)}):0}),e.jsx(i,{children:t.totalUnpaid>0?e.jsx($,{color:"danger",children:t.totalUnpaid.toFixed(2)}):0}),e.jsx(i,{children:t.grandTotal})]},t.customer.id),g[t.customer.name]&&e.jsx(_,{children:e.jsx(i,{colSpan:6,children:e.jsxs(M,{children:[e.jsx(I,{children:e.jsxs(_,{children:[e.jsx(c,{children:o("LABELS.date")}),e.jsx(c,{children:o("LABELS.time")}),e.jsx(c,{children:o("LABELS.products")}),e.jsx(c,{children:o("LABELS.paid")}),e.jsx(c,{children:o("LABELS.credit")}),e.jsx(c,{children:o("LABELS.total")}),e.jsx(c,{children:o("LABELS.delivered_by")})]})}),e.jsx(O,{children:t.details.map(s=>e.jsxs(_,{children:[e.jsx(i,{children:q(s.deliveryDate)}),e.jsx(i,{children:X(s.deliveryTime)}),e.jsx(i,{children:s.items.length>0?e.jsx("table",{className:"table table-sm borderless",children:e.jsx("tbody",{children:s.items.map(d=>e.jsxs("tr",{children:[e.jsx("td",{children:A==="en"?d.product_name:d.product_local_name}),e.jsx("td",{children:d.dQty>0?d.dQty+" X "+d.dPrice+"₹":""}),e.jsx("td",{children:d.eQty>0?d.eQty+"("+o("LABELS.collected")+")":""})]},d.id))})}):"Only cash collected"}),e.jsx(i,{children:s.paidAmount}),e.jsx(i,{className:"text-danger",children:s.totalAmount-s.paidAmount}),e.jsx(i,{children:s.totalAmount}),e.jsx(i,{children:s.user.name})]},s.id))})]})})})]}))),e.jsxs("tr",{children:[e.jsx("td",{className:"text-end",colSpan:2,children:o("LABELS.total")}),e.jsx("td",{className:"text-center",children:e.jsx("table",{className:"table table-sm borderless",children:e.jsx("tbody",{children:Object.keys(x).map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t}),e.jsx("td",{children:x[t].dQty+" ("+o("LABELS.given")+")"}),e.jsx("td",{children:x[t].eQty>0?x[t].eQty+" ("+o("LABELS.collected")+")":""})]},t))})})}),e.jsx("td",{children:e.jsx($,{color:"success",children:B})}),e.jsx("td",{children:e.jsx($,{color:"danger",children:T-B})}),e.jsx("td",{children:e.jsx($,{color:"primary",children:T})})]})]})]})})]})]})})})};export{Ne as default};
