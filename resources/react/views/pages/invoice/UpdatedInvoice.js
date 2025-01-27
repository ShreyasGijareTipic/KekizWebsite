
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
import { useSpinner } from '../../common/spinner/SpinnerProvider';
import { useTranslation } from 'react-i18next';

let debounceTimer;

const Invoice = () => {
  const [validated, setValidated] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [customerHistory, setCustomerHistory] = useState();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    customer_id: 0,
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceType: 1,
    items: [
      {
        product_id: '',
        product_sizes_id: '',
        quantity: 0,
        price: 0,
        total: 0,
      },
    ],
    totalAmount: 0,
    discount: 0,
    paidAmount: 0,
    balanceAmount: 0,
  });
  const [customerName, setCustomerName] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { showSpinner, hideSpinner } = useSpinner();
  const { showToast } = useToast();
  const { t, i18n } = useTranslation('global');
  const lng = i18n.language;

  const debounce = (func, delay) => {
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const searchCustomer = async (value) => {
    try {
      const customers = await getAPICall('/api/searchCustomer?searchQuery=' + value);
      if (customers?.length) {
        setSuggestions(customers);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      showToast('danger', 'Error occurred: ' + error);
    }
  };

  const debouncedSearchCustomer = debounce(searchCustomer, 750);

  const handleNameChange = (event) => {
    const value = event.target.value;
    setCustomerName({ name: value });
    if (value) {
      debouncedSearchCustomer(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCustomerName(suggestion);
    setInvoiceData((prev) => ({ ...prev, customer_id: suggestion.id }));
    setSuggestions([]);
    getCustomerHistory(suggestion.id);
  };

  const onCustomerAdded = (customer) => {
    handleSuggestionClick(customer);
    setShowCustomerModal(false);
  };

  const getCustomerHistory = async (customer_id) => {
    try {
      const response = await getAPICall('/api/customerHistory?id=' + customer_id);
      if (response) {
        setCustomerHistory(response);
      }
    } catch (error) {
      showToast('danger', 'Error occurred: ' + error);
    }
  };

  const fetchProduct = async () => {
    showSpinner();
    try {
      const response = await getAPICall('/api/product');
      const formattedProducts = response.map((product) => ({
        id: product.id,
        name: product.name,
        sizes: product.sizes.map((size) => ({
          id: size.id,
          size: size.size,
          price: size.oPrice,
        })),
      }));
      setProducts(formattedProducts);
    } catch (error) {
      showToast('danger', 'Error fetching products: ' + error.message);
    } finally {
      hideSpinner();
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  const handleProductChange = (e, index) => {
    const productId = e.target.value;
    const selectedProduct = products.find((p) => p.id == productId);
    if (selectedProduct) {
      setInvoiceData((prev) => {
        const updatedItems = [...prev.items];
        updatedItems[index] = {
          ...updatedItems[index],
          product_id: productId,
          product_sizes_id: '',
          price: 0,
          quantity: 0,
          total: 0,
        };
        return { ...prev, items: updatedItems };
      });
    }
  };

  const handleSizeChange = (e, index) => {
    const sizeId = e.target.value;
    const selectedProduct = products.find((p) =>
      p.sizes.some((size) => size.id == sizeId)
    );
    const selectedSize = selectedProduct?.sizes.find((size) => size.id == sizeId);
    setInvoiceData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        product_sizes_id: sizeId,
        price: selectedSize?.price || 0,
        total: updatedItems[index].quantity * (selectedSize?.price || 0),
      };
      return { ...prev, items: updatedItems, totalAmount: calculateTotal(updatedItems) };
    });
  };

  const handleQtyChange = (e, index) => {
    const quantity = e.target.value;
    setInvoiceData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity,
        total: quantity * updatedItems[index].price,
      };
      return { ...prev, items: updatedItems, totalAmount: calculateTotal(updatedItems) };
    });
  };

  const handleAddRow = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { product_id: '', product_sizes_id: '', quantity: 0, price: 0, total: 0 },
      ],
    }));
  };

  const handleRemoveRow = (index) => {
    setInvoiceData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems.splice(index, 1);
      return { ...prev, items: updatedItems, totalAmount: calculateTotal(updatedItems) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showSpinner();
      const response = await post('/api/order', invoiceData);
      if (response) {
        showToast('success', 'Invoice created successfully!');
        navigate('/invoice-details/' + response.id);
      }
    } catch (error) {
      showToast('danger', 'Error submitting invoice: ' + error.message);
    } finally {
      hideSpinner();
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <CRow>
      <NewCustomerModal visible={showCustomerModal} setVisible={setShowCustomerModal} />
      <QRCodeModal visible={showQR} setVisible={setShowQR} />
      <CCol xs={12}>
        <CCard>
          <CCardHeader>{t('invoice.new_invoice')}</CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Customer Name */}
              <CRow className="mb-3">
                <CCol>
                  <CFormInput
                    type="text"
                    placeholder="Customer Name"
                    required
                    value={customerName.name || ''}
                    onChange={handleNameChange}
                  />
                </CCol>
              </CRow>
              {/* Products */}
              {invoiceData.items.map((item, index) => (
                <CRow key={index} className="mb-3">
                  <CCol sm={4}>
                    <CFormSelect
                      value={item.product_id}
                      onChange={(e) => handleProductChange(e, index)}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol sm={4}>
                    <CFormSelect
                      value={item.product_sizes_id}
                      onChange={(e) => handleSizeChange(e, index)}
                      disabled={!item.product_id}
                    >
                      <option value="">Select Size</option>
                      {products
                        .find((p) => p.id == item.product_id)
                        ?.sizes.map((size) => (
                          <option key={size.id} value={size.id}>
                            {size.size} - ₹{size.price}
                          </option>
                        ))}
                    </CFormSelect>
                  </CCol>
                  <CCol sm={2}>
                    <CFormInput
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQtyChange(e, index)}
                    />
                  </CCol>
                  <CCol sm={2}>
                    <p className="mt-2">₹{item.total}</p>
                  </CCol>
                </CRow>
              ))}
              {/* Add Button */}
              <CRow>
                <CCol>
                  <CButton color="success" onClick={handleAddRow}>
                    <CIcon icon={cilPlus} /> Add Row
                  </CButton>
                </CCol>
              </CRow>
              {/* Total and Submit */}
              <CRow className="mt-4">
                <CCol>
                  <h4>Total: ₹{invoiceData.totalAmount}</h4>
                </CCol>
                <CCol>
                  <CButton color="primary" type="submit">
                    Submit Invoice
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Invoice;
