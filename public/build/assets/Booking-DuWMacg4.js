import{r as n,w as X,x as Y,j as e}from"./index-Bg23EJBh.js";import{N as Z,Q as ee}from"./NewCustomerModal-Mrtv-Pma.js";import{f as N,h as te}from"./api-8_quPuaU.js";import{u as se,C as M}from"./DefaultLayout-ClwM_41s.js";import{C as ae}from"./CRow-Cu5LofkQ.js";import{C as re}from"./CCol-YFH1-bI8.js";import{C as oe,a as ne}from"./CCardBody-Jm5-jwwI.js";import{C as ie}from"./CCardHeader-VfQPesaz.js";import{C as le}from"./CForm-DKH37w0G.js";import{C as h}from"./CFormInput-DUEAMG4e.js";import{C as ce}from"./cil-mobile-BTelR--Q.js";import{C as i}from"./CFormLabel-Cqbh7rjs.js";import{C as de}from"./CFormSelect-CaG7Qby9.js";import{a as E}from"./index.esm-8VmjjbFz.js";import"./CModalTitle-CtLHuCtH.js";let I;const _e=()=>{var F;const[z,_]=n.useState(!1),[H,w]=n.useState(!1),[R,j]=n.useState(!1),[y,g]=n.useState([]),[v,P]=n.useState(),{showToast:d}=X(),[l,x]=n.useState({customer_id:0,lat:"",long:"",payLater:!1,isSettled:!1,invoiceDate:new Date().toISOString().split("T")[0],deliveryTime:`${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2,"0")}`,deliveryDate:"",invoiceType:2,items:[],totalAmount:0,orderStatus:2,discount:0,balanceAmount:0,paidAmount:0,finalAmount:0,paymentType:1}),[q,Q]=n.useState(!1),{showSpinner:C,hideSpinner:f}=Y(),[o,L]=n.useState({}),[G,S]=n.useState([]),{t:r}=se("global"),O=((t,s)=>function(...a){clearTimeout(I),I=setTimeout(()=>{t.apply(this,a)},s)})(async t=>{try{const s=await N("/api/searchCustomer?searchQuery="+t);s!=null&&s.length?S(s):S([])}catch(s){d("danger","Error occured "+s)}},750),V=t=>{const s=t.target.value;L({name:s}),s?O(s):S([])},B=t=>{L(t),x(a=>({...a,customer_id:t.id}));const s=T([...y],t.discount);g(s),k(s),S([]),J(t.id)},$=t=>{B(t),j(!1)},J=async t=>{try{C();const s=await N("/api/customerHistory?id="+t);s&&P(s)}catch(s){d("danger","Error occured "+s)}f()},T=(t,s)=>(t.forEach(a=>{a.sizes[0].dPrice=A(a,s)}),t),A=(t,s)=>{const a=t.sizes[0].oPrice??0,m=s||(o.discount??0),c=a-a*m/100;return Math.round(c)},K=async()=>{C();try{const t=await N("/api/product");g(T([...t.filter(s=>s.show==1&&s.showOnHome==1)]))}catch(t){d("danger","Error occured "+t)}f()},k=t=>{let s=0;t.forEach(a=>{s+=(a.dQty??0)*(a.sizes[0].dPrice??0)}),x(a=>({...a,totalAmount:s}))};n.useEffect(()=>{K()},[]);const b=t=>{const{name:s,value:a}=t.target;x({...l,[s]:a})},U=async t=>{try{if(t.preventDefault(),t.stopPropagation(),q)return;Q(!0);let s=!1,a={...l,deliveryDate:l.invoiceDate,finalAmount:l.totalAmount,items:[]};y.forEach(c=>{if(c.dQty>0||c.eQty>0){const u=c.sizes[0];let W={...c,product_sizes_id:u.id,size_name:u.name,size_local_name:u.localName,oPrice:u.oPrice,bPrice:u.bPrice,dPrice:u.dPrice,total_price:u.dPrice*c.dQty};a.items.push({...W})}}),a.invoiceType==1&&(a.orderStatus=1);const m=a.customer_id>0&&(a.paidAmount>0||a.items.length);!s&&m?(C(),(await te("/api/order",{...a})).id?(d("success",r("MSG.booking_is_done_msg")),D()):d("danger",'t("MSG.error_occured_msg")')):(_(!0),x(a),d("warning",r("MSG.provide_valid_data_msg")))}catch(s){d("danger","Error occured "+s)}f(),Q(!1)},D=async()=>{x({customer_id:0,lat:"",long:"",payLater:!1,isSettled:!1,invoiceDate:new Date().toISOString().split("T")[0],deliveryDate:"",deliveryTime:`${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2,"0")}`,invoiceType:2,items:[],totalAmount:0,discount:0,balanceAmount:0,paidAmount:0,finalAmount:0,paymentType:1,orderStatus:2});const t=[...y];t.forEach(s=>{s.eQty=0,s.dQty=0}),g([...t]),L({name:""}),P(void 0),_(!1)},p=(t,s,a)=>{const m=[...y];m[t][a]=s,g([...m]),k(m)};return e.jsxs(ae,{children:[e.jsx(Z,{hint:o.name,onSuccess:$,visible:R,setVisible:j}),e.jsx(ee,{visible:H,setVisible:w}),e.jsx(re,{xs:12,children:e.jsxs(oe,{className:"mb-4",children:[e.jsx(ie,{children:e.jsx("strong",{children:r("LABELS.booking")})}),e.jsx(ne,{children:e.jsxs(le,{noValidate:!0,validated:z,onSubmit:U,children:[e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-8",children:[e.jsx(h,{type:"text",id:"pname",placeholder:r("LABELS.customer_name"),name:"customerName",value:o.name,onChange:V,autoComplete:"off",feedbackInvalid:r("MSG.please_provide_name"),required:!0}),((F=o.name)==null?void 0:F.length)>0&&e.jsxs("ul",{className:"suggestions-list",children:[G.map((t,s)=>e.jsx("li",{onClick:()=>B(t),children:t.name},s)),!o.id&&e.jsx("li",{children:e.jsx(M,{role:"button",color:"danger",onClick:()=>j(!0),children:r("LABELS.new_customer")})})]})]}),e.jsx("div",{className:"col-4",children:e.jsx(M,{role:"button",color:"danger",style:{padding:"10px 8px",float:"right"},onClick:()=>j(!0),children:r("LABELS.new")})})]}),o.id&&e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-sm-12 mt-1",children:e.jsx(ce,{color:"success",children:e.jsxs("p",{children:[e.jsxs("strong",{children:[r("LABELS.name"),":"]})," ",o.name," (",o.mobile,") ",e.jsx("br",{}),o.address&&e.jsxs(e.Fragment,{children:[e.jsxs("strong",{children:[r("LABELS.address"),": "]})," ",o.address]}),v&&e.jsxs(e.Fragment,{children:[v.pendingPayment>0&&e.jsxs(e.Fragment,{children:[e.jsx("br",{}),r("LABELS.credit")," ",e.jsx("strong",{className:"text-danger",children:v.pendingPayment})," ",r("LABELS.rs"),"."]}),v.returnEmptyProducts.filter(t=>t.quantity>0).map(t=>e.jsxs(e.Fragment,{children:[e.jsx("br",{}),r("LABELS.collect")," ",e.jsxs("strong",{className:"text-danger",children:[" ",t.quantity," "]})," ",r("LABELS.empty"),"  ",e.jsxs("strong",{className:"text-danger",children:[" ",t.product_name," "]})]}))]})]})})})}),e.jsxs("div",{className:"row mt-2",children:[e.jsxs("div",{className:"col-sm-4 mb-3",children:[e.jsx(i,{htmlFor:"invoiceDate",children:r("LABELS.delivery_date")}),e.jsx(h,{type:"date",id:"invoiceDate",placeholder:"Pune",name:"invoiceDate",date:new Date,value:l.invoiceDate,onChange:b,required:!0,feedbackInvalid:r("MSG.please_select_date_msg")})]}),e.jsxs("div",{className:"col-sm-4 mb-3 pr-5",children:[e.jsx(i,{htmlFor:"deliveryTime",children:r("LABELS.delivery_time")}),e.jsx("div",{className:"input-group date",id:"timePicker",children:e.jsx("input",{type:"time",id:"deliveryTime",name:"deliveryTime",className:"form-control timePicker",value:l.deliveryTime,onChange:b})})]}),e.jsxs("div",{className:"col-sm-4 mb-3 pr-5",children:[e.jsx(i,{htmlFor:"invoiceType",children:r("LABELS.order_type")}),e.jsx(de,{"aria-label":"Select Product Type",name:"invoiceType",value:l.invoiceType,options:[{label:"Regular",value:1},{label:"Advance Booking",value:2}],onChange:b,required:!0,feedbackInvalid:"Please select type."})]})]}),y.map((t,s)=>e.jsxs("div",{className:"row bottom-border",children:[e.jsxs("div",{className:"col-6 mb-3 pr-5",children:[e.jsx(i,{htmlFor:"product",children:t.name}),e.jsxs("div",{className:"input-group",children:[e.jsx("button",{className:"btn btn-danger",type:"button",onClick:()=>{p(s,Math.max(0,(t.dQty??1)-1),"dQty")},children:"-"}),e.jsx(h,{type:"number",id:"dQty",placeholder:"0",name:"dQty",value:t.dQty,onChange:a=>{p(s,parseInt(a.target.value??"0"),"dQty")},min:"0"}),e.jsx("button",{className:"btn btn-success",type:"button",onClick:()=>{p(s,Math.max(0,(t.dQty??0)+1),"dQty")},children:"+"})]})]}),e.jsxs("div",{className:"col-3 mb-3 pr-5 d-none",children:[e.jsx(i,{htmlFor:"product",children:r("LABELS.rate")}),e.jsx(h,{type:"number",readOnly:!0,disabled:!0,value:t.sizes[0].oPrice})]}),e.jsxs("div",{className:"col-3 mb-3 pr-5",children:[e.jsx(i,{htmlFor:"product",children:r("LABELS.rate")}),e.jsx("br",{}),A(t)]}),e.jsxs("div",{className:"col-3 mb-3 pr-5",children:[e.jsx(i,{htmlFor:"product",children:r("LABELS.total")}),e.jsx("br",{}),A(t)*t.dQty||0]}),t.sizes[0].returnable===1&&e.jsxs("div",{className:"col-6 mb-3 pr-5 d-none",children:[e.jsxs(i,{htmlFor:"product",children:[r("LABELS.empty")," ",t.name," ",r("LABELS.collected")]}),e.jsxs("div",{className:"input-group",children:[e.jsx("button",{className:"btn btn-danger",type:"button",onClick:()=>p(s,Math.max(0,(t.eQty??0)-1),"eQty"),children:"-"}),e.jsx(h,{type:"number",id:"eQty",placeholder:"0",name:"eQty",value:t.eQty??0,onChange:a=>{p(s,parseInt(a.target.value??"0"),"eQty")},min:"0"}),e.jsx("button",{className:"btn btn-success",type:"button",onClick:()=>p(s,Math.max(0,(t.eQty??0)+1),"eQty"),children:"+"})]})]})]},t.id)),e.jsxs("div",{className:"side-by-side",children:[e.jsxs("div",{className:"col-sm-3 mb-3 pr-5",children:[e.jsx(i,{htmlFor:"totalAmount",children:r("LABELS.total_amount")}),e.jsx(h,{type:"number",id:"totalAmount",placeholder:"0",name:"totalAmount",readOnly:!0,disabled:!0,value:l.totalAmount,onChange:b})]}),e.jsxs("div",{className:"col-sm-3 mb-3 pr-5",children:[e.jsx(i,{htmlFor:"bPrice",children:r("LABELS.cash_collected")}),e.jsx(h,{type:"number",id:"paidAmount",placeholder:"0",name:"paidAmount",value:l.paidAmount,onChange:b})]})]}),e.jsxs("div",{className:"side-by-side",children:[e.jsx(E,{type:"submit",color:"success",children:r("LABELS.submit")}),"   ",e.jsx(E,{className:"mr-20",type:"button",onClick:D,color:"danger",children:r("LABELS.clear")}),"   ",e.jsx(E,{className:"mr-20",type:"button",onClick:()=>{w(!0)},color:"primary",children:r("LABELS.view_QR")})]})]})})]})})]})};export{_e as default};
