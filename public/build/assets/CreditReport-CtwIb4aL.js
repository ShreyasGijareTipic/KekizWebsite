import{r as i,w as D,j as e}from"./index-Bg23EJBh.js";import{a as I,f as F,p as _}from"./api-8_quPuaU.js";import{a as H,c as b}from"./index.esm-8VmjjbFz.js";import{u as M,C as h}from"./DefaultLayout-ClwM_41s.js";import{C as $}from"./CRow-Cu5LofkQ.js";import{C as k}from"./CCol-YFH1-bI8.js";import{C as q,a as z}from"./CCardBody-Jm5-jwwI.js";import{C as K}from"./CCardHeader-VfQPesaz.js";import{C as U}from"./CForm-DKH37w0G.js";import{C as g}from"./CFormInput-DUEAMG4e.js";import{C as G,a as J,b as L,c as l,d as O,e as c}from"./CTable-DjHnk_Nw.js";import{c as Q}from"./cil-phone-4mwkG2LD.js";import{c as V}from"./cil-chat-bubble-De0T3Ux-.js";import"./cil-mobile-BTelR--Q.js";import"./CFormLabel-Cqbh7rjs.js";let S;const W=300,ue=()=>{var C,f;const[x,p]=i.useState([]),[E,d]=i.useState([]),[B,A]=i.useState(""),[j,y]=i.useState({}),{showToast:m}=D(),R=(f=(C=I())==null?void 0:C.company_info)==null?void 0:f.company_name,{t:r,i18n:P}=M("global");P.language,i.useEffect(()=>{(async()=>{try{const s=await F("/api/creditReport");if(s){const o=s.filter(n=>{var a;return n.totalPayment!==0||((a=n.items)==null?void 0:a.filter(T=>T.quantity>0).length)>0}).sort((n,a)=>n.name.localeCompare(a.name));p(o),d(o)}}catch(s){m("danger","Error occurred "+s)}})()},[]);const v=t=>{clearTimeout(S),S=setTimeout(()=>{(t==null?void 0:t.length)>0?d(x.filter(s=>s.name.toLowerCase().includes(t.toLowerCase()))):d(x)},W)},w=(t,s)=>{const{value:o}=t.target;y(n=>({...n,[s]:o}))},N=async t=>{const s=parseFloat(j[t]||0);if(isNaN(s)||s<=0){m("warning","Invalid return amount");return}try{await _(`/api/paymentTracker/${t}`,{returnAmount:-s})&&(m("success","Payment updated successfully"),p(n=>n.map(a=>a.customerId===t?{...a,totalPayment:a.totalPayment+s}:a)),d(n=>n.map(a=>a.customerId===t?{...a,totalPayment:a.totalPayment+s}:a)),y(n=>({...n,[t]:""})))}catch(o){m("danger","Error occurred: "+o.message)}};let u=0;return e.jsx($,{children:e.jsx(k,{xs:12,style:{padding:"2px"},children:e.jsxs(q,{className:"mb-4",children:[e.jsx(K,{children:e.jsx("strong",{children:r("LABELS.credit_report")})}),e.jsxs(z,{children:[e.jsx(U,{children:e.jsx(g,{type:"text",placeholder:r("LABELS.search"),value:B,onChange:t=>{A(t.target.value),v(t.target.value),t.preventDefault()}})}),e.jsx("div",{className:"table-responsive",children:e.jsxs(G,{children:[e.jsx(J,{children:e.jsxs(L,{children:[e.jsx(l,{scope:"col",className:"d-none d-sm-table-cell",children:r("LABELS.id")}),e.jsx(l,{scope:"col",children:r("LABELS.name")}),e.jsx(l,{scope:"col",className:"d-none d-sm-table-cell",children:r("LABELS.customer_id")}),e.jsxs(l,{scope:"col",children:[r("LABELS.total")," ₹"]}),e.jsx(l,{scope:"col",children:r("LABELS.return_items")}),e.jsx(l,{scope:"col",children:r("LABELS.actions")})]})}),e.jsxs(O,{children:[E.map((t,s)=>(u+=t.totalPayment,e.jsxs(L,{children:[e.jsx(c,{className:"d-none d-sm-table-cell",scope:"row",children:s+1}),e.jsx(c,{children:t.name}),e.jsx(c,{className:"d-none d-sm-table-cell",children:t.customerId}),e.jsx(c,{children:t.totalPayment>0?e.jsxs(e.Fragment,{children:[e.jsx(h,{color:"success",children:t.totalPayment})," ",e.jsx("br",{}),"(",r("LABELS.advance"),")"]}):e.jsx(h,{color:"danger",children:t.totalPayment*-1})}),e.jsx(c,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(g,{type:"number",step:"0.01",placeholder:"Enter return money",value:j[t.customerId]||"",onChange:o=>w(o,t.customerId),style:{width:"100px",marginRight:"8px"}}),e.jsx(H,{size:"sm",color:"warning",onClick:()=>N(t.customerId),children:r("LABELS.update_return")})]})}),e.jsxs(c,{children:[e.jsx("a",{className:"btn btn-outline-primary btn-sm",href:"tel:"+t.mobile,children:e.jsx(b,{icon:Q})})," ",e.jsx("a",{className:"btn btn-outline-success btn-sm",href:`sms:+${t.mobile}?body=Hello, There is an outstanding payment of Rs. ${t.totalPayment<0?-1*t.totalPayment:0}. Kindly pay it. From - ${R}`,children:e.jsx(b,{icon:V})})]})]},t.customerId+"_"+s))),e.jsxs("tr",{children:[e.jsx("td",{className:"d-none d-sm-table-cell"}),e.jsx("td",{className:"d-none d-sm-table-cell"}),e.jsxs("td",{children:[r("LABELS.total")," ₹"]}),e.jsx("td",{children:u>0?e.jsxs(e.Fragment,{children:[e.jsx(h,{color:"success",children:u})," ",e.jsx("br",{}),"(",r("LABELS.advance"),")"]}):e.jsx(h,{color:"danger",children:u*-1})}),e.jsx("td",{}),e.jsx("td",{})]})]})]})})]})]})})})};export{ue as default};
