import React, { useEffect, useState } from 'react';
import './Invoice.css';
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react';
import { cilDelete, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getAPICall, post } from '../../../util/api';
import { useNavigate } from 'react-router-dom';
import QRCodeModal from '../../common/QRCodeModal';
import { useToast } from '../../common/toast/ToastContext';
import NewCustomerModal from '../../common/NewCustomerModal';
import CustomProductModal from '../../common/CustomProductModal';

import { useSpinner } from '../../common/spinner/SpinnerProvider';
import { useTranslation } from 'react-i18next';

// Debounce function
const debounce = (func, delay) => {
  let debounceTimer;
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};

// Search customer function
const searchCustomer = async (value, setSuggestions, showToast) => {
  try {
    const customers = await getAPICall('/api/searchCustomer?searchQuery=' + value);
    if (customers?.length) {
      setSuggestions(customers);
    } else {
      setSuggestions([]);
    }
  } catch (error) {
    showToast('danger', 'Error occurred ' + error);
  }
};

const Invoice = () => {
  const [validated, setValidated] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [suggestions, setSuggestions] = useState([]);
  
  const [customerHistory, setCustomerHistory] = useState()
  const [allProducts, setAllProducts] = useState()
  const [customerName, setCustomerName] = useState({
    name: '',
    mobile: '',
    address: '',
    id: null, // Ensure id is included for comparison
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customProduct, setCustomProduct] = useState({ name: '', size: '', price: 0, qty: 0 });
  const [showCustomOrderModal, setShowCustomOrderModal] = useState(false);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isOrderForOthers, setIsOrderForOthers] = useState(false);  // Track checkbox state
const [deliveryFor, setDeliveryFor] = useState("");  // Delivery options
const [deliveryName, setDeliveryName] = useState("");  // Recipient Name
const [deliveryBirthdate, setDeliveryBirthdate] = useState("");  // Recipient Birthdate


// Include relatives data in the order
const relatives = isOrderForOthers
  ? [{ name: deliveryName, relation: deliveryFor, birthdate: deliveryBirthdate }]
  : [];

  
  const [state, setState] = useState({
    customerName: '',
    company_id:null,
    customerId: null,
    invoiceType: 1,
    invoiceDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryFor: '',
    deliveryName: '',
    deliveryBirthdate: new Date().toISOString().split('T')[0],
    items: [{ product: '', size: '', price: 0, qty: 1 }],
    relative:[] ,
    totalAmount: 0,
    finalAmount: 0,
    balanceAmount: 0,
    discount: 0,
    paidAmount: 0,
    orderStatus: 1,
    payment_type : 0
  });
  const handleOrderForOthersChange = (e) => {
    setIsOrderForOthers(e.target.checked);
  };
  
  const handleDeliveryForChange = (e) => {
    setDeliveryFor(e.target.value);
  };
  
  const handleDeliveryNameChange = (e) => {
    setDeliveryName(e.target.value);
  };
  
  const handleDeliveryBirthdateChange = (e) => {
    setDeliveryBirthdate(e.target.value);
  };
  

  const { showSpinner, hideSpinner } = useSpinner();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation('global');

  
  const debouncedSearchCustomer = debounce((value) => {
    searchCustomer(value, setSuggestions, showToast);
  }, 750);

  const handleNameChange = (event) => {
    const value = event.target.value;
    setCustomerName({ name: value });
    setState((prevState) => ({ ...prevState, customerName: value }));
  
    if (value) {
      debouncedSearchCustomer(value);
    } else {
      // If user clears the field, reset the selected customer
      setCustomerName({ name: '', mobile: '', address: '', id: null });
      setState((prevState) => ({ ...prevState, customerId: null }));
      setSuggestions([]);
    }
  };
  

  const onCustomerAdded = (customer) => {
    handleSuggestionClick(customer);
    setShowCustomerModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Prevent negative values and ensure valid number input
    if (name === "paidAmount" && value < 0) return;
  
    setState((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : parseFloat(value) || 0, // Default to 0 if empty
    }));
  };
  
  

  // Update totals on state change
  useEffect(() => {
    calculateTotalAmount();
  }, [state.items]);
  
  useEffect(() => {
    calculateBilledAmount();
  }, [state.totalAmount, state.discount]);
  
  useEffect(() => {
    calculateBalanceAmount();
  }, [state.billedAmount, state.paidAmount]);
  
  // const calculateTotalAmount = () => {
  //   const total = state.items.reduce((acc, item) => acc + item.qty * item.price, 0);
  //   setState((prevState) => ({ ...prevState, totalAmount: total }));
  // };
  const calculateTotalAmount = () => {
    const total = state.items.reduce((acc, item) => acc + (item.total || 0), 0);
    console.log("🔄 Calculated Total:", total);  // Debugging log
    setState((prevState) => ({ ...prevState, totalAmount: total, finalAmount: total }));
  };
  
  
  const calculateBilledAmount = () => {
    const discountAmount = (state.totalAmount * state.discount) / 100;
    const billed = state.totalAmount - discountAmount;
    setState((prevState) => ({ ...prevState, billedAmount: billed }));
  };
  
  const calculateBalanceAmount = () => {
    const balance = state.billedAmount - state.paidAmount;
    setState((prevState) => ({ ...prevState, balanceAmount: balance }));
  };
  


  // const handleProductChange = (index, productId) => {
  //   if (!state.products) return; 
  //   const product = state.products.find((p) => p.id === productId);
  //   const updatedItems = [...state.items];
  //   updatedItems[index] = {
  //     ...updatedItems[index],
  //     product: productId,
  //     size: '',
  //     price: product?.price || 0,
  //     total: 0,
  //   };
  //   setState((prevState) => ({ ...prevState, items: updatedItems }));
  // };
  
  
  // const handleSizeChange = (index, sizeId) => {
  //   const product = state.products.find((p) => p.id === state.items[index].product);
  //   const size = product?.sizes.find((s) => s.id === sizeId);
  //   const updatedItems = [...state.items];
  //   updatedItems[index] = {
  //     ...updatedItems[index],
  //     size: sizeId,
  //     price: size?.price || 0,
  //     total: updatedItems[index].qty * (size?.price || 0),
  //   };
  //   setState((prevState) => ({ ...prevState, items: updatedItems }));
  // };
  
  // const handleQtyChange = (index, qty) => {
  //   const updatedItems = [...state.items];
  //   updatedItems[index] = {
  //     ...updatedItems[index],
  //     qty,
  //     total: qty * updatedItems[index].price,
  //   };
  //   setState((prevState) => ({ ...prevState, items: updatedItems }));
  // };

  const handleProductChange = (index, productId) => {
    if (!state.products) return;
    const product = state.products.find((p) => p.id === productId);
    const updatedItems = [...state.items];
    updatedItems[index] = {
      ...updatedItems[index],
      product: productId,
      size: '',
      price: product?.price || 0,
      total: (product?.price || 0) * updatedItems[index].qty,
    };
  
    setState((prevState) => ({ ...prevState, items: updatedItems }), () => {
      calculateTotalAmount(); // 🔥 Call immediately after state update
    });
  };
  
  const handleSizeChange = (index, sizeId) => {
    const product = state.products.find((p) => p.id === state.items[index].product);
    const size = product?.sizes.find((s) => s.id === sizeId);
    const updatedItems = [...state.items];
    updatedItems[index] = {
      ...updatedItems[index],
      size: sizeId,
      price: size?.price || 0,
      total: updatedItems[index].qty * (size?.price || 0),
    };
  
    setState((prevState) => ({ ...prevState, items: updatedItems }), () => {
      calculateTotalAmount(); // 🔥 Call immediately after state update
    });
  };
  
  const handleQtyChange = (index, qty) => {
    const updatedItems = [...state.items];
    updatedItems[index] = {
      ...updatedItems[index],
      qty,
      total: qty * updatedItems[index].price,
    };
  
    setState((prevState) => ({ ...prevState, items: updatedItems }), () => {
      calculateTotalAmount(); // 🔥 Call immediately after state update
    });
  };
  
  

  // Add new row
  const addNewRow = () => {
    setState((prevState) => ({
      ...prevState,
      items: [...prevState.items, { product: '', size: '', price: 0, qty: 0, total: 0 }],
    }));
  };
  
  const removeRow = (index) => {
    const updatedItems = state.items.filter((_, i) => i !== index);
    setState((prevState) => ({ ...prevState, items: updatedItems }));
  };

  const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.total;
    });
    return total;
  };

  const getCustomerHistory = async (customer_id)=>{
    try {
      //customerHistory
      const response = await getAPICall('/api/customerHistory?id=' + customer_id);
      if (response) {
        setCustomerHistory(response);
      }
    } catch (error) {
      showToast('danger', 'Error occured ' + error);
    }
  }

 

  // const handleSuggestionClick = (suggestion) => {
  //   // Update customer name and ID in state
  //   setCustomerName(suggestion.name);
  //   setState((prevState) => ({
  //     ...prevState,
  //     customerName: suggestion.name,
  //     customerId: suggestion.id,
  //   }));
  
  //   // Clear the suggestion list
  //   setSuggestions([]);
  
  //   // Fetch and display customer history
  //   getCustomerHistory(suggestion.id);
  // };

  const handleSuggestionClick = (suggestion) => {
    console.log("Selected Suggestion:", suggestion);
  
    setCustomerName(suggestion);
    console.log("Updated customerName:", suggestion);
  
    setState((prevState) => {
      const newState = { ...prevState, customerId: suggestion.id };
      console.log("Updated State:", newState);
      return newState;
    });
  
    const updatedProducts = discountedPrices([...allProducts], suggestion.discount);
    console.log("Updated Products with Discount:", updatedProducts);
    setAllProducts(updatedProducts);
  
    calculateTotal(updatedProducts);
  
    setSuggestions([]);
    console.log("Suggestions cleared");
  
    getCustomerHistory(suggestion.id);
    console.log("Fetching customer history for ID:", suggestion.id);
  };
  

  

  const discountedPrices = (products, discount) =>{
    products.forEach(p=>{
      p.sizes[0].dPrice = getDiscountedPrice(p, discount)
    })
    return products;
  }
 

  const calculateFinalAmount = (updatedState) => {
    const totalAmount = updatedState.items.reduce((acc, item) => acc + item.total, 0);
    const discountAmount = (totalAmount * updatedState.discount) / 100;
    const billedAmount = totalAmount - discountAmount;
    const balanceAmount = billedAmount - updatedState.paidAmount;

    return {
      ...updatedState,
      totalAmount,
      billedAmount,
      balanceAmount,
    };
  };


const handleCustomProductAdd = (customProduct) => {
  if (!customProduct.name || customProduct.name.trim() === "") {
    alert("Custom product name is required!");
    return;
  }
  if (!customProduct.size || customProduct.size.trim() === "") {
    alert("Custom product size is required!");
    return;
  }

  const newProduct = {
    id: Date.now(),
    name: customProduct.name,
    size: customProduct.size,
    price: customProduct.price,
    qty: customProduct.qty,
  };

  setState((prevState) => {
    let updatedItems = [...prevState.items];

    if (updatedItems.length === 1 && !updatedItems[0].product) {
      // ✅ Update first row instead of adding a new one
      updatedItems[0] = {
        ...newProduct, // ✅ Directly assign new product properties
        product: newProduct.id, 
        total: newProduct.price * newProduct.qty,
      };
    } else {
      // ✅ Otherwise, add a new row
      updatedItems.push({
        ...newProduct,
        product: newProduct.id,
        total: newProduct.price * newProduct.qty,
      });
    }

    return { ...prevState, items: updatedItems };
  });

  setShowCustomOrderModal(false);
};




const handleSubmit = async (e) => {
  e.preventDefault();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const company_id = userData ? userData?.user.company_id : null;
  const orderStatus = state.invoiceType === 1 ? 1 : 2;

  console.log("Form State Before Submission:", state);

  // Check if a customer is selected
  if (!state.customerId) {
    showToast('warning','Please select a customer or add a new customer');
    return;
  }

  const customProducts = state.items
    .filter(item => item.product.toString().length > 10)
    .map(item => ({
      name: item.name || "Custom Product",
      size: typeof item.size === "string" ? item.size : "Custom Size",
      price: item.price,
      qty: item.qty,
    }));

  const regularProducts = state.items
    .filter(item => item.product.toString().length <= 10)
    .map(item => ({
      product_id: item.product,
      product_size_id: typeof item.size === "number" ? item.size : null,
      qty: item.qty,
      price: item.price,
    }));

  // Prevent submission if no products exist
  if (regularProducts.length === 0 && customProducts.length === 0) {
    showToast('error','You must add at least one product before submitting the order.');
    return;
  }

  const orderData = {
    customer_id: state.customerId,
    company_id: company_id,
    total_amount: state.billedAmount,
    paid_amount: state.paidAmount,
    balance_amount: state.balanceAmount,
    order_status: orderStatus,
    discount: state.discount,
    delivery_date: state.deliveryDate,
    invoiceDate: state.invoiceDate || null,
    order_type: state.invoiceType,
    payment_type: state.payment_type,
    products: regularProducts,
    custom_products: customProducts.length > 0 ? customProducts : null,
  };

  console.log("Sending Order Data:", JSON.stringify(orderData, null, 2));

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Order created successfully:", data);

    if (data.order && data.order.id) {
      console.log("Redirecting to Invoice Page...");
      navigate(`/invoice-details/${data.order.id}`);
    } else {
      console.error("Order ID missing in response!");
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
};

  const handleClear = () => {
    setState({
      customerName: '',
      customerId: null,
      invoiceDate: new Date().toISOString().split('T')[0],
      items: [
        {
          product: '',
          size: '',
          price: 0,
          qty: 0,
          total: 0,
        },
      ],
      discount: 0,
      paidAmount: 0,
      balanceAmount: 0,
      billedAmount: 0,
      totalAmount: 0,
      products: [],
    });
    setSuggestions([]);
    setValidated(false);
    setShowQR(false);
    setErrorMessage(null);
  };
  

  const fetchProducts = async () => {
    try {
      showSpinner();
      const response = await getAPICall('/api/product');
      setAllProducts(discountedPrices([...response.filter((p) => p.show == 1)]));

      const formattedProducts = response.map((product) => ({
        id: product.id,
        name: product.name,
        sizes: product.sizes.map((size) => ({
          id: size.id,
          name: size.size,
          price: size.oPrice,
        })),
      }));
      setState((prevState) => ({ ...prevState, products: formattedProducts }));
    } catch (error) {
      showToast('danger', 'Error fetching products.');
    } finally {
      hideSpinner();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  

  return (
     <CRow>
          <NewCustomerModal hint={customerName.name} onSuccess={onCustomerAdded} visible={showCustomerModal} setVisible={setShowCustomerModal} />
          <QRCodeModal visible={showQR} setVisible={setShowQR}></QRCodeModal>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>{t('invoice.new_invoice')}</strong>
              </CCardHeader>
              <CCardBody>
                <CForm noValidate validated={validated} onSubmit={handleSubmit}>
                  <div className="row mb-2">
                    <div className="col-9">
                      <CFormInput
                        type="text"
                        id="pname"
                        placeholder={t('invoice.customer_name')}
                        name="customerName"
                        value={customerName.name}
                        onChange={handleNameChange}
                        autoComplete="off"
                        required
                      />
                      {customerName.name && customerName.name.length > 0 && (
                    <ul className="suggestions-list">
                      {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                          {suggestion.name} ({suggestion.mobile})
                        </li>
                      ))}
                      {!customerName.id && (
                        <li>
                          <CBadge role="button" color="danger" onClick={() => setShowCustomerModal(true)}>
                            {t('invoice.new_customer')}
                          </CBadge>
                        </li>
                      )}
                    </ul>
                  )}

                    </div>
                    {/* <div className="col-3">
                      <CBadge role="button" color="danger" onClick={() => setShowCustomerModal(true)}>
                        {t('invoice.new_customer')}
                      </CBadge>
                    </div> */}
                  </div>
                  {customerName.id && (
                    <div className="row">
                      <div className="col-sm-12 mt-1">
                        <CAlert color="success">
                          <p>
                            <strong>{t('invoice.name')}:</strong> {customerName.name} ({customerName.mobile}) <br />
                            {customerName.address && (
                              <>
                                <strong>{t('invoice.address')}: </strong> {customerName.address}
                              </>
                            )}
                            
                          </p>
                        </CAlert>
                      </div>
                    </div>
                  )}
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="invoiceType">{t('invoice.invoice_type')}</CFormLabel>
                    <CFormSelect
                      aria-label={t('invoice.select_invoice_type')}
                      name="invoiceType"
                      value={state.invoiceType}
                      options={[
                        {
                          label: t('invoice.regular'),
                          value: 1,
                        },
                        {
                          label: t('invoice.advance_booking'),
                          value: 2,
                        },
                      ]}
                      onChange={handleChange}
                      required
                      feedbackInvalid={t('invoice.select_type')}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel htmlFor="invoiceDate">{t('invoice.invoice_date')}</CFormLabel>
                    <CFormInput
                      type="date"
                      id="invoiceDate"
                      placeholder={t('invoice.pune')}
                      name="invoiceDate"
                      value={state.invoiceDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]} 
                      required
                      feedbackInvalid={t('invoice.select_date')}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  {state.invoiceType == 2 && (
                    <div className="mb-3">
                      <CFormLabel htmlFor="deliveryDate">{t('invoice.delivery_date')}</CFormLabel>
                      <CFormInput
                        type="date"
                        id="deliveryDate"
                        placeholder={t('invoice.pune')}
                        name="deliveryDate"
                        min={new Date().toISOString().split('T')[0]} 
                        value={state.deliveryDate}
                        onChange={handleChange}
                        required={state.invoiceType == 2}
                        feedbackInvalid={t('invoice.select_date')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Checkbox for "Order for Others" */}
            <div className="mb-3">
              <CFormCheck
                id="orderForOthers"
                label="Delivery For Other"
                checked={isOrderForOthers}
                onChange={handleOrderForOthersChange}
              />
            </div>

            {/* Conditional delivery fields */}
            {isOrderForOthers && (
              <>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <CFormLabel htmlFor="deliveryFor">Delivery For</CFormLabel>
                      <CFormSelect
                        id="deliveryFor"
                        value={deliveryFor}
                        onChange={handleDeliveryForChange}
                      >
                        <option value="">Select</option>
                        <option value="spouse">Spouse</option>
                        <option value="family">Family</option>
                        <option value="friend">Friend</option>
                      </CFormSelect>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <CFormLabel htmlFor="deliveryName">Name</CFormLabel>
                      <CFormInput
                        type="text"
                        id="deliveryName"
                        name="deliveryName"
                        value={deliveryName}
                        onChange={handleDeliveryNameChange}
                        placeholder="Please Enter Name"
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <CFormLabel htmlFor="deliveryBirthdate">Birthdate</CFormLabel>
                      <CFormInput
                        type="date"
                        id="deliveryBirthdate"
                        name="deliveryBirthdate"
                        value={deliveryBirthdate}
                        onChange={handleDeliveryBirthdateChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            
{/* Desktop View (Table Format) */}
<div className="d-none d-md-block table-responsive">
  <table className="table table-bordered">
    <thead>
      <tr>
        <th>Product</th>
        <th>Size</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total Price</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(state.items) && state.items.length > 0 ? (
        state.items.map((item, index) => {
          const selectedProduct = Array.isArray(state.products)
            ? state.products.find((p) => p.id === item.product)
            : null;
          const sizes = selectedProduct ? selectedProduct.sizes : [];

          return (
            <tr key={index}>
              <td>
                {item.name ? (
                  <span>{item.name}</span>
                ) : (
                  <CFormSelect
                    value={item.product || ""}
                    onChange={(e) => handleProductChange(index, parseInt(e.target.value))}
                  >
                    <option value="">Select Product</option>
                    {Array.isArray(state.products) &&
                      state.products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                  </CFormSelect>
                )}
              </td>

              <td>
                {item.name ? (
                  <span>{typeof item.size === "string" ? item.size : sizes.find((size) => size.id === item.size)?.name || "No Size Selected"}</span>
                ) : (
                  <CFormSelect
                    value={item.size || ""}
                    onChange={(e) => handleSizeChange(index, parseInt(e.target.value))}
                    disabled={!item.product || sizes.length === 0}
                  >
                    <option value="">Select Size</option>
                    {sizes.map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.name}
                      </option>
                    ))}
                  </CFormSelect>
                )}
              </td>

              <td>{item.price || '-'}</td>
              <td>
                <CFormInput
                  type="number"
                  value={item.qty === 0 ? "" : item.qty} 
                  placeholder="0"
                  onFocus={(e) => e.target.value === "0" && (e.target.value = "")} // Clear if it's 0
                  onBlur={(e) => e.target.value === "" && handleQtyChange(index, 0)} // Reset to 0 if left blank
                  onChange={(e) => handleQtyChange(index, parseInt(e.target.value, 10) || 0)}
                />
              </td>

              <td>{(item.price * (item.qty || 1)).toFixed(2)} ₹</td>
              <td>
                <div className="d-flex">
                  {state.items.length > 1 && (
                    <CButton color="danger" onClick={() => removeRow(index)}>
                      <CIcon icon={cilDelete} size="sm" />
                    </CButton>
                  )}
                  {index === state.items.length - 1 && (
                    <CButton color="success" onClick={addNewRow}>
                      <CIcon icon={cilPlus} size="sm" />
                    </CButton>
                  )}
                </div>
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="6" className="text-center">No items found</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* Mobile View (Stacked Layout) */}
<div className="d-block d-md-none">
  {Array.isArray(state.items) && state.items.length > 0 ? (
    state.items.map((item, index) => {
      const selectedProduct = Array.isArray(state.products)
        ? state.products.find((p) => p.id === item.product)
        : null;
      const sizes = selectedProduct ? selectedProduct.sizes : [];

      return (
        <div key={index} className="bg-light rounded p-3 my-3">
          <div className="d-flex justify-content-between">
            <div style={{ flex: 1 }}>
              <label className="font-weight-bold">Product:</label>
              {item.name ? (
                <p>{item.name}</p>
              ) : (
                <CFormSelect
                  value={item.product || ""}
                  onChange={(e) => handleProductChange(index, parseInt(e.target.value))}
                >
                  <option value="">Select Product</option>
                  {Array.isArray(state.products) &&
                    state.products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                </CFormSelect>
              )}
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
              <label className="font-weight-bold">Size:</label>
              {item.name ? (
                <p>{typeof item.size === "string" ? item.size : sizes.find((size) => size.id === item.size)?.name || "No Size Selected"}</p>
              ) : (
                <CFormSelect
                  value={item.size || ""}
                  onChange={(e) => handleSizeChange(index, parseInt(e.target.value))}
                  disabled={!item.product || sizes.length === 0}
                >
                  <option value="">Select Size</option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </CFormSelect>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div style={{ flex: 1 }}>
              <label className="font-weight-bold">Price:</label>
              <p>{item.price || "-"}</p>
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
              <label className="font-weight-bold">Quantity:</label>
              <CFormInput
                type="number"
                value={item.qty === 0 ? "" : item.qty} // Show blank when clicked
                placeholder="0" // Display 0 as a hint
                onFocus={(e) => e.target.value === "0" && (e.target.value = "")} // Clear if it's 0
                onBlur={(e) => e.target.value === "" && handleQtyChange(index, 0)} // Reset to 0 if left blank
                onChange={(e) => handleQtyChange(index, parseInt(e.target.value, 10) || 0)}
                style={{ width: '80px', padding: '5px', fontSize: '14px' }}
              />
            </div>

            <div className="d-flex justify-content-end mt-3">
              {state.items.length > 1 && (
                <CButton color="danger" onClick={() => removeRow(index)}>
                  <CIcon icon={cilDelete} size="sm" />
                </CButton>
              )}
              {index === state.items.length - 1 && (
                <CButton color="success" onClick={addNewRow} className="ms-2">
                  <CIcon icon={cilPlus} size="sm" />
                </CButton>
              )}
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <div className="text-center">No items found</div>
  )}
</div>




              <div className="d-flex justify-content-between" style={{marginBottom: '13px'}}>
                <CButton color="primary" onClick={() => setShowCustomOrderModal(true)}>
                  Customize Order
                </CButton>
                <CCol className="text-end" style={{ marginRight: '30px' }}>
                  <h6>Total: ₹{state.totalAmount}</h6>
                </CCol>
              </div>
              

                    


              {/* Payment and Final Actions */}
              <div>
                <CRow>
                  <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="payment_type">Payment Type</CFormLabel>
                    <CFormSelect
                      id="payment_type"
                      name="payment_type"
                      value={state.payment_type}
                      onChange={handleChange}
                    >
                      <option value={0}>{t('invoice.cash')}</option>
                      <option value={1}>{t('invoice.online')}</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
              </div>
              {/* Payment info */}
              <div className="row">
                <div className="col-sm-2">
                  <div className="mb-3">
                    <CFormLabel htmlFor="discount">{t('invoice.discount')} (%)</CFormLabel>
                    <CFormInput
                      type="number"
                      id="discount"
                      placeholder="0"
                      name="discount"
                      value={state.discount === 0 ? '' : state.discount} // Blank when discount is 0
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Math.max(0, Math.min(100, e.target.value)); // Blank when empty, otherwise limit between 0 and 100
                        handleChange({ target: { name: 'discount', value } });
                      }}
                    />
                  </div>
                </div>
                <div className="col-sm-3">
                <div className="mb-3">
                  <CFormLabel htmlFor="paidAmount">{t('invoice.paid_amount')} (Rs)</CFormLabel>
                  <CFormInput
                    type="number"
                    id="paidAmount"
                    placeholder="0"
                    name="paidAmount"
                    value={state.paidAmount === 0 ? '' : state.paidAmount} // Blank when paidAmount is 0
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Math.max(0, e.target.value); // Blank when empty, otherwise ensure it's 0 or greater
                      handleChange({ target: { name: 'paidAmount', value } });
                    }}
                  />
                </div>
                </div>

                <div className="col-sm-3">
                  <div className="mb-3">
                    <CFormLabel htmlFor="paidAmount">{t('invoice.balance_amount')} (Rs)</CFormLabel>
                    <CFormInput
                      type="number"
                      id="balanceAmount"
                      placeholder=""
                      readOnly
                      name="balanceAmount"
                      value={state.balanceAmount}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="mb-3">
                    <CFormLabel htmlFor="finalAmount">{t('invoice.final_amount')} (Rs)</CFormLabel>
                    <CFormInput
                      type="number"
                      id="finalAmount"
                      placeholder=""
                      name="finalAmount"
                      readOnly
                      value={state.billedAmount}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                {errorMessage && (
                  <CRow>
                    <CAlert color="danger">{errorMessage}</CAlert>
                  </CRow>
                )}
              </div>
              <div className="mb-3 mt-3">
                <CButton color="success" type="submit">
                  {t('invoice.submit')}
                </CButton>
                &nbsp;
                <CButton color="secondary" onClick={handleClear}>
                  {t('invoice.clear')}
                </CButton>
                &nbsp;
                {state.payment_type == 1 && (
                  <CButton className="mr-20" type="button" onClick={() => setShowQR(true)} color="primary">
                    {t('invoice.view_qr')}
                  </CButton>
                )}
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      {/* Custom Product Modal */}
      <CustomProductModal
        visible={showCustomOrderModal}
        setVisible={setShowCustomOrderModal}
        onAddProduct={handleCustomProductAdd}
      />
    </CRow>
    
  )
}


export default Invoice;
