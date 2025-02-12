import React, { useState } from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CForm, CFormLabel, CFormInput } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import { useToast } from './toast/ToastContext';



export default function CustomProductModal({ visible, setVisible, onAddProduct }) {
  const { t } = useTranslation("global");
  const [customProduct, setCustomProduct] = useState({ name: '', size: '', price: 0, qty: 0, total: 0 });
  const { showToast } = useToast();
  const handleAddProduct = () => {
    // Check for valid values (name, size, price, and quantity)
    if (customProduct.name && customProduct.size && customProduct.price > 0 && customProduct.qty > 0) {
      onAddProduct({ ...customProduct, id: Date.now() });
      setCustomProduct({ name: '', size: '', price: 0, qty: 0, total: 0 });
      setVisible(false);
    } else {
      showToast('danger','Please ensure all fields are filled before submitting.'); // Show alert if validation fails
    }
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;
  
    // Allow empty value for user input but store a valid number in state
    if (value === "") {
      setCustomProduct((prevState) => ({
        ...prevState,
        price: "",
        total: (prevState.qty || 0) * 0, // Handle empty price
      }));
      return;
    }
  
    const price = parseFloat(value) || 0; // Convert to float, fallback to 0
    setCustomProduct((prevState) => ({
      ...prevState,
      price: price,
      total: price * (prevState.qty || 0),
    }));
  };
  
  const handleQtyChange = (e) => {
    let value = e.target.value;
  
    // Allow empty value for user input but store a valid number in state
    if (value === "") {
      setCustomProduct((prevState) => ({
        ...prevState,
        qty: "",
        total: (prevState.price || 0) * 0, // Handle empty qty
      }));
      return;
    }
  
    const qty = parseInt(value, 10) || 0; // Convert to integer, fallback to 0
    setCustomProduct((prevState) => ({
      ...prevState,
      qty: qty,
      total: (prevState.price || 0) * qty,
    }));
  };
  
  
  

  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="CustomProductModalLabel"
    >
      <CModalHeader>
        <CModalTitle id="CustomProductModalLabel">Customize Product</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormLabel>{t('LABELS.product_name')}</CFormLabel>
          <CFormInput
            type="text"
            placeholder="Enter a Custom Product Name"
            value={customProduct.name}
            onChange={(e) => setCustomProduct({ ...customProduct, name: e.target.value })}
            className="mb-3"
          />
          <CFormLabel>{t('LABELS.product_size')}</CFormLabel>
          <CFormInput
            type="text"
            placeholder="Enter a product size(g/kg)"
            value={customProduct.size}
            onChange={(e) => setCustomProduct({ ...customProduct, size: e.target.value })}
            className="mb-3"
          />
          <CFormLabel>{t('LABELS.product_price')}</CFormLabel>
            <CFormInput
              type="number"
              value={customProduct.price === 0 ? "" : customProduct.price} // Allow empty display
              placeholder="0"
              onChange={handlePriceChange}
              className="mb-3"
            />

            <CFormLabel>{t('LABELS.quantity')}</CFormLabel>
            <CFormInput
              type="number"
              value={customProduct.qty === 0 ? "" : customProduct.qty} // Allow empty display
              placeholder="0"
              onChange={handleQtyChange}
              className="mb-3"
            />


          <CFormLabel>{t('LABELS.total')}</CFormLabel>
          <CFormInput
            type="number"
            value={customProduct.total}
            readOnly
            className="mb-3"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          {t("LABELS.close")}
        </CButton>
        <CButton color="primary" onClick={handleAddProduct}>
          {t("LABELS.add")}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
