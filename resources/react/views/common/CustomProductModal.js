import React, { useState } from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CForm, CFormLabel, CFormInput } from '@coreui/react';
import { useTranslation } from 'react-i18next';

export default function CustomProductModal({ visible, setVisible, onAddProduct }) {
  const { t } = useTranslation("global");
  const [customProduct, setCustomProduct] = useState({ name: '', size: '', price: 0, qty: 0, total: 0 });

  const handleAddProduct = () => {
    // Check for valid values (name, size, price, and quantity)
    if (customProduct.name && customProduct.size && customProduct.price > 0 && customProduct.qty > 0) {
      onAddProduct({ ...customProduct, id: Date.now() });
      setCustomProduct({ name: '', size: '', price: 0, qty: 0, total: 0 });
      setVisible(false);
    } else {
      alert(t('LABELS.fill_all_fields')); // Show alert if validation fails
    }
  };

  const handlePriceChange = (e) => {
    const price = parseFloat(e.target.value);
    setCustomProduct((prevState) => ({
      ...prevState,
      price: price,
      total: price * prevState.qty, // Update total based on price and quantity
    }));
  };

  const handleQtyChange = (e) => {
    const qty = parseInt(e.target.value, 10);
    setCustomProduct((prevState) => ({
      ...prevState,
      qty: qty,
      total: prevState.price * qty, // Update total based on price and quantity
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
            placeholder="Product Price"
            value={customProduct.price}
            onChange={handlePriceChange}
            className="mb-3"
          />
          <CFormLabel>{t('LABELS.quantity')}</CFormLabel>
          <CFormInput
            type="number"
            placeholder="Product Quantity"
            value={customProduct.qty}
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
