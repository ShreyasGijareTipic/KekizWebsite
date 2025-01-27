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

  const [selectedCustomer, setSelectedCustomer] = useState(null);
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

  
  const calculateBalanceAmount = () => {
    const balance = state.billedAmount - state.paidAmount;
    setState((prevState) => ({ ...prevState, balanceAmount: balance }));
  };


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
    // Create a custom product entry
    const newProduct = {
      id: Date.now(), // Unique ID for the custom product
      name: customProduct.name, // Custom product name
      sizes: [
        {
          id: Date.now(), // Unique ID for the custom size
          name: customProduct.size, // Custom size name
          price: customProduct.price, // Custom size price
        },
      ],
    };
  
    // Add the custom product to the products array
    setState((prevState) => ({
      ...prevState,
      products: [...prevState.products, newProduct], // Add to product list
      items: [
        ...prevState.items,
        {
          product: newProduct.id, // Reference custom product ID
          size: newProduct.sizes[0].id, // Reference custom size ID
          price: customProduct.price, // Use custom price
          qty: customProduct.qty, // Use custom quantity
          total: customProduct.price * customProduct.qty, // Calculate total
        },
      ],
    }));
  
    // Close the modal
    setShowCustomOrderModal(false);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!state.customerId) {
        showToast('warning', 'Please select or add a customer.');
        return;
    }

    if (state.items.length === 0 || state.items.every((item) => item.qty <= 0)) {
        showToast('warning', 'Please add at least one product with a quantity greater than zero.');
        return;
    }

    const payload = {
        customer_id: state.customerId,
        total_amount: state.totalAmount,
        paid_amount: state.paidAmount,
        balance_amount: state.balanceAmount,
        products: state.items.map((item) => ({
            product_id: item.product,
            qty: item.qty,
            price: item.price,
        })),
        relatives: [
            {
                name: state.deliveryName,
                delivery_for: state.deliveryFor,
                birthdate: state.deliveryBirthdate,
            },
        ],
    };

    try {
        showSpinner();
        const response = await post('/api/order', payload);
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
     <NewCustomerModal hint={state.customerName} onSuccess={onCustomerAdded} visible={showCustomerModal} setVisible={setShowCustomerModal} />
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
                    value={state.customerName}
                    onChange={handleNameChange}
                    autoComplete="off"
                    required
                  />
                  {/* Display suggestions */}
                  {state.customerName?.length > 0 && (
  <ul className="suggestions-list">
    {suggestions.map((suggestion, index) => (
      <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
        {suggestion.name + ' (' + suggestion.mobile + ')'}
      </li>
    ))}

    {/* Show "New Customer" option if the name is not in the suggestions */}
    {!suggestions.some((suggestion) => suggestion.name === state.customerName) && (
      <li>
        <CBadge
          role="button"
          color="danger"
          onClick={() => setShowCustomerModal(true)}
        >
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
              {/* Selected Customer Information */}
              {customerName.id && (
                <div className="row">
                  <div className="col-sm-12 mt-1">
                    <CAlert color="success">
                      <p>
                        <strong>{t('invoice.name')}:</strong> {customerName.name} ({customerName.mobile}) <br />
                        <strong>{t('LABELS.birthdate')}: </strong> {customerName.birthdate}<br />
                            <strong>{t('LABELS.anniversary_date')}: </strong> {customerName.anniversary_date}
                        {customerName.address && (
                          <>
                            
                          </>
                        )}
                        {customerHistory && (
                          <>
                            {customerHistory.pendingPayment > 0 && (
                              <>
                                <br />
                                {t('invoice.credit')}{' '}
                                <strong className="text-danger">{customerHistory.pendingPayment}</strong> {t('invoice.rs')}
                              </>
                            )}
                            {customerHistory.pendingPayment < 0 && (
                              <>
                                <br />
                                {t('invoice.balance')} ({t('invoice.advance')}){' '}
                                <strong className="text-success">{customerHistory.pendingPayment * -1}</strong> {t('invoice.rs')}
                              </>
                            )}
                            {customerHistory.returnEmptyProducts
                              .filter((p) => p.quantity > 0)
                              .map((p) => (
                                <>
                                  <br />
                                  {t('invoice.collect')}{' '}
                                  <strong className="text-danger"> {p.quantity} </strong> {t('invoice.empty')} <strong className="text-danger"> {p.product_name} </strong>
                                </>
                              ))}
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
                        value={state.deliveryDate}
                        onChange={handleChange}
                        required={state.invoiceType == 2}
                        feedbackInvalid={t('invoice.select_date')}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel>Order Delivery Cake For</CFormLabel>
                    <CFormSelect
                      name="deliveryFor"
                      value={state.deliveryFor}
                      onChange={handleChange}
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
                    <CFormLabel>Recipient Name</CFormLabel>
                    <CFormInput
                      type="text"
                      name="deliveryName"
                      value={state.deliveryName}
                      placeholder="Enter Name"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <CFormLabel>Recipient Birthdate</CFormLabel>
                    <CFormInput
                      type="date"
                      name="deliveryBirthdate"
                      value={state.deliveryBirthdate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="table-responsive mb-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th>Qty.</th>
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
                    <CFormLabel htmlFor="paymentType">{t('invoice.payment_type')}</CFormLabel>
                    <CFormSelect
                      id="paymentType"
                      name="paymentType"
                      value={state.paymentType}
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
                      placeholder=""
                      name="paidAmount"
                      value={state.paidAmount}
                      onChange={handleChange}
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
                {state.paymentType == 1 && (
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
