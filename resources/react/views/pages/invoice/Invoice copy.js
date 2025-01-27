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
  const [customerName, setCustomerName] = useState({});
  const [customerHistory, setCustomerHistory] = useState()
  const [allProducts, setAllProducts] = useState()

  const [selectedCustomer, setSelectedCustomer] = useState(null); // Store selected customer details
  const [customProduct, setCustomProduct] = useState({ name: '', size: '', price: 0, qty: 0 });
  const [showCustomOrderModal, setShowCustomOrderModal] = useState(false);

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [state, setState] = useState({
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

  const { showSpinner, hideSpinner } = useSpinner();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation('global');

  // Debounced version of searchCustomer
  const debouncedSearchCustomer = debounce((value) => {
    searchCustomer(value, setSuggestions, showToast);
  }, 750);

  const handleNameChange = (event) => {
    const value = event.target.value;
    setState((prevState) => ({ ...prevState, customerName: value }));
    if (value) {
      debouncedSearchCustomer(value);
    } else {
      setSuggestions([]);
    }
  };

  const onCustomerAdded = (customer) => {
    handleSuggestionClick(customer);
    setShowCustomerModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
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


  const calculateTotalAmount = () => {
    const total = state.items.reduce((acc, item) => acc + item.qty * item.price, 0);
    setState((prevState) => ({ ...prevState, totalAmount: total }));
  };

  // Helper: Calculate billed amount
  const calculateBilledAmount = () => {
    const discountAmount = (state.totalAmount * state.discount) / 100;
    const billed = state.totalAmount - discountAmount;
    setState((prevState) => ({ ...prevState, billedAmount: billed }));
  };

  // Helper: Calculate balance amount
  const calculateBalanceAmount = () => {
    const balance = state.billedAmount - state.paidAmount;
    setState((prevState) => ({ ...prevState, balanceAmount: balance }));
  };

  // const addNewRow = () => {
  //   setState({
  //     ...state,
  //     items: [...state.items, { product: '', size: '', price: 0, qty: 0, total: 0 }],
  //   });
  // };

  // const removeRow = (index) => {
  //   if (state.items.length > 1) {
  //     const updatedItems = [...state.items];
  //     updatedItems.splice(index, 1);
  //     setState({ ...state, items: updatedItems });
  //   }
  // };

  const handleProductChange = (index, productId) => {
    const product = state.products.find((p) => p.id === productId);
    const updatedItems = [...state.items];
    updatedItems[index] = {
      ...updatedItems[index],
      product: productId,
      size: '',
      price: product?.price || 0,
      total: 0,
    };
    setState((prevState) => ({ ...prevState, items: updatedItems }));
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
    setState((prevState) => ({ ...prevState, items: updatedItems }));
  };

  const handleQtyChange = (index, qty) => {
    const updatedItems = [...state.items];
    updatedItems[index] = {
      ...updatedItems[index],
      qty,
      total: qty * updatedItems[index].price,
    };
    setState((prevState) => ({ ...prevState, items: updatedItems }));
  };

  // Add new row
  const addNewRow = () => {
    setState((prevState) => ({
      ...prevState,
      items: [...prevState.items, { product: '', size: '', price: 0, qty: 0, total: 0 }],
    }));
  };

  // Remove row
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

  // const calculateFinalAmount = (old) => {
  //   // Calculate the total amount of all items (before discount)
  //   const totalAmount = calculateTotal(old.items);

  //   // Apply the discount to calculate the billed amount
  //   const discountAmount = (totalAmount * old.discount) / 100;
  //   const billedAmount = totalAmount - discountAmount;

  //   // Update state with the calculated amounts
  //   old.totalAmount = totalAmount;
  //   old.billedAmount = billedAmount;
  //   old.balanceAmount = billedAmount - old.paidAmount;

  //   return old;
  // };

  const handleSuggestionClick = (suggestion) => {
    setCustomerName(suggestion);  // Update customer name
    setState((prev) => ({ ...prev, customer_id: suggestion.id }));  // Update state with customer ID
    const updatedProducts = discountedPrices([...allProducts], suggestion.discount);
    setAllProducts(updatedProducts);  // Update all products with discount
    calculateTotal(updatedProducts);  // Calculate the total price
    setSuggestions([]);  // Clear the suggestion list
    getCustomerHistory(suggestion.id);  // Fetch customer history
};


  const discountedPrices = (products, discount) =>{
    products.forEach(p=>{
      p.sizes[0].dPrice = getDiscountedPrice(p, discount)
    })
    return products;
  }
  // const calculateTotal = (items) => {
  //   let total = 0
  //   items.forEach((item) => {
  //     total += item.total_price
  //   })
  //   return total
  // }

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


  const handleCustomProductAdd = (product, customName, customSize) => {
    const newProduct = {
      ...product,
      total: product.qty * product.price,
      id: Date.now(),
      name: customName || product.name,
      size: customSize || product.size,
    };

    setShowCustomOrderModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const remainingBalance = state.billedAmount - state.paidAmount;

    if (!state.customerId) {
      showToast('warning', 'Please select or add a customer.');
      return;
    }

    if (state.items.length === 0 || state.items.every((item) => item.qty <= 0)) {
      showToast('warning', 'Please add at least one product with a quantity greater than zero.');
      return;
    }

    try {
      showSpinner();
      const response = await post('/api/order', { ...state, balanceAmount: remainingBalance });
      if (response) {
        showToast('success', 'Order placed successfully.');
        navigate('/invoice-details/' + response.id);
      } else {
        showToast('danger', 'Error placing the order.');
      }
    } catch (error) {
      showToast('danger', 'Error while placing the order.');
    } finally {
      hideSpinner();
    }
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
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{t('invoice.new_invoice')}</strong>
            </CCardHeader>
            <CCardBody>
              <CForm noValidate onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>{t('invoice.customer_name')}</CFormLabel>
                    <CFormInput
                      type="text"
                      name="customerName"
                      value={state.customerName}
                      onChange={handleChange}
                      list="customerSuggestions"
                    />
                    <datalist id="customerSuggestions">
                      {suggestions.map((suggestion, index) => (
                        <option key={index} value={suggestion} />
                      ))}
                    </datalist>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>{t('invoice.invoice_type')}</CFormLabel>
                    <CFormSelect
                      name="invoiceType"
                      value={state.invoiceType}
                      onChange={handleChange}
                    >
                      <option value="1">{t('invoice.regular')}</option>
                      <option value="2">{t('invoice.custom')}</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>{t('invoice.invoice_date')}</CFormLabel>
                    <CFormInput
                      type="date"
                      name="invoiceDate"
                      value={state.invoiceDate}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <div className="table-responsive mb-3">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Product</th>
                                      <th>Size</th>
                                      <th>Price</th>
                                      <th>Qty.</th>
                                      <th>Total</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                  {state.items.map((item, index) => {
                    const selectedProduct = state.products.find((p) => p.id === item.product);
                    const sizes = selectedProduct?.sizes || []; 
                
                    return (
                      <tr key={index}>
                        {/* Product Selection */}
                        <td>
                          <CFormSelect
                            value={item.product}
                            onChange={(e) => handleProductChange(index, parseInt(e.target.value))}
                          >
                            <option value="">Select Product</option>
                            {state.products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </td>
                
                        {/* Size Selection */}
                        <td>
                        <CFormSelect
                            value={item.size} // Assuming 'size' represents the selected size's ID
                            onChange={(e) => handleSizeChange(index, parseInt(e.target.value))}
                            disabled={!item.product} // Disable if no product is selected
                          >
                            <option value="">Select Size</option>
                            {state.products
                              .find((p) => p.id === item.product) // Find the selected product
                              ?.sizes.map((size) => (
                                <option key={size.id} value={size.id}>
                                  {size.name}{/* Display size and price */}
                                </option>
                              ))}
                          </CFormSelect> 
                        </td>
                
                        {/* Price */}
                        <td>{item.price || '-'}</td>
                
                        {/* Quantity */}
                        <td>
                          <CFormInput
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleQtyChange(index, parseInt(e.target.value, 10))}
                          />
                        </td>
                
                        {/* Total */}
                        <td>{item.total || '-'}</td>
                
                        {/* Actions */}
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
                  })}
                </tbody>
                                </table>
                                
                              </div>
                <CRow>
                  <CCol md={4}>
                    <CButton
                      color="primary"
                      onClick={addNewRow}
                      variant="outline"
                    >
                      <CIcon icon={cilPlus} /> {t('invoice.add_row')}
                    </CButton>
                  </CCol>
                  <CCol md={8} className="text-end">
                    <h5>{t('invoice.total_amount')}: ₹{state.totalAmount}</h5>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>{t('invoice.discount')}</CFormLabel>
                        <CFormInput
                          type="number"
                          name="discount"
                          value={state.discount}
                          onChange={handleChange}
                        />
                      </CCol>
                      <CCol md={6}>
                        <h5>{t('invoice.billed_amount')}: ₹{state.billedAmount}</h5>
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>{t('invoice.paid_amount')}</CFormLabel>
                        <CFormInput
                          type="number"
                          name="paidAmount"
                          value={state.paidAmount}
                          onChange={handleChange}
                        />
                      </CCol>
                      <CCol md={6}>
                        <h5>{t('invoice.balance_amount')}: ₹{state.balanceAmount}</h5>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                <CButton type="submit" color="success">
                  {t('invoice.submit')}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
    
}


export default Invoice;
