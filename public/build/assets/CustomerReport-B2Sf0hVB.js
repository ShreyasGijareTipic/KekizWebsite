import{r as S,w as W,j as e}from"./index-OeoBNat3.js";import{a as Y,f as R}from"./api-8_quPuaU.js";import{h as ee}from"./html2pdf-DB9ELAm_.js";import{a as P,c as te}from"./index.esm-BSQayu9G.js";import{u as oe,C as T}from"./DefaultLayout-B6SAEV22.js";import{C as re}from"./CRow-B0v1wP3B.js";import{C as se}from"./CCol-BhG1DmFz.js";import{C as ae,a as de}from"./CCardBody-HZcxyyc1.js";import{C as le}from"./CCardHeader-D3QUcPyo.js";import{C as ne}from"./CForm-nOHKzzo5.js";import{C as w}from"./CFormLabel-DxfY1rNV.js";import{C as Q}from"./CFormInput-BMIMxTq1.js";import{C as ce}from"./cil-mobile-BLiG_LYI.js";import{C as M,a as I,b as _,c,d as k,e as i}from"./CTable-09JELt_N.js";var ie=["512 512","<path fill='var(--ci-primary-color, currentColor)' d='M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z' class='ci-primary'/><polygon fill='var(--ci-primary-color, currentColor)' points='272.112 314.481 272.112 128 240.112 128 240.112 314.481 165.059 239.429 142.432 262.056 256.112 375.736 369.793 262.056 347.166 239.429 272.112 314.481' class='ci-primary'/>"],me=["512 512","<path fill='var(--ci-primary-color, currentColor)' d='M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z' class='ci-primary'/><polygon fill='var(--ci-primary-color, currentColor)' points='142.319 241.027 164.947 263.654 240 188.602 240 376 272 376 272 188.602 347.053 263.654 369.681 241.027 256 127.347 142.319 241.027' class='ci-primary'/>"];const F=g=>{const n={day:"numeric",month:"short",year:"numeric"},p=new Date(g).toLocaleDateString("en-US",n).replace(",",""),[l,L,j]=p.split(" ");return`${L} ${l} ${j}`};function pe(g){let[n,h]=g.split(":").map(Number);const p=n>=12?"PM":"AM";return n=n%12||12,`${n}:${h.toString().padStart(2,"0")} ${p}`}function he(g,n,h,p){var y,s,N,A,d,b;const l=(y=Y())==null?void 0:y.company_info,L=`
    <div style="font-family: 'NotoSansDevanagari', sans-serif; font-size: 12px; color: #333;">
        <div style="display: flex; justify-content: space-between; align-items: center; background-color: #f1f8e9; padding: 10px;">
            <img src="img/${l.logo}" alt="Logo" style="width: 50px; height: 50px;">
            <h2 style="color: #4caf50; font-size: 24px; margin: 0; text-align: right;">${l.company_name}</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
            <div style="text-align: right; font-size: 14px;">
                <p style="font-weight: bold; color: #4caf50;">${l.company_name}</p>
                <p>${l.land_mark}, ${l.Tal}, ${l.Dist}, ${l.pincode}</p>
                <p>Phone: ${l.phone_no}</p>
            </div>

            <div style="margin-top: 20px;">
                <h3 style="font-size: 18px; color: #333;">Invoice to:</h3>
                <p>Customer Name: ${((s=n.customer)==null?void 0:s.name)||"NA"}</p>
                <p>Customer Address: ${((N=n.customer)==null?void 0:N.address)||"NA"}</p>
                <p>Mobile Number: ${((A=n.customer)==null?void 0:A.mobile)||"NA"}</p>
                <p>Invoice No: NA</p>
                <p>Start Date: ${F(n.start_date)}</p>
                <p>End Date: ${F(n.end_date)}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background-color: #4caf50; color: white; text-align: center;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Sr No</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Delivery Date & Time</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Items</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Paid (Rs)</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Pending (Rs)</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Total (Rs)</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Delivered By</th>
                    </tr>
                </thead>
                <tbody>
                    ${h.map((m,f)=>`
                        <tr style="background-color: ${f%2===0?"#fafafa":"#ffffff"}; text-align: center;">
                            <td style="padding: 10px; border: 1px solid #ddd;">${f+1}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${F(m.deliveryDate)} (${pe(m.deliveryTime)})</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">
                                ${m.items.map(x=>`
                                    ${x.product_name} ${x.dQty>0?`(${x.dQty} Delivered)`:""} ${x.eQty>0?`(${x.eQty} Collected)`:""}
                                `).join("<br>")}
                            </td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${m.paidAmount}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${m.totalAmount-m.paidAmount}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${m.totalAmount}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${m.user.name}</td>
                        </tr>`).join("")}
                </tbody>
            </table>

            <div style="margin-top: 30px; background-color: #f1f8e9; padding: 10px;">
                <h4 style="color: #4caf50;">Grand Total</h4>
                <p>Amount Paid: ${(g-p).toFixed(2)} /-</p>
                <p>Balance Amount: ${p.toFixed(2)} /-</p>
            </div>

            <div style="margin-top: 20px;">
                <h4 style="color: #4caf50;">Bank Details</h4>
                <p>Bank Name: ${l.bank_name}</p>
                <p>Account No: ${l.account_no}</p>
                <p>IFSC Code: ${l.IFSC_code}</p>
            </div>

            <div style="float: right; font-weight: bold; text-align: center; margin-top: 30px;">
                <p>E-SIGNATURE</p>
                <img src="img/${l.sign}" alt="Signature" style="width: 120px; height: 70px;">
                <p>Authorized Signature</p>
            </div>

            <div style="text-align: center; margin-top: 20px; font-size: 10px; color: #999;">
                <p>This bill has been computer-generated and is authorized.</p>
            </div>

            <div style="width: 100%; border-top: 1px solid #ccc; padding-top: 10px; text-align: center; font-size: 10px; color: #666;">
                <p>Page Generated on: ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </div>`,j=document.createElement("div");j.innerHTML=L;const E={margin:[10,10,10,10],filename:`${(b=(d=n.customer)==null?void 0:d.name)==null?void 0:b.replace(" ","-")}-${new Date().getTime()}.pdf`,html2canvas:{scale:4},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}};ee().from(j).set(E).save()}let z;const Ne=()=>{const[g,n]=S.useState(!1),[h,p]=S.useState([]),[l,L]=S.useState([]),[j,E]=S.useState({}),{showToast:y}=W(),{t:s,i18n:N}=oe("global"),A=N.language,[d,b]=S.useState({name:"",customer_id:"",start_date:"",end_date:""}),[m,f]=S.useState([]),D=t=>{const{name:o,value:r}=t.target;b({...d,[o]:r})},x=t=>{const o={};return t.forEach(r=>{const a=r.customer.name;o[a]||(o[a]={customer:r.customer,totalPaid:0,totalUnpaid:0,grandTotal:0,details:[],productTotals:{}}),o[a].totalPaid+=r.paidAmount,o[a].totalUnpaid+=r.totalAmount-r.paidAmount,o[a].grandTotal+=r.totalAmount,o[a].details.push(r),r.items.forEach(C=>{const v=A==="en"?C.product_name:C.product_local_name;o[a].productTotals[v]||(o[a].productTotals[v]={dQty:0,eQty:0}),o[a].productTotals[v].dQty+=C.dQty,o[a].productTotals[v].eQty+=C.eQty})}),Object.values(o)},U=async()=>{try{const t=await R(`/api/customerReport?id=${d.customer_id}&startDate=${d.start_date}&endDate=${d.end_date}`);t?(console.log(x(t)),L(x(t)),E({}),p(t)):p([])}catch(t){y("danger","Error occured "+t)}},G=async t=>{try{const o=t.currentTarget;t.preventDefault(),t.stopPropagation(),n(!0),o.checkValidity()&&await U()}catch{y("danger","Error occured "+error)}},O=((t,o)=>function(...r){clearTimeout(z),z=setTimeout(()=>{t.apply(this,r)},o)})(async t=>{try{const o=await R("/api/searchCustomer?searchQuery="+t);o!=null&&o.length?f(o):f([])}catch(o){y("danger","Error occured "+o)}},200),H=t=>{const o=t.target.value;b(r=>({...r,name:o,customer_id:o?r.customer_id:""})),o?O(o):setTimeout(()=>f([]),200)},Z=t=>{b(o=>({...o,customer:t,name:t.name,customer_id:t.id})),f([]),p([])};let $=0,B=0;const u={},V=()=>{h.length>0?he($,d,h,$-B):y("danger","No report fetched to download")},q=t=>{const o={day:"numeric",month:"short",year:"numeric"},a=new Date(t).toLocaleDateString("en-US",o).replace(",",""),[C,v,K]=a.split(" ");return`${v} ${C} ${K}`};function X(t){let[o,r]=t.split(":").map(Number);const a=o>=12?"PM":"AM";return o=o%12||12,`${o}:${r.toString().padStart(2,"0")} ${a}`}const J=t=>{console.log("Data:",t),E(o=>({...o,[t]:!o[t]}))};return console.log("Reexecuted"),e.jsx(re,{children:e.jsx(se,{xs:12,children:e.jsxs(ae,{className:"mb-4",children:[e.jsx(le,{children:e.jsx("strong",{children:s("LABELS.customer_report")})}),e.jsxs(de,{children:[e.jsxs(ne,{noValidate:!0,validated:g,onSubmit:G,children:[e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-1",children:[e.jsx(w,{htmlFor:"invoiceDate",children:s("LABELS.customer_name")}),e.jsx(Q,{type:"text",id:"pname",placeholder:s("MSG.enter_customer_name_msg"),name:"customerName",value:d.name,onChange:H,autoComplete:"off"}),m.length>0&&e.jsx("ul",{className:"suggestions-list",children:m.map((t,o)=>e.jsx("li",{onClick:()=>Z(t),children:t.name},o))})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-1",children:[e.jsx(w,{htmlFor:"invoiceDate",children:s("LABELS.start_date")}),e.jsx(Q,{type:"date",id:"start_date",name:"start_date",value:d.start_date,onChange:D,required:!0,feedbackInvalid:s("MSG.please_select_date_msg")})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-1",children:[e.jsx(w,{htmlFor:"invoiceDate",children:s("LABELS.end_date")}),e.jsx(Q,{type:"date",id:"end_date",name:"end_date",value:d.end_date,onChange:D,required:!0,feedbackInvalid:s("MSG.please_select_date_msg")})]})}),e.jsx("div",{className:"col-sm-3",children:e.jsxs("div",{className:"mb-1 pt-2 mt-4",children:[e.jsx(P,{color:"success",type:"submit",children:s("LABELS.submit")})," ",h.length>0&&e.jsx(P,{onClick:V,color:"primary",children:s("LABELS.download")})]})})]}),d.customer&&d.customer_id&&e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-sm-12 mt-1",children:e.jsx(ce,{color:"success",children:e.jsxs("p",{children:[e.jsxs("strong",{children:[s("LABELS.name"),":"]})," ",d.customer.name," (",d.customer.mobile,") ",e.jsx("br",{}),d.customer.address&&e.jsxs(e.Fragment,{children:[e.jsxs("strong",{children:[s("LABELS.address"),": "]})," ",d.customer.address]})]})})})})]}),e.jsx("hr",{}),e.jsx("div",{className:"table-responsive",children:e.jsxs(M,{children:[e.jsx(I,{children:e.jsxs(_,{children:[e.jsx(c,{scope:"col",children:s("LABELS.id")}),e.jsx(c,{scope:"col",children:s("LABELS.name")}),e.jsx(c,{scope:"col",children:s("LABELS.products")}),e.jsx(c,{scope:"col",children:s("LABELS.paid")}),e.jsx(c,{scope:"col",children:s("LABELS.credit")}),e.jsx(c,{scope:"col",children:s("LABELS.total")})]})}),e.jsxs(k,{children:[l.map((t,o)=>($+=t.grandTotal,B+=t.totalPaid,Object.keys(t.productTotals).forEach(r=>{u[r]?(u[r].dQty+=t.productTotals[r].dQty,u[r].eQty+=t.productTotals[r].eQty):u[r]={dQty:t.productTotals[r].dQty,eQty:t.productTotals[r].eQty}}),e.jsxs(e.Fragment,{children:[e.jsxs(_,{children:[e.jsx(c,{scope:"row",children:o+1}),e.jsxs(i,{children:[e.jsx("a",{className:"text-primary",children:e.jsx(te,{onClick:()=>J(t.customer.name),icon:j[t.customer.name]?me:ie})}),t.customer.name]}),e.jsx(i,{children:Object.keys(t.productTotals).length>0?e.jsx("table",{className:"table table-sm borderless",children:e.jsx("tbody",{children:Object.keys(t.productTotals).map(r=>e.jsxs("tr",{children:[e.jsx("td",{children:r}),e.jsx("td",{children:t.productTotals[r].dQty>0?t.productTotals[r].dQty:""}),e.jsx("td",{children:t.productTotals[r].eQty>0?t.productTotals[r].eQty+"("+s("LABELS.collected")+")":""})]},r))})}):"Only cash collected"}),e.jsx(i,{children:t.totalPaid>0?e.jsx(T,{color:"success",children:t.totalPaid.toFixed(2)}):0}),e.jsx(i,{children:t.totalUnpaid>0?e.jsx(T,{color:"danger",children:t.totalUnpaid.toFixed(2)}):0}),e.jsx(i,{children:t.grandTotal})]},t.customer.id),j[t.customer.name]&&e.jsx(_,{children:e.jsx(i,{colSpan:6,children:e.jsxs(M,{children:[e.jsx(I,{children:e.jsxs(_,{children:[e.jsx(c,{children:s("LABELS.date")}),e.jsx(c,{children:s("LABELS.time")}),e.jsx(c,{children:s("LABELS.products")}),e.jsx(c,{children:s("LABELS.paid")}),e.jsx(c,{children:s("LABELS.credit")}),e.jsx(c,{children:s("LABELS.total")}),e.jsx(c,{children:s("LABELS.delivered_by")})]})}),e.jsx(k,{children:t.details.map(r=>e.jsxs(_,{children:[e.jsx(i,{children:q(r.deliveryDate)}),e.jsx(i,{children:X(r.deliveryTime)}),e.jsx(i,{children:r.items.length>0?e.jsx("table",{className:"table table-sm borderless",children:e.jsx("tbody",{children:r.items.map(a=>e.jsxs("tr",{children:[e.jsx("td",{children:A==="en"?a.product_name:a.product_local_name}),e.jsx("td",{children:a.dQty>0?a.dQty+" X "+a.dPrice+"₹":""}),e.jsx("td",{children:a.eQty>0?a.eQty+"("+s("LABELS.collected")+")":""})]},a.id))})}):"Only cash collected"}),e.jsx(i,{children:r.paidAmount}),e.jsx(i,{className:"text-danger",children:r.totalAmount-r.paidAmount}),e.jsx(i,{children:r.totalAmount}),e.jsx(i,{children:r.user.name})]},r.id))})]})})})]}))),e.jsxs("tr",{children:[e.jsx("td",{className:"text-end",colSpan:2,children:s("LABELS.total")}),e.jsx("td",{className:"text-center",children:e.jsx("table",{className:"table table-sm borderless",children:e.jsx("tbody",{children:Object.keys(u).map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t}),e.jsx("td",{children:u[t].dQty+" ("+s("LABELS.given")+")"}),e.jsx("td",{children:u[t].eQty>0?u[t].eQty+" ("+s("LABELS.collected")+")":""})]},t))})})}),e.jsx("td",{children:e.jsx(T,{color:"success",children:B})}),e.jsx("td",{children:e.jsx(T,{color:"danger",children:$-B})}),e.jsx("td",{children:e.jsx(T,{color:"primary",children:$})})]})]})]})})]})]})})})};export{Ne as default};
